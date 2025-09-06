import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  VStack,
  HStack,
  IconButton,
  Text,
  Badge,
  useColorModeValue,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, AddIcon } from '@chakra-ui/icons';

interface Tag {
  id: string;
  name: string;
  slug: string;
  _count?: {
    posts: number;
  };
}

interface TagManagerProps {
  token: string;
}

const TagManager: React.FC<TagManagerProps> = ({ token }) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [deleteTag, setDeleteTag] = useState<Tag | null>(null);
  const [formData, setFormData] = useState({ name: '' });
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const toast = useToast();

  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/tags`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTags(data.tags || []);
      } else {
        throw new Error('Failed to fetch tags');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch tags',
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
      const url = editingTag 
        ? `${import.meta.env.VITE_API_BASE_URL}/api/tags/${editingTag.id}`
        : `${import.meta.env.VITE_API_BASE_URL}/api/tags`;
      
      const method = editingTag ? 'PUT' : 'POST';
      
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
        throw new Error(errorData.error || 'Failed to save tag');
      }
      
      const data = await response.json();
      
      if (editingTag) {
        setTags(prev => prev.map(tag => 
          tag.id === editingTag.id ? data.tag : tag
        ));
        toast({
          title: 'Success',
          description: 'Tag updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        setTags(prev => [...prev, data.tag]);
        toast({
          title: 'Success',
          description: 'Tag created successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      
      handleClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save tag',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag);
    setFormData({ name: tag.name });
    onEditOpen();
  };

  const handleDelete = async () => {
    if (!deleteTag) return;
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/tags/${deleteTag.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setTags(prev => prev.filter(tag => tag.id !== deleteTag.id));
        toast({
          title: 'Success',
          description: 'Tag deleted successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete tag');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete tag',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      onDeleteClose();
      setDeleteTag(null);
    }
  };

  const handleClose = () => {
    setEditingTag(null);
    setFormData({ name: '' });
    onEditClose();
  };

  const openDeleteDialog = (tag: Tag) => {
    setDeleteTag(tag);
    onDeleteOpen();
  };

  if (loading) {
    return (
      <Box p={6} bg={cardBg} borderRadius="lg" border="1px solid" borderColor={borderColor}>
        <Text>Loading tags...</Text>
      </Box>
    );
  }

  return (
    <Box p={6} bg={cardBg} borderRadius="lg" border="1px solid" borderColor={borderColor}>
      <HStack justify="space-between" mb={6}>
        <Text fontSize="2xl" fontWeight="bold">Tag Management</Text>
        <Button
          leftIcon={<AddIcon />}
          colorScheme="blue"
          onClick={() => {
            setEditingTag(null);
            setFormData({ name: '' });
            onEditOpen();
          }}
        >
          Add New Tag
        </Button>
      </HStack>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Slug</Th>
            <Th>Posts</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {tags.map((tag) => (
            <Tr key={tag.id}>
              <Td fontWeight="medium">{tag.name}</Td>
              <Td>
                <Badge colorScheme="gray" variant="outline">
                  {tag.slug}
                </Badge>
              </Td>
              <Td>
                <Badge colorScheme="blue">
                  {tag._count?.posts || 0} posts
                </Badge>
              </Td>
              <Td>
                <HStack spacing={2}>
                  <IconButton
                    aria-label="Edit tag"
                    icon={<EditIcon />}
                    size="sm"
                    colorScheme="blue"
                    variant="ghost"
                    onClick={() => handleEdit(tag)}
                  />
                  <IconButton
                    aria-label="Delete tag"
                    icon={<DeleteIcon />}
                    size="sm"
                    colorScheme="red"
                    variant="ghost"
                    onClick={() => openDeleteDialog(tag)}
                  />
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* Edit/Create Modal */}
      <Modal isOpen={isEditOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {editingTag ? 'Edit Tag' : 'Create New Tag'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Box as="form" onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Tag Name</FormLabel>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ name: e.target.value })}
                    placeholder="Enter tag name"
                  />
                </FormControl>
                
                <HStack spacing={3} w="100%" justify="flex-end">
                  <Button onClick={handleClose}>Cancel</Button>
                  <Button type="submit" colorScheme="blue">
                    {editingTag ? 'Update' : 'Create'}
                  </Button>
                </HStack>
              </VStack>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Tag</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Text>
              Are you sure you want to delete the tag "{deleteTag?.name}"? 
              {deleteTag?._count?.posts && deleteTag._count.posts > 0 && (
                <Text color="red.500" mt={2}>
                  Warning: This tag is used in {deleteTag._count.posts} post(s). 
                  Deleting it will remove the tag from all posts.
                </Text>
              )}
            </Text>
            
            <HStack spacing={3} mt={6} justify="flex-end">
              <Button onClick={onDeleteClose}>Cancel</Button>
              <Button colorScheme="red" onClick={handleDelete}>
                Delete
              </Button>
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default TagManager;
