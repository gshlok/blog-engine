import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage'; // Public feed
import PostPage from './pages/PostPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import EditPostPage from './pages/EditPostPage';
import RegisterPage from './pages/RegisterPage';
import MyPostsPage from './pages/MyPostsPage'; // User's private feed
import ProtectedRoute from './components/ProtectedRoute';
import { Box, Flex, Heading, Button, HStack } from '@chakra-ui/react';
import { useAuth } from './context/AuthContext';

function App() {
  const { token } = useAuth();

  return (
    <Box>
      <Flex as="nav" align="center" justify="space-between" wrap="wrap" padding="1rem" bg="gray.100">
        <Link to={token ? "/my-posts" : "/"} style={{ textDecoration: 'none', color: 'black' }}>
          <Heading as="h1" size="lg">My Blog App</Heading>
        </Link>
        <HStack spacing={4}>
          <Link to="/explore"><Button variant="ghost">Explore Posts</Button></Link>
          
          {token ? (
            <>
              <Link to="/my-posts"><Button variant="ghost">My Posts</Button></Link>
              <Link to="/admin"><Button colorScheme="blue">Dashboard</Button></Link>
            </>
          ) : (
            <Link to="/login"><Button colorScheme="green">Login</Button></Link>
          )}
        </HStack>
      </Flex>
      
      <main style={{ padding: '1rem' }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/explore" element={<HomePage />} />
          <Route path="/posts/:slug" element={<PostPage />} /> {/* This route is now PUBLIC */}
          
          {/* Protected Routes */}
          <Route path="/my-posts" element={<ProtectedRoute><MyPostsPage /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
          <Route path="/admin/edit/:id" element={<ProtectedRoute><EditPostPage /></ProtectedRoute>} />
        </Routes>
      </main>
    </Box>
  );
}

export default App;