import { useState, type ReactElement } from 'react';
import { useAuth } from '../context/AuthContext';
import { Box, Button, Input, Heading, FormControl, FormLabel, VStack } from '@chakra-ui/react';

function CreateProjectForm({ onProjectCreated }: { onProjectCreated: () => void }): ReactElement {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { token } = useAuth();

  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    setError('');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });
      if (!response.ok) throw new Error('Failed to create project.');
      setName('');
      onProjectCreated(); // Refresh the list on the parent page
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
  };

  return (
    <Box p={6} borderWidth={1} borderRadius="lg" boxShadow="md">
      <Heading as="h3" size="md" mb={4}>Create a New Website</Heading>
      <form onSubmit={handleSubmit}>
        <VStack>
          <FormControl isRequired>
            <FormLabel>Website Name:</FormLabel>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., My Travel Blog"
            />
          </FormControl>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <Button type="submit" colorScheme="green" width="full">
            Create Project
          </Button>
        </VStack>
      </form>
    </Box>
  );
}

export default CreateProjectForm;