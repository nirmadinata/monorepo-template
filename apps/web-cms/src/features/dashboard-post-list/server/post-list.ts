import { createServerFn, createServerOnlyFn } from "@tanstack/react-start";
import { and, desc, eq, inArray, like } from "drizzle-orm";
import * as v from "valibot";

import { getWorkerEnv } from "#/integrations/appenv/worker";
import { getCurrentSession } from "#/integrations/auth";
import { dbSchema, getDB } from "#/integrations/db";
import { getR2Client } from "#/integrations/r2/client";
import { storageRepository } from "#/integrations/r2/repository";

import { postListSearchSchema } from "../lib/form-schema";
import type { POST_STATUS_ENUM } from "../lib/post-list";

type PostListInput = v.InferOutput<typeof postListSearchSchema>;

const deletePostInputSchema = v.object({
    postId: v.pipe(v.number(), v.integer(), v.minValue(1)),
});

const requirePostSession = createServerOnlyFn(async () => {
    const session = await getCurrentSession();

    if (!session?.user) {
        throw new Error("You must be signed in to manage posts.");
    }

    return session;
});

const getPostListDB = createServerOnlyFn(async () => {
    const env = await getWorkerEnv();
    return getDB(env.MAIN_DB);
});

const createSignedUrl = createServerOnlyFn(async (storageKey: string) => {
    const client = getR2Client();
    const { url } = await storageRepository.generatePresignedDownloadUrl(client, {
        key: storageKey,
    });

    return url;
});

const buildPostListPage = createServerOnlyFn(async (input: PostListInput) => {
    const db = await getPostListDB();
    const filters = [];

    if (input.status && input.status !== "all") {
        filters.push(eq(dbSchema.posts.status, input.status));
    }

    if (input.search) {
        filters.push(like(dbSchema.posts.title, `%${input.search}%`));
    }

    const where = filters.length > 0 ? and(...filters) : undefined;
    const totalItems = await db.$count(dbSchema.posts, where);
    const totalPages = Math.max(1, Math.ceil(totalItems / input.pageSize));
    const page = Math.min(input.page, totalPages);
    const offset = (page - 1) * input.pageSize;

    const rows = await db
        .select({
            id: dbSchema.posts.id,
            slug: dbSchema.posts.slug,
            title: dbSchema.posts.title,
            excerpt: dbSchema.posts.excerpt,
            status: dbSchema.posts.status,
            coverImageId: dbSchema.posts.cover_image_id,
            publishedAt: dbSchema.posts.publishedAt,
            createdAt: dbSchema.posts.createdAt,
        })
        .from(dbSchema.posts)
        .where(where)
        .orderBy(desc(dbSchema.posts.createdAt), desc(dbSchema.posts.id))
        .limit(input.pageSize)
        .offset(offset);

    const coverImageIds = rows
        .map((row) => row.coverImageId)
        .filter((id): id is number => id !== null);

    const coverMediaMap = new Map<
        number,
        { id: number; storageKey: string; imageAltText: string | null; kind: string }
    >();

    if (coverImageIds.length > 0) {
        const coverRows = await db
            .select({
                id: dbSchema.medias.id,
                storageKey: dbSchema.medias.storageKey,
                imageAltText: dbSchema.medias.imageAltText,
                kind: dbSchema.mimeTypes.kind,
            })
            .from(dbSchema.medias)
            .innerJoin(dbSchema.mimeTypes, eq(dbSchema.medias.mimeTypeId, dbSchema.mimeTypes.id))
            .where(inArray(dbSchema.medias.id, coverImageIds));

        for (const media of coverRows) {
            coverMediaMap.set(media.id, media);
        }
    }

    const items = await Promise.all(
        rows.map(async (row) => {
            const coverMedia = row.coverImageId ? coverMediaMap.get(row.coverImageId) : undefined;

            let coverUrl: string | null = null;
            let coverError = false;

            if (coverMedia) {
                try {
                    coverUrl = await createSignedUrl(coverMedia.storageKey);
                } catch {
                    coverError = true;
                }
            }

            return {
                id: row.id,
                slug: row.slug,
                title: row.title,
                excerpt: row.excerpt,
                status: row.status as
                    | typeof POST_STATUS_ENUM.DRAFT
                    | typeof POST_STATUS_ENUM.PUBLISHED
                    | typeof POST_STATUS_ENUM.UNPUBLISHED,
                coverUrl,
                coverError,
                coverAltText: coverMedia?.imageAltText ?? null,
                coverKind: coverMedia?.kind ?? null,
                publishedAt: row.publishedAt instanceof Date ? row.publishedAt.getTime() : null,
                createdAt: row.createdAt instanceof Date ? row.createdAt.getTime() : null,
            };
        })
    );

    return {
        filters: {
            page,
            pageSize: input.pageSize,
            search: input.search,
            status: input.status,
        },
        items,
        pagination: {
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
            page,
            pageSize: input.pageSize,
            totalItems,
            totalPages,
        },
    };
});

const getPostById = createServerOnlyFn(async (postId: number) => {
    const db = await getPostListDB();
    const [post] = await db
        .select({
            id: dbSchema.posts.id,
        })
        .from(dbSchema.posts)
        .where(eq(dbSchema.posts.id, postId))
        .limit(1);

    return post ?? null;
});

export const getPostListPage = createServerFn({ method: "GET" })
    .validator(postListSearchSchema)
    .handler(async ({ data }) => {
        await requirePostSession();
        return buildPostListPage(data);
    });

export const deletePost = createServerFn({ method: "POST" })
    .validator(deletePostInputSchema)
    .handler(async ({ data }) => {
        await requirePostSession();
        const db = await getPostListDB();
        const post = await getPostById(data.postId);

        if (!post) {
            return { deleted: false, notFound: true };
        }

        await db.delete(dbSchema.posts).where(eq(dbSchema.posts.id, data.postId));

        return { deleted: true, notFound: false };
    });
