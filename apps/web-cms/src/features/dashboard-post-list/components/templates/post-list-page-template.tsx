import { Badge } from "#/components/ui/badge";

interface PostListPageTemplateProps {
    content: React.ReactNode;
    filters: React.ReactNode;
    totalItems: number;
}

export function PostListPageTemplate({ content, filters, totalItems }: PostListPageTemplateProps) {
    return (
        <div className="flex flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <section className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
                <div className="flex flex-col gap-3">
                    <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                        Posts
                    </h1>
                    <p className="max-w-3xl text-sm leading-7 text-muted-foreground sm:text-[0.95rem]">
                        Browse, search, and manage all posts.
                    </p>
                </div>

                <div className="flex items-center justify-start gap-3 lg:justify-end">
                    <Badge variant="outline">{totalItems} posts</Badge>
                </div>
            </section>

            {filters}
            {content}
        </div>
    );
}
