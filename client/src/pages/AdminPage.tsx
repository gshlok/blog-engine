import { useEffect, type ReactElement } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import CreatePostForm from '../components/CreatePostForm';
import {
  Box,
  Flex,
  Heading,
  Button,
  Text,
  VStack,
  Card,
  CardBody,
  Icon,
  SimpleGrid,
} from '@chakra-ui/react';
import { FiEdit3, FiList } from 'react-icons/fi';

export default function AdminPage(): ReactElement {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const handleLogout = (): void => {
    logout();
    navigate('/');
  };

  if (!token) {
    return <></>;
  }

  return (
    <Box p={4}>
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Heading size="lg">Admin Dashboard</Heading>
        <Button onClick={handleLogout} colorScheme="red" variant="outline">
          Logout
        </Button>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <Card>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <Flex align="center" gap={2}>
                <Icon as={FiList} />
                <Text fontSize="lg">Manage Posts</Text>
              </Flex>
              <Text color="gray.600">View, edit, and delete your blog posts</Text>
              <Button
                as={RouterLink}
                to="/admin/posts"
                colorScheme="blue"
                leftIcon={<FiList />}
              >
                Go to Posts
              </Button>
            </VStack>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <Flex align="center" gap={2}>
                <Icon as={FiEdit3} />
                <Text fontSize="lg">Create New Post</Text>
              </Flex>
              <Text color="gray.600">Write a new blog post</Text>
              <Button
                as={RouterLink}
                to="/admin/posts/new"
                colorScheme="green"
                leftIcon={<FiEdit3 />}
              >
                Create Post
              </Button>
            </VStack>
          </CardBody>
        </Card>
      </SimpleGrid>
    </Box>
  );
}