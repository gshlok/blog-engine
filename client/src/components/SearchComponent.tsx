import React, { useState, useEffect } from 'react';
import {
  Box, Input, InputGroup, InputLeftElement, VStack, HStack, Select, Button, Text, Badge, Flex,
  useDisclosure, Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton,
  Checkbox, Divider, IconButton, Tooltip
} from '@chakra-ui/react';
import { SearchIcon, CloseIcon } from '@chakra-ui/icons';
import { SearchFilters, Category, Tag } from '../types';

interface SearchComponentProps {
  onSearch: (filters: SearchFilters) => void;
  categories: Category[];
  tags: Tag[];
  isLoading?: boolean;
}

const SearchComponent: React.FC<SearchComponentProps> = ({
  onSearch, categories, tags
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({ sort: 'newest' });
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSearch = () => {
    const searchFilters: SearchFilters = { ...filters, query: searchQuery || undefined };
    onSearch(searchFilters);
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ sort: 'newest' });
    setSearchQuery('');
  };

  const hasActiveFilters = searchQuery || filters.category || filters.tags?.length || filters.featured !== undefined || filters.sort !== 'newest';

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (hasActiveFilters) handleSearch();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [filters]); // Warning: if you want debounce for searchQuery too, add it here

  return (
    <Box>
      <VStack spacing={4} align="stretch">
        {/* Search Bar */}
        <HStack>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder="Search posts, tags, or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </InputGroup>
          <Tooltip label="Advanced Filters">
            <IconButton
              aria-label="Advanced filters"
              icon={<SearchIcon />} // replaced FilterIcon with SearchIcon as placeholder
              onClick={onOpen}
              variant={hasActiveFilters ? "solid" : "outline"}
              colorScheme={hasActiveFilters ? "blue" : "gray"}
            />
          </Tooltip>
          {hasActiveFilters && (
            <Tooltip label="Clear all filters">
              <IconButton
                aria-label="Clear filters"
                icon={<CloseIcon />}
                onClick={clearFilters}
                variant="ghost"
                colorScheme="red"
              />
            </Tooltip>
          )}
        </HStack>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <Box>
            <Text fontSize="sm" color="gray.600" mb={2}>
              Active filters:
            </Text>
            <Flex wrap="wrap" gap={2}>
              {searchQuery && (
                <Badge colorScheme="blue" variant="subtle">
                  Query: {searchQuery}
                </Badge>
              )}
              {filters.category && (
                <Badge colorScheme="green" variant="subtle">
                  Category: {categories.find(c => c.slug === filters.category)?.name}
                </Badge>
              )}
              {filters.tags?.map(tag => (
                <Badge key={tag} colorScheme="purple" variant="subtle">
                  Tag: {tags.find(t => t.slug === tag)?.name}
                </Badge>
              ))}
              {filters.featured !== undefined && (
                <Badge colorScheme="orange" variant="subtle">
                  Featured: {filters.featured ? 'Yes' : 'No'}
                </Badge>
              )}
              {filters.sort && filters.sort !== 'newest' && (
                <Badge colorScheme="teal" variant="subtle">
                  Sort: {filters.sort}
                </Badge>
              )}
            </Flex>
          </Box>
        )}

        {/* Quick Sort */}
        <HStack justify="center">
          <Text fontSize="sm" color="gray.600">Sort by:</Text>
          <Select
            size="sm"
            value={filters.sort || 'newest'}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
            maxW="200px"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title">Title A-Z</option>
            <option value="views">Most Viewed</option>
            <option value="likes">Most Liked</option>
          </Select>
        </HStack>
      </VStack>
      {/* Advanced Filters Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Advanced Filters</DrawerHeader>
          <DrawerBody>
            <VStack spacing={6} align="stretch">
              {/* Category Filter */}
              <Box>
                <Text fontWeight="semibold" mb={2}>Category</Text>
                <Select
                  placeholder="All categories"
                  value={filters.category || ''}
                  onChange={(e) => handleFilterChange('category', e.target.value || undefined)}
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.slug}>
                      {category.name} ({category._count?.posts || 0})
                    </option>
                  ))}
                </Select>
              </Box>
              <Divider />
              {/* Tags Filter */}
              <Box>
                <Text fontWeight="semibold" mb={2}>Tags</Text>
                <VStack align="start" spacing={2} maxH="200px" overflowY="auto">
                  {tags.map(tag => (
                    <Checkbox
                      key={tag.id}
                      isChecked={filters.tags?.includes(tag.slug)}
                      onChange={(e) => {
                        const currentTags = filters.tags || [];
                        if (e.target.checked) {
                          handleFilterChange('tags', [...currentTags, tag.slug]);
                        } else {
                          handleFilterChange('tags', currentTags.filter(t => t !== tag.slug));
                        }
                      }}
                    >
                      {tag.name} ({tag._count?.posts || 0})
                    </Checkbox>
                  ))}
                </VStack>
              </Box>
              <Divider />
              {/* Featured Filter */}
              <Box>
                <Text fontWeight="semibold" mb={2}>Featured Posts</Text>
                <Select
                  placeholder="All posts"
                  value={filters.featured === undefined ? '' : filters.featured.toString()}
                  onChange={(e) => {
                    const value = e.target.value;
                    handleFilterChange('featured', value === '' ? undefined : value === 'true');
                  }}
                >
                  <option value="true">Featured only</option>
                  <option value="false">Not featured</option>
                </Select>
              </Box>
              <Divider />
              {/* Apply/Clear Buttons */}
              <HStack justify="space-between">
                <Button onClick={clearFilters} variant="outline" colorScheme="red">
                  Clear All
                </Button>
                <Button onClick={onClose} colorScheme="blue">
                  Apply Filters
                </Button>
              </HStack>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default SearchComponent;
