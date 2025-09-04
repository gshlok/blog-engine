import { useState, useEffect, type ReactElement } from 'react';
import { useAuth } from '../context/AuthContext';
import CreateProjectForm from '../components/CreateProjectForm';
import { Box, Heading, Text, Spinner, UnorderedList, ListItem, Button, Flex } from '@chakra-ui/react';

interface Project {
  id: string;
  name: string;
  filePath: string;
}

function ProjectsPage(): ReactElement {
  const { token, logout } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/projects`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Could not fetch your projects.');
      const data = await response.json();
      setProjects(data);
    } catch (e) {
      if (e instanceof Error) setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchProjects();
  }, [token]);

  if (loading) return <Spinner size="xl" />;
  if (error) return <Text color="red.500">Error: {error}</Text>;

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading as="h2" size="xl">My Website Projects</Heading>
        <Button onClick={logout} colorScheme="red">Logout</Button>
      </Flex>
      <CreateProjectForm onProjectCreated={fetchProjects} />
      <hr style={{ margin: '2rem 0' }} />
      <UnorderedList spacing={3} styleType="none" ml={0}>
        {projects.map((project) => (
          <ListItem key={project.id} p={4} borderWidth={1} borderRadius="md">
            <Heading as="h4" size="sm">{project.name}</Heading>
          </ListItem>
        ))}
      </UnorderedList>
    </Box>
  );
}
export default ProjectsPage;