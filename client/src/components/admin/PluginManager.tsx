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

  const handleTogglePlugin = (pluginId: string, newState: boolean) => {
    try {
      togglePlugin(pluginId, newState);
      
      const plugin = plugins.find(p => p.id === pluginId);
      const action = newState ? 'activated' : 'deactivated';
      
      toast({
        title: newState ? 'Plugin Activated' : 'Plugin Deactivated',
        description: `Plugin "${plugin?.name}" has been ${action} successfully.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // Show plugin-specific effects
      if (newState && plugin) {
        setTimeout(() => {
          showPluginEffects(plugin);
        }, 1000);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to toggle plugin. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const showPluginEffects = (plugin: any) => {
    let effects = [];
    
    switch (plugin.id) {
      case 'comments':
        if (plugin.settings?.moderation) effects.push('Comment moderation enabled');
        if (plugin.settings?.notifications) effects.push('Comment notifications enabled');
        break;
      case 'seo':
        if (plugin.settings?.autoMetaTags) effects.push('Auto meta tags enabled');
        if (plugin.settings?.schemaMarkup) effects.push('Schema markup enabled');
        break;
      case 'analytics':
        if (plugin.settings?.pageViews) effects.push('Page view tracking enabled');
        if (plugin.settings?.userBehavior) effects.push('User behavior tracking enabled');
        break;
      case 'social':
        if (plugin.settings?.shareButtons) effects.push('Social share buttons enabled');
        if (plugin.settings?.openGraph) effects.push('Open Graph tags enabled');
        break;
      case 'security':
        if (plugin.settings?.malwareScan) effects.push('Malware scanning enabled');
        if (plugin.settings?.vulnerabilityCheck) effects.push('Vulnerability checking enabled');
        break;
      case 'cache':
        if (plugin.settings?.pageCache) effects.push('Page caching enabled');
        if (plugin.settings?.imageOptimization) effects.push('Image optimization enabled');
        break;
    }
    
    if (effects.length > 0) {
      toast({
        title: `${plugin.name} Effects Applied`,
        description: effects.join(', '),
        status: 'info',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const openPluginSettings = (pluginId: string) => {
    setSelectedPlugin(pluginId);
    onOpen();
  };

  const handleSettingChange = (pluginId: string, settingKey: string, value: any) => {
    const currentSettings = getPluginSettings(pluginId) || {};
    updatePluginSettings(pluginId, {
      ...currentSettings,
      [settingKey]: value
    });
  };

  const renderSettingControl = (pluginId: string, settingKey: string, value: any, type: string) => {
    switch (type) {
      case 'boolean':
        return (
          <Checkbox
            isChecked={value}
            onChange={(e) => handleSettingChange(pluginId, settingKey, e.target.checked)}
          />
        );
      case 'number':
        return (
          <NumberInput
            value={value}
            onChange={(_, val) => handleSettingChange(pluginId, settingKey, val)}
            min={0}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        );
      case 'select':
        if (settingKey === 'platforms') {
          return (
            <VStack align="stretch" spacing={2}>
              {['twitter', 'facebook', 'linkedin', 'instagram'].map(platform => (
                <Checkbox
                  key={platform}
                  isChecked={value.includes(platform)}
                  onChange={(e) => {
                    const newPlatforms = e.target.checked
                      ? [...value, platform]
                      : value.filter((p: string) => p !== platform);
                    handleSettingChange(pluginId, settingKey, newPlatforms);
                  }}
                >
                  {platform.charAt(0).toUpperCase() + platform.slice(1)}
                </Checkbox>
              ))}
            </VStack>
          );
        }
        return <Input value={value} onChange={(e) => handleSettingChange(pluginId, settingKey, e.target.value)} />;
      default:
        return <Input value={value} onChange={(e) => handleSettingChange(pluginId, settingKey, e.target.value)} />;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      content: 'blue',
      seo: 'green',
      analytics: 'purple',
      social: 'pink',
      security: 'red',
    };
    return colors[category] || 'gray';
  };

  const categories = ['content', 'seo', 'analytics', 'social', 'security'];

  return (
    <Box p={5}>
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="lg" mb={2}>Plugin Management</Heading>
          <Text color="gray.600">
            Manage and configure plugins to extend your blog's functionality.
          </Text>
        </Box>

        <Tabs index={activeTab} onChange={setActiveTab}>
          <TabList>
            <Tab>All Plugins</Tab>
            <Tab>Active Plugins</Tab>
            <Tab>By Category</Tab>
          </TabList>
          
          <TabPanels>
            <TabPanel>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                {plugins.map((plugin) => (
                  <Card
                    key={plugin.id}
                    bg={cardBg}
                    borderWidth="1px"
                    borderColor={plugin.isActive ? 'green.200' : borderColor}
                    borderRadius="lg"
                    _hover={{ shadow: 'md' }}
                  >
                    <CardHeader pb={2}>
                      <HStack justify="space-between" align="flex-start">
                        <Box flex="1">
                          <HStack spacing={2} mb={2}>
                            <Text fontSize="lg" fontWeight="semibold">
                              {plugin.name}
                            </Text>
                            <Badge colorScheme={getCategoryColor(plugin.category)}>
                              {plugin.category}
                            </Badge>
                          </HStack>
                          <Text fontSize="sm" color="gray.500">
                            {plugin.description}
                          </Text>
                        </Box>
                        <Switch
                          isChecked={plugin.isActive}
                          onChange={(e) => handleTogglePlugin(plugin.id, e.target.checked)}
                        />
                      </HStack>
                    </CardHeader>
                    
                    <CardBody pt={0}>
                      <VStack spacing={3} align="stretch">
                        <HStack justify="space-between" fontSize="sm">
                          <Text color="gray.600">Version:</Text>
                          <Badge variant="outline">v{plugin.version}</Badge>
                        </HStack>
                        
                        <HStack justify="space-between" fontSize="sm">
                          <Text color="gray.600">Author:</Text>
                          <Text fontSize="sm">{plugin.author}</Text>
                        </HStack>

                        <Divider />

                        <HStack spacing={2}>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openPluginSettings(plugin.id)}
                            flex="1"
                          >
                            Settings
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            colorScheme={plugin.isActive ? 'green' : 'gray'}
                          >
                            {plugin.isActive ? 'Active' : 'Inactive'}
                          </Button>
                        </HStack>
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>
            </TabPanel>

            <TabPanel>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                {plugins.filter(p => p.isActive).map((plugin) => (
                  <Card
                    key={plugin.id}
                    bg={cardBg}
                    borderWidth="1px"
                    borderColor="green.200"
                    borderRadius="lg"
                  >
                    <CardBody>
                      <VStack spacing={3} align="stretch">
                        <HStack justify="space-between">
                          <Text fontWeight="semibold">{plugin.name}</Text>
                          <Badge colorScheme="green">Active</Badge>
                        </HStack>
                        <Text fontSize="sm" color="gray.600">
                          {plugin.description}
                        </Text>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openPluginSettings(plugin.id)}
                        >
                          Configure
                        </Button>
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>
            </TabPanel>

            <TabPanel>
              <VStack spacing={6} align="stretch">
                {categories.map(category => {
                  const categoryPlugins = getPluginByCategory(category);
                  if (categoryPlugins.length === 0) return null;
                  
                  return (
                    <Box key={category}>
                      <Heading size="md" mb={4} color={`${getCategoryColor(category)}.600`}>
                        {category.charAt(0).toUpperCase() + category.slice(1)} Plugins
                      </Heading>
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        {categoryPlugins.map(plugin => (
                          <Card
                            key={plugin.id}
                            bg={cardBg}
                            borderWidth="1px"
                            borderColor={borderColor}
                            borderRadius="md"
                          >
                            <CardBody>
                              <VStack spacing={2} align="stretch">
                                <HStack justify="space-between">
                                  <Text fontWeight="medium">{plugin.name}</Text>
                                  <Switch
                                    size="sm"
                                    isChecked={plugin.isActive}
                                    onChange={(e) => handleTogglePlugin(plugin.id, e.target.checked)}
                                  />
                                </HStack>
                                <Text fontSize="sm" color="gray.600">
                                  {plugin.description}
                                </Text>
                              </VStack>
                            </CardBody>
                          </Card>
                        ))}
                      </SimpleGrid>
                    </Box>
                  );
                })}
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>

        {/* Plugin Settings Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {plugins.find(p => p.id === selectedPlugin)?.name} Settings
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              {selectedPlugin && (
                <VStack spacing={4} align="stretch">
                  {Object.entries(getPluginSettings(selectedPlugin) || {}).map(([key, value]) => (
                    <FormControl key={key}>
                      <FormLabel textTransform="capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </FormLabel>
                      {renderSettingControl(
                        selectedPlugin,
                        key,
                        value,
                        typeof value === 'boolean' ? 'boolean' : 
                        typeof value === 'number' ? 'number' :
                        Array.isArray(value) ? 'select' : 'text'
                      )}
                    </FormControl>
                  ))}
                </VStack>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      </VStack>
    </Box>
  );
}
