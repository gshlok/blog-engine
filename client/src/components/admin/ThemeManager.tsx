import {
  Box,
  SimpleGrid,
  Image,
  Text,
  Button,
  useToast,
  Badge,
  Flex,
} from '@chakra-ui/react';

interface Theme {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  isActive: boolean;
}

const themes: Theme[] = [
  {
    id: 'default',
    name: 'Default Theme',
    description: 'A clean, modern default theme',
    thumbnail: '/themes/default/preview.png',
    isActive: true,
  },
  {
    id: 'dark',
    name: 'Dark Mode',
    description: 'A dark theme for comfortable night reading',
    thumbnail: '/themes/dark/preview.png',
    isActive: false,
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'A minimalist theme focusing on content',
    thumbnail: '/themes/minimal/preview.png',
    isActive: false,
  },
];

export default function ThemeManager() {
  const toast = useToast();

  const handleActivateTheme = (themeId: string) => {
    toast({
      title: 'Theme Activated',
      description: `Theme ${themeId} has been activated successfully.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box p={5}>
      <Text fontSize="2xl" fontWeight="bold" mb={6}>
        Themes
      </Text>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
        {themes.map((theme) => (
          <Box
            key={theme.id}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            _hover={{ shadow: 'lg' }}
          >
            <Image
              src={theme.thumbnail}
              alt={theme.name}
              fallbackSrc="https://via.placeholder.com/300x200"
            />
            <Box p={6}>
              <Flex alignItems="baseline">
                {theme.isActive && (
                  <Badge borderRadius="full" px="2" colorScheme="teal">
                    Active
                  </Badge>
                )}
              </Flex>
              <Text mt={2} fontSize="xl" fontWeight="semibold" lineHeight="short">
                {theme.name}
              </Text>
              <Text mt={2} color="gray.500">
                {theme.description}
              </Text>
              <Button
                mt={4}
                colorScheme={theme.isActive ? 'gray' : 'blue'}
                onClick={() => handleActivateTheme(theme.id)}
                isDisabled={theme.isActive}
              >
                {theme.isActive ? 'Current Theme' : 'Activate'}
              </Button>
            </Box>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}
