import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  Input,
  Textarea,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Badge,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftAddon
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, AddIcon } from '@chakra-ui/icons';
import { Category } from '../../types';

interface CategoryManagerProps {
  token: string;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({ token }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteCategory, setDeleteCategory] = useState<Category | null>(null);

  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();

  const toast = useToast();
  const cancelRef = useRef<HTMLButtonElement | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3182CE'
  });

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/categories`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch categories',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingCategory
        ? `${import.meta.env.VITE_API_BASE_URL}/api/categories/${editingCategory.id}`
        : `${import.meta.env.VITE_API_BASE_URL}/api/categories`;

      const method = editingCategory ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save category');
      }

      const data = await response.json();

      if (editingCategory) {
        setCategories(prev => prev.map(cat =>
          cat.id === editingCategory.id ? data.category : cat
        ));
        toast({
          title: 'Success',
          description: 'Category updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        setCategories(prev => [...prev, data.category]);
        toast({
          title: 'Success',
          description: 'Category created successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }

      handleClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save category',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      color: category.color || '#3182CE'
    });
    onEditOpen();
  };

  const handleDelete = async () => {
    if (!deleteCategory) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/categories/${deleteCategory.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete category');
      }

      setCategories(prev => prev.filter(cat => cat.id !== deleteCategory.id));
      toast({
        title: 'Success',
        description: 'Category deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete category',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setDeleteCategory(null);
      onDeleteClose();
    }
  };

  const handleCreate = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      color: '#3182CE'
    });
    onCreateOpen();
  };

  const handleClose = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      color: '#3182CE'
    });
    onEditClose();
    onCreateClose();
  };

  if (loading) {
    return <Text>Loading categories...</Text>;
  }

  return (
    <Box>
      <HStack justify="space-between" mb={6}>
        <Text fontSize="2xl" fontWeight="bold">Category Management</Text>
        <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={handleCreate}>
          Add Category
        </Button>
      </HStack>

      {/* Categories Table */}
      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Slug</Th>
              <Th>Description</Th>
              <Th>Color</Th>
              <Th>Posts</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {categories.map(category => (
              <Tr key={category.id}>
                <Td fontWeight="medium">{category.name}</Td>
                <Td>
                  <Badge variant="outline" colorScheme="gray">
                    {category.slug}
                  </Badge>
                </Td>
                <Td maxW="200px" isTruncated>
                  {category.description || '-'}
                </Td>
                <Td>
                  <HStack>
                    <Box
                      w="20px"
                      h="20px"
                      borderRadius="full"
                      bg={category.color || '#3182CE'}
                      border="1px solid"
                      borderColor="gray.200"
                    />
                    <Text fontSize="sm">{category.color || '#3182CE'}</Text>
                  </HStack>
                </Td>
                <Td>
                  <Badge colorScheme="blue">
                    {category._count?.posts || 0}
                  </Badge>
                </Td>
                <Td>
                  <HStack spacing={2}>
                    <IconButton
                      aria-label="Edit category"
                      icon={<EditIcon />}
                      size="sm"
                      variant="outline"
                      colorScheme="blue"
                      onClick={() => handleEdit(category)}
                    />
                    <IconButton
                      aria-label="Delete category"
                      icon={<DeleteIcon />}
                      size="sm"
                      variant="outline"
                      colorScheme="red"
                      onClick={() => {
                        setDeleteCategory(category);
                        onDeleteOpen();
                      }}
                    />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* Create/Edit Modal */}
      <Modal isOpen={isEditOpen || isCreateOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {editingCategory ? 'Edit Category' : 'Create Category'}
          </ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit}>
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Name</FormLabel>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter category name"
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter category description (optional)"
                    rows={3}
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Color</FormLabel>
                  <InputGroup>
                    <InputLeftAddon>#</InputLeftAddon>
                    <Input
                      value={formData.color?.replace('#', '')}
                      onChange={(e) => setFormData(prev => ({ ...prev, color: `#${e.target.value}` }))}
                      placeholder="3182CE"
                      maxLength={6}
                    />
                  </InputGroup>
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={handleClose}>
                Cancel
              </Button>
              <Button colorScheme="blue" type="submit">
                {editingCategory ? 'Update' : 'Create'}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation */}
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Category
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete "{deleteCategory?.name}"? 
              {deleteCategory?._count?.posts && deleteCategory._count.posts > 0 && (
                <Text mt={2} color="red.500">
                  Warning: This category has {deleteCategory._count.posts} posts. 
                  You cannot delete it until all posts are reassigned or removed.
                </Text>
              )}
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose}>Cancel</Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default CategoryManager;
