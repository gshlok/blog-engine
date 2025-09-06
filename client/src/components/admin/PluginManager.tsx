import React, { useState } from 'react';
import {
  Box,
  SimpleGrid,
  Text,
  Switch,
  useToast,
  VStack,
  HStack,
  Badge,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Checkbox,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
  Divider,
  Heading,
  Card,
  CardBody,
  CardHeader,
  useColorModeValue,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import { usePlugins } from '../../context/PluginContext';

export default function PluginManager() {
  const toast = useToast();
  const { plugins, togglePlugin, getPluginSettings, updatePluginSettings, getPluginByCategory } = usePlugins();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedPlugin, setSelectedPlugin] = useState<string>('');
  const [activeTab, setActiveTab] = useState(0);
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // ... rest of your component stays unchanged
}
