'use client';

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { PageMeta } from '@/lib/defines';
import { createUrl } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

export default function ListPagination({
    meta,
    scroll = true,
}: Readonly<{ meta: PageMeta; scroll?: boolean }>) {
    const { hasPrev, hasNext, totalPages } = meta;
    const currentPage = Number(useSearchParams().get('page')) || 1;
    const { push } = useRouter();
    // const { replace } = useRouter();

    const handleClick = (page: number) => {
        const searchParams = new URLSearchParams(location.search);
        const pathName = location.pathname;
        searchParams.set('page', String(page));
        scroll
            ? push(createUrl(pathName, searchParams))
            : push(createUrl(pathName, searchParams), { scroll: false });
        // replace(createUrl(pathName, searchParams));
    };
    const isPageVisible = (index: number) => {
        return (
            index === 0 ||
            index === currentPage - 2 ||
            index === currentPage - 1 ||
            index === currentPage ||
            index === totalPages - 1
        );
    };

    const pages = Array.from({ length: totalPages }, (_, i) => (
        <React.Fragment key={i}>
            {currentPage < totalPages - 2 && i > totalPages - 2 && (
                <PaginationEllipsis />
            )}
            <PaginationItem>
                <PaginationLink
                    className="cursor-pointer"
                    onClick={() => handleClick(i + 1)}
                    isActive={i + 1 === currentPage}
                >
                    {i + 1}
                </PaginationLink>
            </PaginationItem>
            {currentPage > 3 && i < 2 && <PaginationEllipsis />}
        </React.Fragment>
    )).filter((_, i) => isPageVisible(i));

    return (
        <Pagination>
            <PaginationContent>
                {hasPrev && (
                    <PaginationItem>
                        <PaginationPrevious
                            className="cursor-pointer"
                            onClick={() => handleClick(currentPage - 1)}
                        />
                    </PaginationItem>
                )}

                {pages}

                {hasNext && (
                    <PaginationItem>
                        <PaginationNext
                            className="cursor-pointer"
                            onClick={() => handleClick(currentPage + 1)}
                        />
                    </PaginationItem>
                )}
            </PaginationContent>
        </Pagination>
    );
}
