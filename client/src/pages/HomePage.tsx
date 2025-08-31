import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// This defines the "shape" of a post object for TypeScript
interface Post {
  id: string;
  title: string;
  content: string;
  slug: string;
}

function HomePage() {
  // useState creates "memory" for our component.
  // We'll store the list of posts, the loading status, and any errors here.
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect runs code after the component first renders.
  // It's the perfect place to fetch data.
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // The fetch command makes an API call to your backend.
        const response = await fetch('http://localhost:3000/api/posts');
        if (!response.ok) {
          throw new Error('Something went wrong with the network');
        }
        const data: Post[] = await response.json();
        setPosts(data); // Put the fetched posts into our component's memory
      } catch (e) {
        if (e instanceof Error) {
            setError(e.message);
        }
      } finally {
        setLoading(false); // We're done loading, whether it succeeded or failed
      }
    };

    fetchPosts(); // Run the function
  }, []); // The empty array [] tells React to run this effect only once.

  if (loading) return <div>Loading posts...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          {/* This Link makes the title clickable and navigates to the post's page */}
          <Link to={`/posts/${post.slug}`}>
            <h2>{post.title}</h2>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default HomePage;