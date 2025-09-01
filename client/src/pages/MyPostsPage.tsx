import { useState, useEffect, type ReactElement } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, Heading, Text, Spinner, UnorderedList, ListItem, Button, Flex } from '@chakra-ui/react';
import { Post } from '../types';

function MyPostsPage(): ReactElement {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/posts/admin/all`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error('Could not fetch your posts.');
        }
        const data = await response.json();
        setPosts(data);
      } catch (e) {
        if (e instanceof Error) setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [token]);

  if (loading) return <Spinner size="xl" />;
  if (error) return <Text color="red.500">Error: {error}</Text>;

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading as="h2" size="xl">My Posts</Heading>
        <Button colorScheme="green" onClick={() => navigate('/admin')}>
          Go to Dashboard
        </Button>
      </Flex>
      {posts.length > 0 ? (
        <UnorderedList spacing={5} styleType="none" ml={0}>
          {posts.map((post) => (
            <ListItem key={post.id} p={4} borderWidth={1} borderRadius="md" _hover={{ shadow: "md" }}>
              <Link to={`/posts/${post.slug}`}>
                <Heading as="h3" size="md" _hover={{ color: 'blue.500' }}>{post.title}</Heading>
              </Link>
            </ListItem>
          ))}
        </UnorderedList>
      ) : (
        <Text>You haven't created any posts yet. Go to the dashboard to create one!</Text>
      )}
    </Box>
  );
}

export default MyPostsPage;