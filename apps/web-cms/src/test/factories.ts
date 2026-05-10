import type { S3Client } from "@aws-sdk/client-s3";
import { vi } from "vitest";

import type { DashboardSession } from "#/features/dashboard/server/get-dashboard-session";

export function createD1DatabaseMock() {
    return {
        prepare: vi.fn<() => D1PreparedStatement>(),
    } as unknown as D1Database;
}

export function createKVNamespaceMock() {
    return {
        delete: vi.fn<(key: string) => Promise<void>>(),
        get: vi.fn<(key: string) => Promise<string | null>>(),
        put: vi.fn<
            (key: string, value: string, options?: KVNamespacePutOptions) => Promise<void>
        >(),
    } as unknown as KVNamespace;
}

export function createWorkerBindings(overrides: Partial<Env> = {}): Env {
    return {
        BETTER_AUTH_SECRET: "test-secret-that-is-at-least-thirty-two-characters",
        BETTER_AUTH_TRUSTED_ORIGINS: "https://example.com",
        BETTER_AUTH_URL: "https://example.com",
        GOOGLE_CLIENT_ID: "google-client-id",
        GOOGLE_CLIENT_SECRET: "google-client-secret",
        MAIN_DB: createD1DatabaseMock(),
        MAIN_KV: createKVNamespaceMock(),
        MAIN_R2: {} as R2Bucket,
        PUBLIC_API_DESCRIPTION: "Public API foundation for the web CMS.",
        PUBLIC_API_TITLE: "Web CMS Public API",
        PUBLIC_API_VERSION: "0.1.0",
        ...overrides,
    } as Env;
}

export function createDashboardSession(
    overrides: Partial<DashboardSession> = {}
): DashboardSession {
    return {
        session: { id: "session-1" },
        user: { email: "editor@example.com" },
        ...overrides,
    } as DashboardSession;
}

export function createObjectBody(text: string) {
    return {
        transformToByteArray: vi.fn(async () => new TextEncoder().encode(text)),
    };
}

export function createS3ClientMock() {
    return {
        send: vi.fn<S3Client["send"]>(),
    } as unknown as S3Client;
}
