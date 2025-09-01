import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PostPage from './pages/PostPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import EditPostPage from './pages/EditPostPage';
import RegisterPage from './pages/RegisterPage';
import PostsManagement from './pages/PostsManagement';
import NewPostPage from './pages/NewPostPage';
import ProtectedRoute from './components/ProtectedRoute';
import { Box, Flex, Heading, Button } from '@chakra-ui/react';
import { useAuth } from './context/AuthContext';

function App() {
  const { token, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box>
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        wrap="wrap"
        padding="1rem"
        bg="gray.100"
        borderBottom="1px"
        borderColor="gray.200"
      >
        <Link to="/" style={{ textDecoration: 'none', color: 'black' }}>
          <Heading as="h1" size="lg">My Journal App</Heading>
        </Link>
        {token ? (
          <Flex gap={4}>
            <Button as={Link} to="/admin" colorScheme="blue" variant="outline">
              Admin Dashboard
            </Button>
            <Button onClick={handleLogout} colorScheme="red" variant="outline">
              Logout
            </Button>
          </Flex>
        ) : location.pathname !== '/login' && location.pathname !== '/register' && (
          <Link to="/login">
            <Button colorScheme="teal">Login</Button>
          </Link>
        )}
      </Flex>
      
      <main style={{ padding: '1rem' }}>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          
          <Route path="/" element={<HomePage />} />
          <Route path="/posts/:slug" element={<PostPage />} />
          <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
          <Route path="/admin/posts" element={<ProtectedRoute><PostsManagement /></ProtectedRoute>} />
          <Route path="/admin/posts/new" element={<ProtectedRoute><NewPostPage /></ProtectedRoute>} />
          <Route path="/admin/posts/edit/:id" element={<ProtectedRoute><EditPostPage /></ProtectedRoute>} />
        </Routes>
      </main>
    </Box>
  );
}

export default App;