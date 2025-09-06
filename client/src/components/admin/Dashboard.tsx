import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Card,
  CardBody,
  Icon,
  Badge,
  Progress,
  useToast
} from '@chakra-ui/react';
import { FiEdit3, FiList, FiTrendingUp, FiEye, FiHeart, FiMessageSquare } from 'react-icons/fi';
import { Post, Category, Tag } from '../../types';

interface DashboardProps {
  token: string;
}

interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalCategories: number;
  totalTags: number;
  recentPosts: Post[];
  popularPosts: Post[];
  categories: Category[];
  tags: Tag[];
}

const Dashboard: React.FC<DashboardProps> = ({ token }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line
  }, []);

  const fetchDashboardData = async () => {
    try {
      const postsResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/posts/admin/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const categoriesResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/categories`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const tagsResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/tags`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!postsResponse.ok || !categoriesResponse.ok || !tagsResponse.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const postsData = await postsResponse.json();
      const categoriesData = await categoriesResponse.json();
      const tagsData = await tagsResponse.json();

      const posts: Post[] = postsData.posts || [];
      const categories: Category[] = categoriesData.categories || [];
      const tags: Tag[] = tagsData.tags || [];

      // Calculate stats
      const totalPosts = posts.length;
      const publishedPosts = posts.filter((p: Post) => p.status === 'PUBLISHED').length;
      const draftPosts = posts.filter((p: Post) => p.status === 'DRAFT').length;
      const totalViews = posts.reduce((sum: number, p: Post) => sum + (p.views || 0), 0);
      const totalLikes = posts.reduce((sum: number, p: Post) => sum + (p.likes || 0), 0);
      const totalComments = posts.reduce((sum: number, p: Post) => sum + (p._count?.comments || 0), 0);

      // Get recent posts (last 5)
      const recentPosts = [...posts]
        .sort((a: Post, b: Post) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

      // Get popular posts (by views)
      const popularPosts = [...posts]
        .sort((a: Post, b: Post) => (b.views || 0) - (a.views || 0))
        .slice(0, 5);

      setStats({
        totalPosts,
        publishedPosts,
        draftPosts,
        totalViews,
        totalLikes,
        totalComments,
        totalCategories: categories.length,
        totalTags: tags.length,
        recentPosts,
        popularPosts,
        categories,
        tags
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch dashboard data',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Text>Loading dashboard...</Text>;
  }

  if (!stats) {
    return <Text>Failed to load dashboard data</Text>;
  }

  const publishRate = stats.totalPosts > 0 ? (stats.publishedPosts / stats.totalPosts) * 100 : 0;

  return (
    <Box>
      <VStack spacing={6} align="stretch">

        {/* Quick Actions */}
        <Card>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <Heading size="md">Quick Actions</Heading>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                <Button
                  leftIcon={<Icon as={FiEdit3} />}
                  colorScheme="green"
                  onClick={() => navigate('/admin/posts/new')}
                  size="lg"
                >
                  Create Post
                </Button>
                <Button
                  leftIcon={<Icon as={FiList} />}
                  colorScheme="blue"
                  onClick={() => navigate('/admin/posts')}
                  size="lg"
                >
                  Manage Posts
                </Button>
                <Button
                  leftIcon={<Icon as={FiTrendingUp} />}
                  colorScheme="purple"
                  onClick={() => navigate('/admin/categories')}
                  size="lg"
                >
                  Manage Categories
                </Button>
              </SimpleGrid>
            </VStack>
          </CardBody>
        </Card>

        {/* Statistics */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          <Stat>
            <StatLabel>Total Posts</StatLabel>
            <StatNumber>{stats.totalPosts}</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              {stats.publishedPosts} published
            </StatHelpText>
          </Stat>

          <Stat>
            <StatLabel>Total Views</StatLabel>
            <StatNumber>{stats.totalViews.toLocaleString()}</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              {stats.totalPosts > 0 ? Math.round(stats.totalViews / stats.totalPosts) : 0} avg per post
            </StatHelpText>
          </Stat>

          <Stat>
            <StatLabel>Total Likes</StatLabel>
            <StatNumber>{stats.totalLikes}</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              {stats.totalPosts > 0 ? Math.round(stats.totalLikes / stats.totalPosts) : 0} avg per post
            </StatHelpText>
          </Stat>

          <Stat>
            <StatLabel>Total Comments</StatLabel>
            <StatNumber>{stats.totalComments}</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              {stats.totalPosts > 0 ? Math.round(stats.totalComments / stats.totalPosts) : 0} avg per post
            </StatHelpText>
          </Stat>
        </SimpleGrid>

        {/* Content Overview */}
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
          {/* Categories & Tags */}
          <Card>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <Heading size="md">Content Organization</Heading>

                <Box>
                  <HStack justify="space-between" mb={2}>
                    <Text fontWeight="medium">Categories</Text>
                    <Badge colorScheme="blue">{stats.totalCategories}</Badge>
                  </HStack>
                  <Progress value={stats.totalCategories > 0 ? 100 : 0} colorScheme="blue" size="sm" />
                </Box>

                <Box>
                  <HStack justify="space-between" mb={2}>
                    <Text fontWeight="medium">Tags</Text>
                    <Badge colorScheme="purple">{stats.totalTags}</Badge>
                  </HStack>
                  <Progress value={stats.totalTags > 0 ? 100 : 0} colorScheme="purple" size="sm" />
                </Box>

                <Box>
                  <HStack justify="space-between" mb={2}>
                    <Text fontWeight="medium">Publish Rate</Text>
                    <Badge colorScheme="green">{Math.round(publishRate)}%</Badge>
                  </HStack>
                  <Progress value={publishRate} colorScheme="green" size="sm" />
                </Box>
              </VStack>
            </CardBody>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <Heading size="md">Recent Posts</Heading>
                <VStack spacing={3} align="stretch" maxH="300px" overflowY="auto">
                  {stats.recentPosts.map((post: Post) => (
                    <Box key={post.id} p={3} borderWidth={1} borderRadius="md">
                      <HStack justify="space-between">
                        <VStack align="start" spacing={1}>
                          <Text fontWeight="medium" noOfLines={1}>
                            {post.title}
                          </Text>
                          <HStack spacing={2}>
                            <Badge size="sm" colorScheme={post.status === 'PUBLISHED' ? 'green' : 'yellow'}>
                              {post.status}
                            </Badge>
                            <Text fontSize="sm" color="gray.500">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </Text>
                          </HStack>
                        </VStack>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/admin/posts/edit/${post.id}`)}
                        >
                          Edit
                        </Button>
                      </HStack>
                    </Box>
                  ))}
                </VStack>
              </VStack>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Popular Posts */}
        <Card>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <Heading size="md">Popular Posts</Heading>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                {stats.popularPosts.map((post: Post) => (
                  <Box key={post.id} p={4} borderWidth={1} borderRadius="md">
                    <VStack align="start" spacing={2}>
                      <Text fontWeight="medium" noOfLines={2}>
                        {post.title}
                      </Text>
                      <HStack spacing={4}>
                        <HStack spacing={1}>
                          <Icon as={FiEye} />
                          <Text fontSize="sm">{post.views || 0}</Text>
                        </HStack>
                        <HStack spacing={1}>
                          <Icon as={FiHeart} />
                          <Text fontSize="sm">{post.likes || 0}</Text>
                        </HStack>
                        <HStack spacing={1}>
                          <Icon as={FiMessageSquare} />
                          <Text fontSize="sm">{post._count?.comments || 0}</Text>
                        </HStack>
                      </HStack>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/posts/${post.slug}`)}
                      >
                        View Post
                      </Button>
                    </VStack>
                  </Box>
                ))}
              </SimpleGrid>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
};

export default Dashboard;
