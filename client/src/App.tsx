import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PostPage from './pages/PostPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import EditPostPage from './pages/EditPostPage';
import RegisterPage from './pages/RegisterPage';
import PostsManagement from './pages/PostsManagement';
import NewPostPage from './pages/NewPostPage';
import ProtectedRoute from './components/ProtectedRoute';
import { Box } from '@chakra-ui/react';

function App() {
  return (
    <Box>
      {/* Navigation bar removed as requested */}
      <main style={{ padding: '1rem' }}>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/posts/:slug" element={<PostPage />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/posts" element={
            <ProtectedRoute>
              <PostsManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/posts/new" element={
            <ProtectedRoute>
              <NewPostPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/posts/edit/:id" element={
            <ProtectedRoute>
              <EditPostPage />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
    </Box>
  );
}

export default App;
