import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Box, Heading, Text, Spinner, Button } from '@chakra-ui/react';
import { Post } from '../types';
import { useAuth } from '../context/AuthContext';

function PostPage() {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { slug } = useParams();
  const { token } = useAuth();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/posts/${slug}`);
        if (!response.ok) {
          throw new Error('Post not found');
        }
        const data: Post = await response.json();
        setPost(data);
      } catch (e) {
         if (e instanceof Error) {
            setError(e.message);
        }
      } finally {
        setLoading(false);
      }
    };
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  if (loading) return <Spinner size="xl" />;
  if (error) return <Text color="red.500">Error: {error}</Text>;
  if (!post) return <Text>Post not found.</Text>;

  return (
    <Box maxW="800px" mx="auto" p={6}>
      <Heading mb={6} size="2xl">{post.title}</Heading>
      <Text whiteSpace="pre-wrap" fontSize="lg" mb={8}>
        {post.content}
      </Text>
      <Box mt={8}>
        <Button as={Link} to="/" colorScheme="blue" mr={4}>
          Back to Home
        </Button>
        {token && (
          <Button as={Link} to={`/admin/posts/edit/${post.id}`} colorScheme="teal">
            Edit Post
          </Button>
        )}
      </Box>
    </Box>
  );
}

export default PostPage;