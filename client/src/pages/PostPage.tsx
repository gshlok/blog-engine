// in client/src/pages/PostPage.tsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // This hook gets parameters from the URL

interface Post {
  id: string;
  title: string;
  content: string;
  slug: string;
}

function PostPage() {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { slug } = useParams(); // Get the 'slug' from the URL, e.g., /posts/my-first-post

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/posts/${slug}`);
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

    fetchPost();
  }, [slug]); // Re-run this effect if the slug changes

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!post) return <div>Post not found.</div>;

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </div>
  );
}

export default PostPage;