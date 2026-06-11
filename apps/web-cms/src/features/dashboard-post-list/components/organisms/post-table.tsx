import { Badge } from "#/components/ui/badge";
import { Card, CardContent } from "#/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "#/components/ui/table";

import { formatPostStatus } from "../../lib/post-list";
import { PostCoverPreview } from "../atoms/post-cover-preview";
import { PostDeleteAction } from "../molecules/post-delete-action";
import type { PostListPageData } from "../types";

interface PostTableProps {
    items: PostListPageData["items"];
    onDeleted: () => Promise<void>;
}

export function PostTable({ items, onDeleted }: PostTableProps) {
    return (
        <Card className="border-border/75 bg-card/80 shadow-none">
            <CardContent className="px-0 py-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="px-4">Cover</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="px-4 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="px-4">
                                    <PostCoverPreview item={item} />
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1">
                                        <span className="font-medium text-foreground">
                                            {item.title}
                                        </span>
                                        {item.excerpt ? (
                                            <span className="line-clamp-1 text-xs text-muted-foreground">
                                                {item.excerpt}
                                            </span>
                                        ) : null}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline">{formatPostStatus(item.status)}</Badge>
                                </TableCell>
                                <TableCell className="px-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <PostDeleteAction
                                            postId={item.id}
                                            postTitle={item.title}
                                            onDeleted={onDeleted}
                                        />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
