import { useState, useEffect, type ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { Box, Heading, Text, Spinner, UnorderedList, ListItem } from '@chakra-ui/react';
import { Post } from '../types';

function HomePage(): ReactElement {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/posts`);
        if (!response.ok) {
          throw new Error('Something went wrong with the network');
        }
        const data: Post[] = await response.json();
        setPosts(data);
      } catch (e) {
        if (e instanceof Error) setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) return <Spinner size="xl" />;
  if (error) return <Text color="red.500">Error: {error}</Text>;

  return (
    <Box>
      <Heading as="h2" size="xl" mb={6}>All Posts</Heading>
      {posts.length > 0 ? (
        <UnorderedList spacing={5} styleType="none" ml={0}>
          {posts.map((post) => (
            <ListItem key={post.id} p={5} borderWidth={1} borderRadius="lg" shadow="md">
              <Link to={`/posts/${post.slug}`}>
                <Heading as="h3" size="md" _hover={{ color: 'blue.500' }}>
                  {post.title}
                </Heading>
              </Link>
              <Text fontSize="sm" color="gray.500" mt={2}>
                by {post.author.nickname}
              </Text>
            </ListItem>
          ))}
        </UnorderedList>
      ) : (
        <Text>No posts have been published yet.</Text>
      )}
    </Box>
  );
}

export default HomePage;