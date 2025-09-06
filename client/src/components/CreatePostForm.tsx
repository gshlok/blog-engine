import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Switch,
  Select,
  HStack,
  Tag,
  TagLabel,
  TagCloseButton,
  Flex,
  Wrap,
  WrapItem,
  Text,
} from '@chakra-ui/react';

interface Category {
  id: string;
  name: string;
  slug: string;
  color?: string;
}

interface Tag {
  id: string;
  name: string;
  slug: string;
}

interface CreatePostFormProps {
  onPostCreated: () => void;
}

export default function CreatePostForm({ onPostCreated }: CreatePostFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [status, setStatus] = useState('DRAFT');
  const [featured, setFeatured] = useState(false);
  const [categoryId, setCategoryId] = useState('');
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const toast = useToast();

  // Fetch categories and tags on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, tagsRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/categories`),
          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/tags`)
        ]);

        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          setCategories(categoriesData.categories || []);
        }

        if (tagsRes.ok) {
          const tagsData = await tagsRes.json();
          setAvailableTags(tagsData.tags || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const showSuccessToast = () => {
    toast({
      title: 'Post created successfully',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const showErrorToast = (message: string) => {
    toast({
      title: 'Error creating post',
      description: message,
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
  };

  const handleTagToggle = (tag: Tag) => {
    setSelectedTags(prev => 
      prev.find(t => t.id === tag.id)
        ? prev.filter(t => t.id !== tag.id)
        : [...prev, tag]
    );
  };

  const removeTag = (tagId: string) => {
    setSelectedTags(prev => prev.filter(t => t.id !== tagId));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          content,
          excerpt,
          status,
          featured,
          categoryId: categoryId || null,
          tagIds: selectedTags.map(tag => tag.id),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create post');
      }

      setTitle('');
      setContent('');
      setExcerpt('');
      setStatus('DRAFT');
      setFeatured(false);
      setCategoryId('');
      setSelectedTags([]);
      showSuccessToast();
      onPostCreated();

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        showErrorToast(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit} w="100%" maxW="800px" mx="auto">
      <Tabs index={activeTab} onChange={setActiveTab} mb={4}>
        <TabList>
          <Tab>Content</Tab>
          <Tab>Settings</Tab>
          <Tab>SEO & Meta</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel>Title</FormLabel>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter post title"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Excerpt</FormLabel>
                <Textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Brief summary of your post (optional)"
                  minHeight="100px"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Content</FormLabel>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your post content here..."
                  minHeight="200px"
                />
              </FormControl>
            </VStack>
          </TabPanel>
          <TabPanel>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>Status</FormLabel>
                <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="SCHEDULED">Scheduled</option>
                  <option value="PRIVATE">Private</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Category</FormLabel>
                <Select 
                  value={categoryId} 
                  onChange={(e) => setCategoryId(e.target.value)}
                  placeholder="Select a category"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Tags</FormLabel>
                <Box>
                  <Text mb={2} fontSize="sm" color="gray.600">
                    Select tags for your post:
                  </Text>
                  <Wrap spacing={2} mb={3}>
                    {availableTags.map(tag => (
                      <WrapItem key={tag.id}>
                        <Tag
                          size="md"
                          colorScheme={selectedTags.find(t => t.id === tag.id) ? "blue" : "gray"}
                          cursor="pointer"
                          onClick={() => handleTagToggle(tag)}
                          _hover={{ opacity: 0.8 }}
                        >
                          <TagLabel>{tag.name}</TagLabel>
                        </Tag>
                      </WrapItem>
                    ))}
                  </Wrap>
                  {selectedTags.length > 0 && (
                    <Box>
                      <Text fontSize="sm" color="gray.600" mb={2}>
                        Selected tags:
                      </Text>
                      <Wrap spacing={2}>
                        {selectedTags.map(tag => (
                          <WrapItem key={tag.id}>
                            <Tag size="md" colorScheme="blue">
                              <TagLabel>{tag.name}</TagLabel>
                              <TagCloseButton onClick={() => removeTag(tag.id)} />
                            </Tag>
                          </WrapItem>
                        ))}
                      </Wrap>
                    </Box>
                  )}
                </Box>
              </FormControl>

              <FormControl>
                <HStack justify="space-between">
                  <FormLabel mb={0}>Featured Post</FormLabel>
                  <Switch
                    isChecked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                  />
                </HStack>
              </FormControl>
            </VStack>
          </TabPanel>
          <TabPanel>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>Meta Title</FormLabel>
                <Input
                  placeholder="SEO title (optional)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Meta Description</FormLabel>
                <Textarea
                  placeholder="SEO description (optional)"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  minHeight="100px"
                />
              </FormControl>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {error && (
        <Box color="red.500" mb={4} p={3} bg="red.50" borderRadius="md">
          {error}
        </Box>
      )}

      <Button 
        type="submit" 
        colorScheme="blue" 
        width="full"
        isLoading={loading}
        loadingText="Creating Post..."
      >
        Create Post
      </Button>
    </Box>
  );
}