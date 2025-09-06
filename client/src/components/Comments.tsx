import React from 'react';
import {
  VStack,
  HStack,
  Box,
  Text,
  Avatar,
  Button,
  Textarea,
  useToast,
} from '@chakra-ui/react';

interface Comment {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  date: string;
}

interface CommentsProps {
  comments: Comment[];
}

export default function Comments({ comments }: CommentsProps) {
  const toast = useToast();
  const [newComment, setNewComment] = React.useState('');

  const handleSubmitComment = () => {
    if (!newComment.trim()) {
      toast({
        title: 'Error',
        description: 'Comment cannot be empty',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    // Here you would implement the comment submission logic
    toast({
      title: 'Comment Posted',
      description: 'Your comment has been posted successfully.',
      status: 'success',
      duration: 3000,
    });
    setNewComment('');
  };

  return (
    <VStack spacing={8} align="stretch">
      <Box>
        <Text fontSize="xl" fontWeight="bold" mb={4}>
          Comments ({comments.length})
        </Text>

        {/* New Comment Form */}
        <Box mb={8}>
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            mb={2}
          />
          <Button colorScheme="blue" onClick={handleSubmitComment}>
            Post Comment
          </Button>
        </Box>

        {/* Comments List */}
        <VStack spacing={4} align="stretch">
          {comments.map((comment) => (
            <Box
              key={comment.id}
              p={4}
              borderWidth="1px"
              borderRadius="md"
              _hover={{ shadow: 'sm' }}
            >
              <HStack spacing={4} mb={2}>
                <Avatar
                  size="sm"
                  name={comment.author.name}
                  src={comment.author.avatar}
                />
                <VStack align="start" spacing={0}>
                  <Text fontWeight="bold">{comment.author.name}</Text>
                  <Text fontSize="sm" color="gray.500">
                    {comment.date}
                  </Text>
                </VStack>
              </HStack>
              <Text>{comment.content}</Text>
            </Box>
          ))}
        </VStack>
      </Box>
    </VStack>
  );
}
