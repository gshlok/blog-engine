import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  HStack,
  Select,
  Input,
  InputGroup,
  InputLeftElement,
  Flex,
  Text,
  useToast,
  Spinner,
} from '@chakra-ui/react';
import { FiMoreVertical, FiSearch, FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';

interface Post {
  id: string;
  title: string;
  status: string;
  featured: boolean;
  publishedAt: string | null;
  createdAt: string;
  _count: {
    comments: number;
  };
}

export default function PostsManagement() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [featured, setFeatured] = useState('');
  const { token } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const fetchPosts = async () => {
    try {
      let url = `${import.meta.env.VITE_API_BASE_URL}/api/posts/admin/all?`;
      if (status) url += `status=${status}&`;
      if (featured) url += `featured=${featured}&`;
      if (search) url += `search=${encodeURIComponent(search)}&`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }

      const { posts: fetchedPosts } = await response.json();
      setPosts(fetchedPosts || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to fetch posts',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchPosts();
    }
  }, [status, featured, token]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/posts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      toast({
        title: 'Post deleted',
        status: 'success',
        duration: 3000,
      });

      fetchPosts();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete post',
        status: 'error',
        duration: 5000,
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'green';
      case 'DRAFT':
        return 'gray';
      case 'SCHEDULED':
        return 'purple';
      case 'PRIVATE':
        return 'red';
      default:
        return 'gray';
    }
  };

  const handleSearch = () => {
    fetchPosts();
  };

  return (
    <Box>
      <Flex mb={4} gap={4} flexWrap="wrap">
        <InputGroup maxW="300px">
          <InputLeftElement>
            <FiSearch />
          </InputLeftElement>
          <Input
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </InputGroup>

        <Select
          maxW="200px"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          placeholder="Filter by status"
        >
          <option value="PUBLISHED">Published</option>
          <option value="DRAFT">Draft</option>
          <option value="SCHEDULED">Scheduled</option>
          <option value="PRIVATE">Private</option>
        </Select>

        <Select
          maxW="200px"
          value={featured}
          onChange={(e) => setFeatured(e.target.value)}
          placeholder="Filter featured"
        >
          <option value="true">Featured</option>
          <option value="false">Not Featured</option>
        </Select>

        <Button colorScheme="blue" onClick={() => navigate('/admin/posts/new')}>
          New Post
        </Button>
      </Flex>

      {loading ? (
        <Flex justify="center" align="center" minH="200px">
          <Spinner size="xl" />
        </Flex>
      ) : posts.length === 0 ? (
        <Text textAlign="center" py={8}>
          No posts found
        </Text>
      ) : (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Title</Th>
              <Th>Status</Th>
              <Th>Comments</Th>
              <Th>Created</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {posts.map((post) => (
              <Tr key={post.id}>
                <Td>
                  <HStack>
                    <Text>{post.title}</Text>
                    {post.featured && (
                      <Badge colorScheme="yellow">Featured</Badge>
                    )}
                  </HStack>
                </Td>
                <Td>
                  <Badge colorScheme={getStatusColor(post.status)}>
                    {post.status.toLowerCase()}
                  </Badge>
                </Td>
                <Td>{post._count.comments}</Td>
                <Td>{new Date(post.createdAt).toLocaleDateString()}</Td>
                <Td>
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      icon={<FiMoreVertical />}
                      variant="ghost"
                      size="sm"
                    />
                    <MenuList>
                      <MenuItem
                        icon={<FiEdit2 />}
                        onClick={() => navigate(`/admin/posts/edit/${post.id}`)}
                      >
                        Edit
                      </MenuItem>
                      <MenuItem
                        icon={<FiEye />}
                        onClick={() => window.open(`/posts/${post.id}`, '_blank')}
                      >
                        View
                      </MenuItem>
                      <MenuItem
                        icon={<FiTrash2 />}
                        onClick={() => handleDelete(post.id)}
                        color="red.500"
                      >
                        Delete
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
}
