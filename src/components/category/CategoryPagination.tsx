
import { Link } from 'react-router-dom';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface CategoryPaginationProps {
  currentPage: number;
  totalPages: number;
  category?: string;
  subcategory?: string;
  onPageChange?: (page: number) => void;
}

const CategoryPagination = ({ currentPage, totalPages, category, subcategory, onPageChange }: CategoryPaginationProps) => {
  const getPageUrl = (page: number) => {
    const basePath = subcategory ? `/category/${category}/${subcategory}` : `/category/${category}`;
    return `${basePath}?page=${page}`;
  };

  const handlePageClick = (page: number, e: React.MouseEvent) => {
    if (onPageChange) {
      e.preventDefault();
      onPageChange(page);
    }
  };

  const getVisiblePages = () => {
    const pages = [];
    const showEllipsis = totalPages > 7;
    
    if (!showEllipsis) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    // Always show first page
    pages.push(1);

    if (currentPage <= 4) {
      // Show pages 2-5 and ellipsis
      for (let i = 2; i <= Math.min(5, totalPages - 1); i++) {
        pages.push(i);
      }
      if (totalPages > 5) {
        pages.push('ellipsis');
      }
    } else if (currentPage >= totalPages - 3) {
      // Show ellipsis and last 4 pages
      if (totalPages > 5) {
        pages.push('ellipsis');
      }
      for (let i = Math.max(totalPages - 4, 2); i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show ellipsis, current page area, ellipsis
      pages.push('ellipsis');
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pages.push(i);
      }
      pages.push('ellipsis');
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex justify-center mt-16">
      <Pagination>
        <PaginationContent>
          {/* Previous */}
          {currentPage > 1 && (
            <PaginationItem>
              <PaginationPrevious 
                href={getPageUrl(currentPage - 1)}
                onClick={(e) => handlePageClick(currentPage - 1, e)}
              />
            </PaginationItem>
          )}

          {/* Page Numbers */}
          {getVisiblePages().map((page, index) => (
            <PaginationItem key={index}>
              {page === 'ellipsis' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href={getPageUrl(page as number)}
                  isActive={currentPage === page}
                  onClick={(e) => handlePageClick(page as number, e)}
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          {/* Next */}
          {currentPage < totalPages && (
            <PaginationItem>
              <PaginationNext 
                href={getPageUrl(currentPage + 1)}
                onClick={(e) => handlePageClick(currentPage + 1, e)}
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default CategoryPagination;
