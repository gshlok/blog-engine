import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Box, Tabs, TabList, TabPanels, Tab, TabPanel, Heading } from '@chakra-ui/react';
import Dashboard from '../components/admin/Dashboard';
import PostsManagement from './PostsManagement';
import CategoryManager from '../components/admin/CategoryManager';
import PluginManager from '../components/admin/PluginManager';
import ThemeManager from '../components/admin/ThemeManager';

function AdminPage() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState(0);

  if (!token) {
    return <div>Please log in to access the admin panel.</div>;
  }

  return (
    <Box p={6}>
      <Heading mb={6}>Admin Dashboard</Heading>
      
      <Tabs index={activeTab} onChange={setActiveTab} variant="enclosed">
        <TabList>
          <Tab>Overview</Tab>
          <Tab>Posts</Tab>
          <Tab>Categories</Tab>
          <Tab>Plugins</Tab>
          <Tab>Themes</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Dashboard token={token} />
          </TabPanel>
          
          <TabPanel>
            <PostsManagement />
          </TabPanel>
          
          <TabPanel>
            <CategoryManager token={token} />
          </TabPanel>
          
          <TabPanel>
            <PluginManager />
          </TabPanel>
          
          <TabPanel>
            <ThemeManager />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}

export default AdminPage;