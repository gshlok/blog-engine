import { useState, useEffect, type ReactElement } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import CreatePostForm from '../components/CreatePostForm';
import {
  Box,
  Button,
  Heading,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Spinner,
  Flex,
} from '@chakra-ui/react';
import { Post } from '../types';

function AdminPage(): ReactElement {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchAdminPosts = async (): Promise<void> => {
    setError('');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/posts/admin/all`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch posts. You may need to log in again.');
      }
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAdminPosts();
    } else {
      setLoading(false);
    }
  }, [token]);

  const handleLogout = (): void => {
    logout();
    navigate('/');
  };
  
  const handleEdit = (id: string): void => {
    navigate(`/admin/edit/${id}`);
  };

  const handleDelete = async (id: string): Promise<void> => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/posts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete post');
      }
      fetchAdminPosts();
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
  };

  const handleDeleteAccount = async (): Promise<void> => {
    if (!window.confirm('Are you sure you want to permanently delete your account and all your posts? This cannot be undone.')) {
      return;
    }
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/me`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error('Failed to delete account.');
      }
      logout();
      navigate('/register');
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
  };

  return (
    <Box p={8}>
      <Flex justify="space-between" align="center" mb={4} wrap="wrap">
        <Heading>Admin Dashboard</Heading>
        <Box>
          <Button colorScheme="red" onClick={handleLogout}>
            Logout
          </Button>
          <Button variant="outline" colorScheme="red" onClick={handleDeleteAccount} ml={4}>
            Delete Account
          </Button>
        </Box>
      </Flex>
      <CreatePostForm onPostCreated={fetchAdminPosts} />
      <hr style={{ margin: '2rem 0' }} />
      {loading ? (
        <Spinner size="xl" />
      ) : error ? (
        <Text color="red.500">{error}</Text>
      ) : (
        <TableContainer>
          <Heading as="h3" size="lg" mb={4}>Manage Your Posts</Heading>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Title</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {posts.map((post) => (
                <Tr key={post.id}>
                  <Td>{post.title}</Td>
                  <Td>
                    <Button
                      colorScheme="blue"
                      size="sm"
                      mr={2}
                      onClick={() => handleEdit(post.id)}
                    >
                      Edit
                    </Button>
                    <Button
                      colorScheme="red"
                      size="sm"
                      onClick={() => handleDelete(post.id)}
                    >
                      Delete
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

export default AdminPage;