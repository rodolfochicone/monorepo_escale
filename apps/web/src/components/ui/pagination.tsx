"use client";

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasNext: boolean;
  hasPrev: boolean;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  hasNext,
  hasPrev,
  className
}: PaginationProps) {
  console.log('🔍 Pagination Debug:', {
    currentPage,
    totalPages,
    hasNext,
    hasPrev,
    canGoPrev: currentPage > 1,
    canGoNext: currentPage < totalPages
  });

  const generatePageNumbers = () => {
    const pages: (number | string)[] = [];
    const delta = 2;

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > delta + 2) {
        pages.push("...");
      }

      const start = Math.max(2, currentPage - delta);
      const end = Math.min(totalPages - 1, currentPage + delta);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - delta - 1) {
        pages.push("...");
      }

      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();

  const canGoPrev = hasPrev && currentPage > 1;
  const canGoNext = hasNext && currentPage < totalPages;

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={cn("flex items-center justify-center space-x-2", className)}>
      {/* Botão Anterior */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          console.log('🔄 Clicou Previous - Indo para página:', currentPage - 1);
          onPageChange(currentPage - 1);
        }}
        disabled={!canGoPrev}
        className="h-8 w-8 p-0"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Página anterior</span>
      </Button>

      {pageNumbers.map((page, index) => (
        <div key={index}>
          {page === "..." ? (
            <div className="flex h-8 w-8 items-center justify-center">
              <MoreHorizontal className="h-4 w-4" />
            </div>
          ) : (
            <Button
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => {
                console.log('🔄 Clicou página:', page);
                onPageChange(page as number);
              }}
              className="h-8 w-8 p-0"
            >
              {page}
            </Button>
          )}
        </div>
      ))}

      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          console.log('🔄 Clicou Next - Indo para página:', currentPage + 1);
          onPageChange(currentPage + 1);
        }}
        disabled={!canGoNext}
        className="h-8 w-8 p-0"
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Próxima página</span>
      </Button>
    </div>
  );
}

interface PaginationInfoProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  className?: string;
}

export function PaginationInfo({
  currentPage,
  pageSize,
  totalItems,
  className
}: PaginationInfoProps) {
  const start = Math.min((currentPage - 1) * pageSize + 1, totalItems);
  const end = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className={cn("text-sm text-muted-foreground", className)}>
      Exibindo {start}-{end} de {totalItems} resultado{totalItems !== 1 ? 's' : ''}
    </div>
  );
}
