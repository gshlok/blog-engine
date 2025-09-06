// in client/src/pages/EditPostPage.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Wrap,
  WrapItem,
  Text,
  Heading,
  Spinner,
  Alert,
  AlertIcon,
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

interface Post {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  status: string;
  featured: boolean;
  categoryId?: string;
  category?: Category;
  tags: Tag[];
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
}

function EditPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const toast = useToast();
  
  const [post, setPost] = useState<Post>({
    id: '',
    title: '',
    content: '',
    excerpt: '',
    status: 'DRAFT',
    featured: false,
    categoryId: '',
    tags: [],
    metaTitle: '',
    metaDescription: '',
    keywords: '',
  });
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

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

  // Fetch the post's current data when the page loads
  useEffect(() => {
    const fetchPostForEdit = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/posts/id/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        
        if (!response.ok) throw new Error('Could not fetch post data.');
        
        const data = await response.json();
        setPost({
          id: data.id,
          title: data.title || '',
          content: data.content || '',
          excerpt: data.excerpt || '',
          status: data.status || 'DRAFT',
          featured: data.featured || false,
          categoryId: data.categoryId || '',
          category: data.category,
          tags: data.tags || [],
          metaTitle: data.metaTitle || '',
          metaDescription: data.metaDescription || '',
          keywords: data.keywords || '',
        });
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
          toast({
            title: 'Error',
            description: err.message,
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      } finally {
        setLoading(false);
      }
    };

    if (token && id) {
      fetchPostForEdit();
    }
  }, [id, token, toast]);

  const handleTagToggle = (tag: Tag) => {
    setPost(prev => ({
      ...prev,
      tags: prev.tags.find(t => t.id === tag.id)
        ? prev.tags.filter(t => t.id !== tag.id)
        : [...prev.tags, tag]
    }));
  };

  const removeTag = (tagId: string) => {
    setPost(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t.id !== tagId)
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSaving(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: post.title,
          content: post.content,
          excerpt: post.excerpt,
          status: post.status,
          featured: post.featured,
          categoryId: post.categoryId || null,
          tagIds: post.tags.map(tag => tag.id),
          metaTitle: post.metaTitle,
          metaDescription: post.metaDescription,
          keywords: post.keywords,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update post.');
      }

      toast({
        title: 'Success',
        description: 'Post updated successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Go back to the admin dashboard on success
      navigate('/admin');

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        toast({
          title: 'Error',
          description: err.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof Post, value: any) => {
    setPost(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" />
        <Text mt={4}>Loading editor...</Text>
      </Box>
    );
  }

  return (
    <Box maxW="1000px" mx="auto" p={6}>
      <Heading mb={6}>Edit Post</Heading>
      
      <Box as="form" onSubmit={handleSubmit}>
        <Tabs index={activeTab} onChange={setActiveTab} mb={6}>
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
                    value={post.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="Enter post title"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Excerpt</FormLabel>
                  <Textarea
                    value={post.excerpt}
                    onChange={(e) => handleChange('excerpt', e.target.value)}
                    placeholder="Brief summary of your post (optional)"
                    minHeight="100px"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Content</FormLabel>
                  <Textarea
                    value={post.content}
                    onChange={(e) => handleChange('content', e.target.value)}
                    placeholder="Write your post content here..."
                    minHeight="300px"
                  />
                </FormControl>
              </VStack>
            </TabPanel>
            
            <TabPanel>
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel>Status</FormLabel>
                  <Select 
                    value={post.status} 
                    onChange={(e) => handleChange('status', e.target.value)}
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="SCHEDULED">Scheduled</option>
                    <option value="PRIVATE">Private</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Category</FormLabel>
                  <Select 
                    value={post.categoryId} 
                    onChange={(e) => handleChange('categoryId', e.target.value)}
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
                            colorScheme={post.tags.find(t => t.id === tag.id) ? "blue" : "gray"}
                            cursor="pointer"
                            onClick={() => handleTagToggle(tag)}
                            _hover={{ opacity: 0.8 }}
                          >
                            <TagLabel>{tag.name}</TagLabel>
                          </Tag>
                        </WrapItem>
                      ))}
                    </Wrap>
                    {post.tags.length > 0 && (
                      <Box>
                        <Text fontSize="sm" color="gray.600" mb={2}>
                          Selected tags:
                        </Text>
                        <Wrap spacing={2}>
                          {post.tags.map(tag => (
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
                      isChecked={post.featured}
                      onChange={(e) => handleChange('featured', e.target.checked)}
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
                    value={post.metaTitle}
                    onChange={(e) => handleChange('metaTitle', e.target.value)}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Meta Description</FormLabel>
                  <Textarea
                    placeholder="SEO description (optional)"
                    value={post.metaDescription}
                    onChange={(e) => handleChange('metaDescription', e.target.value)}
                    minHeight="100px"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Keywords</FormLabel>
                  <Input
                    placeholder="SEO keywords (optional)"
                    value={post.keywords}
                    onChange={(e) => handleChange('keywords', e.target.value)}
                  />
                </FormControl>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>

        {error && (
          <Alert status="error" mb={4}>
            <AlertIcon />
            {error}
          </Alert>
        )}

        <HStack spacing={4}>
          <Button 
            type="submit" 
            colorScheme="blue"
            isLoading={saving}
            loadingText="Updating..."
          >
            Update Post
          </Button>
          <Button 
            onClick={() => navigate('/admin')}
            variant="outline"
          >
            Cancel
          </Button>
        </HStack>
      </Box>
    </Box>
  );
}

export default EditPostPage;