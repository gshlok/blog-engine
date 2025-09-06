// import React from 'react';
import {
  Box,
  SimpleGrid,
  Text,
  Switch,
  useToast,
  VStack,
  HStack,
  Badge,
} from '@chakra-ui/react';

interface Plugin {
  id: string;
  name: string;
  description: string;
  version: string;
  isActive: boolean;
  author: string;
}

const plugins: Plugin[] = [
  {
    id: 'comments',
    name: 'Advanced Comments',
    description: 'Enhanced commenting system with moderation and notifications',
    version: '1.0.0',
    isActive: true,
    author: 'Blog Engine Team',
  },
  {
    id: 'seo',
    name: 'SEO Optimizer',
    description: 'Optimize your posts for search engines',
    version: '1.1.0',
    isActive: false,
    author: 'Blog Engine Team',
  },
  {
    id: 'analytics',
    name: 'Analytics Integration',
    description: 'Track your blog performance and user engagement',
    version: '1.0.2',
    isActive: true,
    author: 'Blog Engine Team',
  },
];

export default function PluginManager() {
  const toast = useToast();

  const handleTogglePlugin = (pluginId: string, newState: boolean) => {
    // Here you would implement the plugin activation/deactivation logic
    toast({
      title: newState ? 'Plugin Activated' : 'Plugin Deactivated',
      description: `Plugin ${pluginId} has been ${newState ? 'activated' : 'deactivated'} successfully.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box p={5}>
      <Text fontSize="2xl" fontWeight="bold" mb={6}>
        Plugins
      </Text>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
        {plugins.map((plugin) => (
          <Box
            key={plugin.id}
            p={5}
            shadow="md"
            borderWidth="1px"
            borderRadius="lg"
          >
            <VStack align="stretch" spacing={4}>
              <HStack justify="space-between">
                <Text fontSize="xl" fontWeight="semibold">
                  {plugin.name}
                </Text>
                <Switch
                  isChecked={plugin.isActive}
                  onChange={(e) => handleTogglePlugin(plugin.id, e.target.checked)}
                />
              </HStack>
              <Text color="gray.600">{plugin.description}</Text>
              <HStack spacing={2}>
                <Badge colorScheme="blue">v{plugin.version}</Badge>
                <Badge colorScheme="gray">By {plugin.author}</Badge>
              </HStack>
            </VStack>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}
