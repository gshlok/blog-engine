import { Routes, Route, Link } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProjectsPage from './pages/ProjectsPage';
import HomePage from './pages/HomePage';
import PostPage from './pages/PostPage';
import AdminPage from './pages/AdminPage';
import EditPostPage from './pages/EditPostPage';
import MyPostsPage from './pages/MyPostsPage';
import ProtectedRoute from './components/ProtectedRoute';
import { Box, Flex, Heading, Button } from '@chakra-ui/react';
import { useAuth } from './context/AuthContext';

function App() {
  const { token } = useAuth();

  return (
    <Box>
      <Flex as="nav" align="center" justify="space-between" wrap="wrap" padding="1rem" bg="gray.100">
        <Link to="/" style={{ textDecoration: 'none', color: 'black' }}>
          <Heading as="h1" size="lg">Blog Engine</Heading>
        </Link>
        <Flex gap={4}>
          {token ? (
            <>
              <Link to="/projects"><Button variant="ghost">My Projects</Button></Link>
              <Link to="/my-posts"><Button variant="ghost">My Posts</Button></Link>
              <Link to="/admin"><Button variant="ghost">Admin</Button></Link>
            </>
          ) : (
            <>
              <Link to="/login"><Button colorScheme="green">Login</Button></Link>
              <Link to="/register"><Button variant="outline" colorScheme="green">Register</Button></Link>
            </>
          )}
        </Flex>
      </Flex>
      
      <main style={{ padding: '1rem' }}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProtectedRoute><ProjectsPage /></ProtectedRoute>} />
          <Route path="/posts/:slug" element={<PostPage />} />
          <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
          <Route path="/admin/edit/:id" element={<ProtectedRoute><EditPostPage /></ProtectedRoute>} />
          <Route path="/my-posts" element={<ProtectedRoute><MyPostsPage /></ProtectedRoute>} />
        </Routes>
      </main>
    </Box>
  );
}

export default App;