import React from 'react';
import {
  HStack,
  Button,
  Text,
  Select,
  Box,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { PaginationInfo } from '../types';

interface PaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  showLimitSelector?: boolean;
  limitOptions?: number[];
}

const Pagination: React.FC<PaginationProps> = ({
  pagination,
  onPageChange,
  onLimitChange,
  showLimitSelector = false,
  limitOptions = [10, 20, 50, 100]
}) => {
  const { currentPage, totalPages, totalPosts, hasNext, hasPrev } = pagination;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const handleLimitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (onLimitChange) {
      onLimitChange(parseInt(event.target.value));
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
      let end = Math.min(totalPages, start + maxVisible - 1);

      if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  const pageNumbers = getPageNumbers();

  return (
    <Box>
      {/* Posts count and limit selector */}
      <HStack justify="space-between" mb={4}>
        <Text fontSize="sm" color="gray.600">
          Showing {((currentPage - 1) * (pagination.totalPosts / totalPages)) + 1} to{' '}
          {Math.min(currentPage * (pagination.totalPosts / totalPages), totalPosts)} of{' '}
          {totalPosts} posts
        </Text>

        {showLimitSelector && onLimitChange && (
          <HStack spacing={2}>
            <Text fontSize="sm" color="gray.600">Show:</Text>
            <Select
              size="sm"
              value={Math.floor(pagination.totalPosts / totalPages)}
              onChange={handleLimitChange}
              maxW="80px"
            >
              {limitOptions.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </HStack>
        )}
      </HStack>

      {/* Pagination controls */}
      <HStack justify="center" spacing={2}>
        {/* First page */}
        <Tooltip label="First page">
          <IconButton
            aria-label="Go to first page"
            icon={<ChevronLeftIcon />}
            onClick={() => handlePageChange(1)}
            isDisabled={!hasPrev}
            size="sm"
            variant="outline"
          />
        </Tooltip>

        {/* Previous page */}
        <Tooltip label="Previous page">
          <IconButton
            aria-label="Go to previous page"
            icon={<ChevronLeftIcon />}
            onClick={() => handlePageChange(currentPage - 1)}
            isDisabled={!hasPrev}
            size="sm"
            variant="outline"
          />
        </Tooltip>

        {/* Page numbers */}
        {pageNumbers.map(page => {
          if (page === pageNumbers[0] && page > 1) {
            return (
              <React.Fragment key={`ellipsis-start-${page}`}>
                <Text color="gray.400">...</Text>
                <Button
                  size="sm"
                  variant={page === currentPage ? "solid" : "outline"}
                  colorScheme={page === currentPage ? "blue" : "gray"}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
              </React.Fragment>
            );
          }

          if (page === pageNumbers[pageNumbers.length - 1] && page < totalPages) {
            return (
              <React.Fragment key={`ellipsis-end-${page}`}>
                <Button
                  size="sm"
                  variant={page === currentPage ? "solid" : "outline"}
                  colorScheme={page === currentPage ? "blue" : "gray"}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
                <Text color="gray.400">...</Text>
              </React.Fragment>
            );
          }

          return (
            <Button
              key={page}
              size="sm"
              variant={page === currentPage ? "solid" : "outline"}
              colorScheme={page === currentPage ? "blue" : "gray"}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </Button>
          );
        })}

        {/* Next page */}
        <Tooltip label="Next page">
          <IconButton
            aria-label="Go to next page"
            icon={<ChevronRightIcon />}
            onClick={() => handlePageChange(currentPage + 1)}
            isDisabled={!hasNext}
            size="sm"
            variant="outline"
          />
        </Tooltip>

        {/* Last page */}
        <Tooltip label="Last page">
          <IconButton
            aria-label="Go to last page"
            icon={<ChevronRightIcon />}
            onClick={() => handlePageChange(totalPages)}
            isDisabled={!hasNext}
            size="sm"
            variant="outline"
          />
        </Tooltip>
      </HStack>

      {/* Page info */}
      <Text textAlign="center" fontSize="sm" color="gray.500" mt={2}>
        Page {currentPage} of {totalPages}
      </Text>
    </Box>
  );
};

export default Pagination;
