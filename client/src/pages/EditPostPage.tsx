// in client/src/pages/EditPostPage.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Post {
  title: string;
  content: string;
}

function EditPostPage() {
  const { id } = useParams(); // Get post ID from the URL
  const navigate = useNavigate();
  const { token } = useAuth();
  const [post, setPost] = useState<Post>({ title: '', content: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // 1. Fetch the post's current data when the page loads
  useEffect(() => {
    const fetchPostForEdit = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/posts/id/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Could not fetch post data.');
        const data = await response.json();
        setPost({ title: data.title, content: data.content }); // Populate the form
      } catch (err) {
        if (err instanceof Error) setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token && id) {
      fetchPostForEdit();
    }
  }, [id, token]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    try {
      // 2. Send the updated data to the backend
      const response = await fetch(`http://localhost:3000/api/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(post),
      });

      if (!response.ok) throw new Error('Failed to update post.');

      // 3. Go back to the admin dashboard on success
      navigate('/admin');

    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPost(prevPost => ({ ...prevPost, [name]: value }));
  };

  if (loading) return <div>Loading editor...</div>;

  return (
    <div>
      <h2>Edit Post</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            name="title"
            value={post.title}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
        </div>
        <div>
          <textarea
            name="content"
            value={post.content}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', minHeight: '250px', marginBottom: '10px' }}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Update Post</button>
      </form>
    </div>
  );
}

export default EditPostPage;