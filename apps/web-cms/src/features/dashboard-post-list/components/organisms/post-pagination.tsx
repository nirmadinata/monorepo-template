import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "#/components/ui/pagination";

import type { PostListPageData } from "../types";

interface PostPaginationProps {
    currentPage: number;
    filters: PostListPageData["filters"];
    totalPages: number;
}

export function PostPagination({ currentPage, filters, totalPages }: PostPaginationProps) {
    if (totalPages <= 1) {
        return null;
    }

    const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

    return (
        <Pagination className="justify-end">
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        aria-disabled={currentPage <= 1}
                        href={
                            currentPage > 1
                                ? `?page=${currentPage - 1}&status=${filters.status}&search=${encodeURIComponent(filters.search)}`
                                : undefined
                        }
                    />
                </PaginationItem>
                {pages.map((page) => (
                    <PaginationItem key={page}>
                        <PaginationLink
                            href={`?page=${page}&status=${filters.status}&search=${encodeURIComponent(filters.search)}`}
                            isActive={page === currentPage}
                        >
                            {page}
                        </PaginationLink>
                    </PaginationItem>
                ))}
                <PaginationItem>
                    <PaginationNext
                        aria-disabled={currentPage >= totalPages}
                        href={
                            currentPage < totalPages
                                ? `?page=${currentPage + 1}&status=${filters.status}&search=${encodeURIComponent(filters.search)}`
                                : undefined
                        }
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
