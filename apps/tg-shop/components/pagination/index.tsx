"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  Pagination as PaginationComponent,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function Pagination({
  totalPages,
  hasNext,
  hasPrev,
  page,
  limit,
}: {
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  page: number;
  limit: number;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const generatePageLink = (newPage: number): string => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    params.set("limit", limit.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <PaginationComponent>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={hasPrev ? generatePageLink(page - 1) : "#"}
            className={!hasPrev ? "cursor-not-allowed opacity-50" : ""}
            aria-disabled={!hasPrev}
          />
        </PaginationItem>
        {page > 2 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {page > 1 && (
          <PaginationItem>
            <PaginationLink href={generatePageLink(page - 1)}>
              {page - 1}
            </PaginationLink>
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationLink isActive>{page}</PaginationLink>
        </PaginationItem>
        {page < totalPages && (
          <PaginationItem>
            <PaginationLink href={generatePageLink(page + 1)}>
              {page + 1}
            </PaginationLink>
          </PaginationItem>
        )}
        {page < totalPages - 1 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        <PaginationNext
          href={hasNext ? generatePageLink(page - 1) : "#"}
          className={!hasNext ? "cursor-not-allowed opacity-50" : ""}
          aria-disabled={!hasNext}
        />
      </PaginationContent>
    </PaginationComponent>
  );
}
