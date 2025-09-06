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
import { Box, Flex, Heading, Button, Select, HStack, useColorModeValue } from '@chakra-ui/react';
import { useAuth } from './context/AuthContext';
import { useTheme } from './context/ThemeContext';

function App() {
  const { token, logout } = useAuth();
  const { currentTheme, themes, switchTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const navBg = useColorModeValue('gray.100', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleThemeChange = (themeId: string) => {
    switchTheme(themeId);
  };

  return (
    <Box>
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        wrap="wrap"
        padding="1rem"
        bg={navBg}
        borderBottom="1px"
        borderColor={borderColor}
      >
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Heading as="h1" size="lg">Modern Chyrp Blog</Heading>
        </Link>
        
        <HStack spacing={4}>
          {token && (
            <Select
              size="sm"
              value={currentTheme.id}
              onChange={(e) => handleThemeChange(e.target.value)}
              w="150px"
            >
              {themes.map(theme => (
                <option key={theme.id} value={theme.id}>
                  {theme.name}
                </option>
              ))}
            </Select>
          )}
          
          {token ? (
            <HStack spacing={2}>
              <Button as={Link} to="/admin" colorScheme="blue" variant="outline">
                Admin Dashboard
              </Button>
              <Button onClick={handleLogout} colorScheme="red" variant="outline">
                Logout
              </Button>
            </HStack>
          ) : location.pathname !== '/login' && location.pathname !== '/register' && (
            <Link to="/login">
              <Button colorScheme="teal">Login</Button>
            </Link>
          )}
        </HStack>
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