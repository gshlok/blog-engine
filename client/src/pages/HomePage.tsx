import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  VStack,
  Heading,
  Text,
  Button,
  useColorModeValue
} from '@chakra-ui/react';

function HomePage() {
  const { token } = useAuth();
  const navigate = useNavigate();

  // Background and card styles for the "hero" effect
  const bgGradient = "linear-gradient(135deg, #181E2A 0%, #222d41 100%)";
  const cardBg = "rgba(18, 20, 32, 0.91)";
  const cardShadow = "0 8px 64px 0 rgba(80,104,195,0.10), 0 1.5px 2.5px 0 rgba(0,0,0,0.09)";
  const headingColor = "white";
  const subTextColor = "gray.400";
  const ctaBg = "red.600";
  const ctaHoverBg = "red.700";
  const borderColor = useColorModeValue("gray.200", "#222738");

  return (
    <Flex
      minH="100vh"
      minW="100vw"
      align="center"
      justify="center"
      bg={bgGradient}
      px={4}
      overflow="hidden"
      position="relative"
    >
      <Box
        bg={cardBg}
        borderRadius="3xl"
        boxShadow={cardShadow}
        px={{ base: 5, md: 16 }}
        py={{ base: 12, md: 16 }}
        maxW="560px"
        w="full"
        textAlign="center"
        border={`1.5px solid ${borderColor}`}
        zIndex={2}
      >
        <VStack spacing={6}>
          <Heading
            fontFamily="'Playfair Display', serif"
            fontWeight="extrabold"
            color={headingColor}
            fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
            lineHeight={1.15}
            mb={2}
          >
            Share Your Voice.
          </Heading>
          <Text
            fontFamily="'Roboto', sans-serif"
            color={subTextColor}
            fontSize={{ base: "lg", md: "xl" }}
            fontWeight={400}
            mb={4}
          >
            A lightweight, minimalist blogging engine to get your ideas out into the world. Simple, elegant, and focused on your content.
          </Text>
          <Button
            onClick={() => navigate(token ? "/admin" : "/login")}
            bg={ctaBg}
            color="white"
            fontWeight="semibold"
            fontSize="lg"
            px={8}
            py={6}
            borderRadius="lg"
            boxShadow="md"
            _hover={{ bg: ctaHoverBg }}
            transition="all 0.2s"
          >
            {token ? "Go to Your Space" : "Login to Your Space"}
          </Button>
        </VStack>
      </Box>

      {/* OPTIONAL: Add subtle SVG/grid element as page backdrop */}
      <Box
        position="absolute"
        inset="0"
        zIndex={1}
        pointerEvents="none"
        overflow="hidden"
      >
        {/* Fake a 3D grid using an SVG */}
        <svg width="100%" height="100%" viewBox="0 0 900 700" fill="none" style={{ opacity: 0.12 }} xmlns="http://www.w3.org/2000/svg">
          <g stroke="#5692dc" strokeWidth="1">
            {[...Array(20)].map((_, i) => (
              <line
                key={i}
                x1={(i / 19) * 900}
                y1="0"
                x2={(i / 19) * 900}
                y2="700"
                opacity={0.22}
              />
            ))}
            {[...Array(15)].map((_, j) => (
              <line
                key={j}
                x1="0"
                y1={(j / 14) * 700}
                x2="900"
                y2={(j / 14) * 700}
                opacity={0.22}
              />
            ))}
          </g>
        </svg>
      </Box>
    </Flex>
  );
}

export default HomePage;
