import { Routes, Route, Link, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PostPage from './pages/PostPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import EditPostPage from './pages/EditPostPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import { Box, Flex, Heading, Button } from '@chakra-ui/react';
import { useAuth } from './context/AuthContext';

function App() {
  const { token } = useAuth();
  const location = useLocation();

  const showLoginLink = !token && location.pathname !== '/login' && location.pathname !== '/register';

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
        {showLoginLink && (
          <Link to="/login">
            <Button colorScheme="teal">Login</Button>
          </Link>
        )}
      </Flex>
      
      <main style={{ padding: '1rem' }}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/posts/:slug" element={<ProtectedRoute><PostPage /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
          <Route path="/admin/edit/:id" element={<ProtectedRoute><EditPostPage /></ProtectedRoute>} />
        </Routes>
      </main>
    </Box>
  );
}

export default App;