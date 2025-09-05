import { useState, type ReactElement } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Button,
  Input,
  Heading,
  Text,
} from '@chakra-ui/react';


function LoginPage(): ReactElement {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    setError('');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        throw new Error('Login failed. Please check your credentials.');
      }
      const data = await response.json();
      login(data.token);
      navigate('/admin');
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={10} p={8} borderWidth={1} borderRadius="lg" boxShadow="lg">
      <Heading as="h2" size="lg" textAlign="center" mb={6}>
        Admin Login
      </Heading>
      <form onSubmit={handleSubmit}>
        <Box mb={4}>
          <label htmlFor="email" style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>
            Email:
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Box>
        <Box mb={6}>
          <label htmlFor="password" style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>
            Password:
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Box>
        
        {error && <Text color="red.500" mb={4}>{error}</Text>}

        <Button type="submit" colorScheme="blue" width="full">
          Login
        </Button>
      </form>

      <Text mt={6} textAlign="center">
        Don't have an account?
      </Text>
      <Box textAlign="center" mt={2}>
        <Link to="/register">
          <Button colorScheme="green" variant="outline">
            Register
          </Button>
        </Link>
      </Box>
    </Box>
  );
}

export default LoginPage;