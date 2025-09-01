// in client/src/pages/RegisterPage.tsx
import { useState, type ReactElement } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Button, Input, Heading, Text } from '@chakra-ui/react';

function RegisterPage(): ReactElement {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    setError('');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Registration failed.');
      }
      // Redirect to login page on successful registration
      navigate('/login');
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={10} p={8} borderWidth={1} borderRadius="lg" boxShadow="lg">
      <Heading as="h2" size="lg" textAlign="center" mb={6}>
        Create an Account
      </Heading>
      <form onSubmit={handleSubmit}>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          mb={4}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          mb={6}
          required
        />
        {error && (
          <Text color="red.500" mb={4} textAlign="center">
            {error}
          </Text>
        )}
        <Button type="submit" colorScheme="green" width="full">
          Register
        </Button>
      </form>
      <Text mt={4} textAlign="center">
        Already have an account? <Link to="/login" style={{ color: 'blue' }}>Login here</Link>
      </Text>
    </Box>
  );
}

export default RegisterPage;