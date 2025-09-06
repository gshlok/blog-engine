import { useState, useEffect, type ReactElement } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, Heading, Text, Spinner, UnorderedList, ListItem, Button, Flex } from '@chakra-ui/react';
import { Post } from '../types';

function HomePage(): ReactElement {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const endpoint = token ? '/api/posts/admin/all' : '/api/posts';
        const headers: HeadersInit = token 
          ? { 'Authorization': `Bearer ${token}` }
          : {};

        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${endpoint}`, {
          headers,
        });
        
        if (!response.ok) {
          throw new Error('Could not fetch posts.');
        }
        
        const data = await response.json();
        setPosts(data);
      } catch (e) {
        if (e instanceof Error) setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [token]);

  if (loading) return <Spinner size="xl" />;
  if (error) return <Text color="red.500">Error: {error}</Text>;

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading as="h2" size="xl">{token ? 'Your Posts' : 'Recent Posts'}</Heading>
        {token && (
          <Button colorScheme="green" onClick={() => navigate('/admin')}>
            Go to Dashboard
          </Button>
        )}
      </Flex>
      {posts.length > 0 ? (
        <UnorderedList spacing={5} styleType="none" ml={0}>
          {posts.map((post) => (
            <ListItem key={post.id} p={4} borderWidth={1} borderRadius="md" _hover={{ shadow: "md", borderColor: "blue.200" }}>
              <Link to={`/posts/${post.slug}`}>
                <Heading as="h3" size="md" _hover={{ color: 'blue.500' }}>
                  {post.title}
                </Heading>
                <Text mt={2} color="gray.600">
                  {post.excerpt || (post.content && post.content.slice(0, 150) + '...')}
                </Text>
              </Link>
            </ListItem>
          ))}
        </UnorderedList>
      ) : (
        <Text>
          {token 
            ? "You haven't created any posts yet. Go to the dashboard to create one!"
            : "No posts available yet."}
        </Text>
      )}
    </Box>
  );
}

export default HomePage;