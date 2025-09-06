import {
  Box,
  SimpleGrid,
  Text,
  Button,
  useToast,
  Badge,
  VStack,
  HStack,
  useColorModeValue,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Divider,
} from '@chakra-ui/react';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeManager() {
  const toast = useToast();
  const { themes, currentTheme, switchTheme } = useTheme();
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleActivateTheme = (themeId: string) => {
    try {
      switchTheme(themeId);
      toast({
        title: 'Theme Activated',
        description: `Theme "${themes.find((t) => t.id === themeId)?.name}" has been activated successfully.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to activate theme. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const getThemePreview = (theme: any) => {
    return (
      <Box
        w="100%"
        h="120px"
        borderRadius="md"
        background={`linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.secondaryColor} 100%)`}
        position="relative"
        overflow="hidden"
      >
        <Box
          position="absolute"
          top="20px"
          left="20px"
          w="40px"
          h="20px"
          bg={theme.backgroundColor}
          borderRadius="sm"
          opacity="0.8"
        />
        <Box
          position="absolute"
          top="50px"
          left="20px"
          w="60px"
          h="8px"
          bg={theme.backgroundColor}
          borderRadius="full"
          opacity="0.6"
        />
        <Box
          position="absolute"
          top="70px"
          left="20px"
          w="80px"
          h="8px"
          bg={theme.backgroundColor}
          borderRadius="full"
          opacity="0.4"
        />
        <Box
          position="absolute"
          top="90px"
          left="20px"
          w="50px"
          h="8px"
          bg={theme.backgroundColor}
          borderRadius="full"
          opacity="0.3"
        />
      </Box>
    );
  };

  return (
    <Box p={5}>
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="lg" mb={2}>
            Theme Management
          </Heading>
          <Text color="gray.600">
            Customize the appearance of your blog by selecting different themes.
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {themes.map((theme) => (
            <Card
              key={theme.id}
              bg={cardBg}
              borderWidth="1px"
              borderColor={theme.isActive ? theme.primaryColor : borderColor}
              borderRadius="lg"
              overflow="hidden"
              _hover={{
                shadow: 'lg',
                transform: 'translateY(-2px)',
                transition: 'all 0.2s',
              }}
              transition="all 0.2s"
            >
              <CardHeader pb={2}>
                <HStack justify="space-between" align="flex-start">
                  <Box flex="1">
                    <Heading size="md" mb={2}>
                      {theme.name}
                    </Heading>
                    <Text fontSize="sm" color="gray.500">
                      {theme.description}
                    </Text>
                  </Box>
                  {theme.isActive && (
                    <Badge colorScheme="green" variant="solid">
                      Active
                    </Badge>
                  )}
                </HStack>
              </CardHeader>

              <CardBody pt={0}>
                {getThemePreview(theme)}

                <VStack spacing={3} mt={4} align="stretch">
                  <HStack justify="space-between" fontSize="sm">
                    <Text color="gray.600">Primary:</Text>
                    <Box
                      w="20px"
                      h="20px"
                      bg={theme.primaryColor}
                      borderRadius="full"
                      border="2px solid"
                      borderColor="gray.200"
                    />
                  </HStack>

                  <HStack justify="space-between" fontSize="sm">
                    <Text color="gray.600">Secondary:</Text>
                    <Box
                      w="20px"
                      h="20px"
                      bg={theme.secondaryColor}
                      borderRadius="full"
                      border="2px solid"
                      borderColor="gray.200"
                    />
                  </HStack>

                  <Divider />

                  <Button
                    colorScheme={theme.isActive ? 'gray' : theme.colorScheme}
                    onClick={() => handleActivateTheme(theme.id)}
                    isDisabled={theme.isActive}
                    size="sm"
                    variant={theme.isActive ? 'outline' : 'solid'}
                  >
                    {theme.isActive ? 'Current Theme' : 'Activate Theme'}
                  </Button>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>

        <Box
          p={4}
          bg="blue.50"
          borderRadius="md"
          border="1px solid"
          borderColor="blue.200"
        >
          <Text fontSize="sm" color="blue.800">
            <strong>Tip:</strong> Theme changes are applied immediately and
            saved to your browser. The selected theme will be remembered for
            future visits.
          </Text>
        </Box>
      </VStack>
    </Box>
  );
}
