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
    <Box
      minH="100vh"
      w="100vw"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="white"
    >
      <Box
        w={{ base: '95%', sm: '430px', md: '512px' }}
        py={10}
        px={6}
        border="1.5px solid"
        borderColor="#e6dbdb"
        borderRadius="2xl"
        boxShadow="base"
        bg="white"
        fontFamily="'Newsreader','Noto Sans',sans-serif"
      >
        <Heading
          fontSize="2xl"
          color="#181111"
          fontWeight="bold"
          textAlign="center"
          mb={3}
          letterSpacing="tight"
        >
          Admin Login
        </Heading>
        <form onSubmit={handleSubmit}>
          <Box mb={3}>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              size="lg"
              borderRadius="lg"
              borderColor="#e6dbdb"
              color="#181111"
              bg="white"
              _placeholder={{ color: "#896161" }}
              h={14}
              fontSize="md"
              mb={0}
            />
          </Box>
          <Box mb={3}>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              size="lg"
              borderRadius="lg"
              borderColor="#e6dbdb"
              color="#181111"
              bg="white"
              _placeholder={{ color: "#896161" }}
              h={14}
              fontSize="md"
              mb={0}
            />
          </Box>
          {error && (
            <Text color="red.500" mb={2} textAlign="center">
              {error}
            </Text>
          )}
          <Button
            type="submit"
            bg="#ec1313"
            color="white"
            fontWeight="bold"
            fontSize="md"
            w="100%"
            h={10}
            mb={1}
            borderRadius="lg"
            _hover={{ bg: "#b80d0d" }}
          >
            Login
          </Button>
        </form>
        <Heading
          as="h3"
          fontSize="lg"
          fontWeight="bold"
          color="#181111"
          pt={4}
          pb={2}
          textAlign="center"
          letterSpacing={-0.5}
        >
          Don't have an account? Register
        </Heading>
        <Button
          as={Link}
          to="/register"
          bg="#f4f0f0"
          color="#181111"
          w="100%"
          h={10}
          fontWeight="bold"
          fontSize="md"
          borderRadius="lg"
          mt={1}
          _hover={{ bg: "#ded4d4" }}
          variant="solid"
        >
          Register
        </Button>
      </Box>
    </Box>
  );
}

export default LoginPage;
