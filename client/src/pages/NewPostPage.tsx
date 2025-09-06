import { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import CreatePostForm from '../components/CreatePostForm';
import {
  Heading,
  Container,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  VStack,
  Card,
  CardBody,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

export default function NewPostPage(): ReactElement {
  const navigate = useNavigate();

  const handlePostCreated = () => {
    navigate('/admin/posts');
  };

  return (
    <Container maxW="container.lg" py={8}>
      <VStack spacing={6} align="stretch">
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink as={RouterLink} to="/admin">
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink as={RouterLink} to="/admin/posts">
              Posts
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink>New Post</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <Heading size="lg">Create New Post</Heading>

        <Card>
          <CardBody>
            <CreatePostForm onPostCreated={handlePostCreated} />
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
}
