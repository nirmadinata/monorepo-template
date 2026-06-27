import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "#/components/ui/pagination";

import type { MediaLibraryPageData } from "../types";

interface MediaPaginationProps {
    currentPage: number;
    filters: MediaLibraryPageData["filters"];
    totalPages: number;
}

export function MediaPagination({ currentPage, filters, totalPages }: MediaPaginationProps) {
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
                                ? `?page=${currentPage - 1}&kind=${filters.kind}&search=${encodeURIComponent(filters.search)}&tag=${encodeURIComponent(filters.tag)}`
                                : undefined
                        }
                    />
                </PaginationItem>
                {pages.map((page) => (
                    <PaginationItem key={page}>
                        <PaginationLink
                            href={`?page=${page}&kind=${filters.kind}&search=${encodeURIComponent(filters.search)}&tag=${encodeURIComponent(filters.tag)}`}
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
                                ? `?page=${currentPage + 1}&kind=${filters.kind}&search=${encodeURIComponent(filters.search)}&tag=${encodeURIComponent(filters.tag)}`
                                : undefined
                        }
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
