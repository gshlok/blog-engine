import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import CreatePostForm from '../components/CreatePostForm';

interface Post {
  id: string;
  title: string;
  content: string | null;
}

function AdminPage() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState('');

  const fetchAdminPosts = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/posts/admin/all', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch posts');
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAdminPosts();
    }
  }, [token]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  const handleEdit = (id: string) => {
    navigate(`/admin/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }
    try {
      const response = await fetch(`http://localhost:3000/api/posts/${id}`, {
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

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <button onClick={handleLogout} style={{ marginBottom: '2rem' }}>Logout</button>
      
      <CreatePostForm onPostCreated={fetchAdminPosts} />

      <hr />
      <h3>Manage Your Posts</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id}>
              <td>{post.title}</td>
              <td>
                <button onClick={() => handleEdit(post.id)}>Edit</button>
                <button onClick={() => handleDelete(post.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPage;