import React from 'react';
import {
  Box,
  Flex,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  Grid,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiUsers, FiFileText, FiMessageCircle, FiEye } from 'react-icons/fi';

interface StatCardProps {
  title: string;
  stat: string | number;
  icon: React.ReactElement;
}

function StatCard(props: StatCardProps) {
  const { title, stat, icon } = props;
  return (
    <Stat
      px={{ base: 2, md: 4 }}
      py={'5'}
      shadow={'xl'}
      border={'1px solid'}
      borderColor={useColorModeValue('gray.800', 'gray.500')}
      rounded={'lg'}>
      <Flex justifyContent={'space-between'}>
        <Box pl={{ base: 2, md: 4 }}>
          <StatLabel fontWeight={'medium'} isTruncated>
            {title}
          </StatLabel>
          <StatNumber fontSize={'2xl'} fontWeight={'medium'}>
            {stat}
          </StatNumber>
        </Box>
        <Box
          my={'auto'}
          color={useColorModeValue('gray.800', 'gray.200')}
          alignContent={'center'}>
          {icon}
        </Box>
      </Flex>
    </Stat>
  );
}

export default function Dashboard() {
  return (
    <Box maxW="7xl" mx={'auto'} pt={5} px={{ base: 2, sm: 12, md: 17 }}>
      <Text fontSize="2xl" fontWeight="bold" mb={6}>
        Dashboard Overview
      </Text>
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={4}>
        <StatCard
          title={'Total Posts'}
          stat={48}
          icon={<FiFileText size={'3em'} />}
        />
        <StatCard
          title={'Total Users'}
          stat={12}
          icon={<FiUsers size={'3em'} />}
        />
        <StatCard
          title={'Comments'}
          stat={89}
          icon={<FiMessageCircle size={'3em'} />}
        />
        <StatCard
          title={'Page Views'}
          stat={'1,534'}
          icon={<FiEye size={'3em'} />}
        />
      </Grid>
    </Box>
  );
}
