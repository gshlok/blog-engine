import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Plugin {
  id: string;
  name: string;
  description: string;
  version: string;
  isActive: boolean;
  author: string;
  category: 'content' | 'seo' | 'analytics' | 'social' | 'security';
  settings?: Record<string, any>;
  dependencies?: string[];
}

interface PluginContextType {
  plugins: Plugin[];
  togglePlugin: (pluginId: string, newState: boolean) => void;
  getPluginSettings: (pluginId: string) => Record<string, any> | undefined;
  updatePluginSettings: (pluginId: string, settings: Record<string, any>) => void;
  getActivePlugins: () => Plugin[];
  getPluginByCategory: (category: string) => Plugin[];
}

const defaultPlugins: Plugin[] = [
  {
    id: 'comments',
    name: 'Advanced Comments',
    description: 'Enhanced commenting system with moderation and notifications',
    version: '1.0.0',
    isActive: true,
    author: 'Blog Engine Team',
    category: 'content',
    settings: {
      moderation: true,
      notifications: true,
      spamProtection: true,
      maxLength: 1000,
    },
  },
  {
    id: 'seo',
    name: 'SEO Optimizer',
    description: 'Optimize your posts for search engines',
    version: '1.1.0',
    isActive: false,
    author: 'Blog Engine Team',
    category: 'seo',
    settings: {
      autoMetaTags: true,
      schemaMarkup: true,
      sitemapGeneration: true,
      robotsTxt: true,
    },
  },
  {
    id: 'analytics',
    name: 'Analytics Integration',
    description: 'Track your blog performance and user engagement',
    version: '1.0.2',
    isActive: true,
    author: 'Blog Engine Team',
    category: 'analytics',
    settings: {
      pageViews: true,
      userBehavior: true,
      conversionTracking: true,
      realTimeStats: false,
    },
  },
  {
    id: 'social',
    name: 'Social Media Integration',
    description: 'Share your content on social platforms',
    version: '1.0.1',
    isActive: false,
    author: 'Blog Engine Team',
    category: 'social',
    settings: {
      autoShare: false,
      platforms: ['twitter', 'facebook', 'linkedin'],
      shareButtons: true,
      openGraph: true,
    },
  },
  {
    id: 'security',
    name: 'Security Scanner',
    description: 'Protect your blog from security threats',
    version: '1.0.0',
    isActive: false,
    author: 'Blog Engine Team',
    category: 'security',
    settings: {
      malwareScan: true,
      vulnerabilityCheck: true,
      backupProtection: true,
      loginAttempts: 5,
    },
  },
  {
    id: 'cache',
    name: 'Performance Cache',
    description: 'Improve page load speeds with intelligent caching',
    version: '1.0.3',
    isActive: true,
    author: 'Blog Engine Team',
    category: 'content',
    settings: {
      pageCache: true,
      imageOptimization: true,
      minification: true,
      cdnIntegration: false,
    },
  },
];

const PluginContext = createContext<PluginContextType | undefined>(undefined);

export const usePlugins = () => {
  const context = useContext(PluginContext);
  if (context === undefined) {
    throw new Error('usePlugins must be used within a PluginProvider');
  }
  return context;
};

interface PluginProviderProps {
  children: ReactNode;
}

export const PluginProvider: React.FC<PluginProviderProps> = ({ children }) => {
  const [plugins, setPlugins] = useState<Plugin[]>(defaultPlugins);

  // Load plugin states from localStorage on mount
  useEffect(() => {
    const savedPlugins = localStorage.getItem('pluginStates');
    if (savedPlugins) {
      try {
        const parsed = JSON.parse(savedPlugins);
        setPlugins(prev => prev.map(plugin => ({
          ...plugin,
          isActive: parsed[plugin.id]?.isActive ?? plugin.isActive,
          settings: { ...plugin.settings, ...parsed[plugin.id]?.settings }
        })));
      } catch (error) {
        console.error('Error loading plugin states:', error);
      }
    }
  }, []);

  const togglePlugin = (pluginId: string, newState: boolean) => {
    setPlugins(prev => {
      const updated = prev.map(plugin => 
        plugin.id === pluginId ? { ...plugin, isActive: newState } : plugin
      );
      
      // Save to localStorage
      const pluginStates = updated.reduce((acc, plugin) => {
        acc[plugin.id] = {
          isActive: plugin.isActive,
          settings: plugin.settings
        };
        return acc;
      }, {} as Record<string, any>);
      
      localStorage.setItem('pluginStates', JSON.stringify(pluginStates));
      
      // Apply plugin effects
      const plugin = updated.find(p => p.id === pluginId);
      if (plugin) {
        applyPluginEffects(plugin, newState);
      }
      
      return updated;
    });
  };

  const applyPluginEffects = (plugin: Plugin, isActive: boolean) => {
    if (!isActive) return;
    
    switch (plugin.id) {
      case 'comments':
        // Enable enhanced commenting features
        if (plugin.settings?.moderation) {
          console.log('Comment moderation enabled');
        }
        if (plugin.settings?.notifications) {
          console.log('Comment notifications enabled');
        }
        break;
        
      case 'seo':
        // Apply SEO optimizations
        if (plugin.settings?.autoMetaTags) {
          console.log('Auto meta tags enabled');
        }
        if (plugin.settings?.schemaMarkup) {
          console.log('Schema markup enabled');
        }
        break;
        
      case 'analytics':
        // Initialize analytics
        if (plugin.settings?.pageViews) {
          console.log('Page view tracking enabled');
        }
        if (plugin.settings?.userBehavior) {
          console.log('User behavior tracking enabled');
        }
        break;
        
      case 'social':
        // Enable social media features
        if (plugin.settings?.shareButtons) {
          console.log('Social share buttons enabled');
        }
        if (plugin.settings?.openGraph) {
          console.log('Open Graph tags enabled');
        }
        break;
        
      case 'security':
        // Apply security measures
        if (plugin.settings?.malwareScan) {
          console.log('Malware scanning enabled');
        }
        if (plugin.settings?.vulnerabilityCheck) {
          console.log('Vulnerability checking enabled');
        }
        break;
        
      case 'cache':
        // Apply caching optimizations
        if (plugin.settings?.pageCache) {
          console.log('Page caching enabled');
        }
        if (plugin.settings?.imageOptimization) {
          console.log('Image optimization enabled');
        }
        break;
    }
  };

  const getPluginSettings = (pluginId: string) => {
    const plugin = plugins.find(p => p.id === pluginId);
    return plugin?.settings;
  };

  const updatePluginSettings = (pluginId: string, settings: Record<string, any>) => {
    setPlugins(prev => {
      const updated = prev.map(plugin => 
        plugin.id === pluginId ? { ...plugin, settings: { ...plugin.settings, ...settings } } : plugin
      );
      
      // Save to localStorage
      const pluginStates = updated.reduce((acc, plugin) => {
        acc[plugin.id] = {
          isActive: plugin.isActive,
          settings: plugin.settings
        };
        return acc;
      }, {} as Record<string, any>);
      
      localStorage.setItem('pluginStates', JSON.stringify(pluginStates));
      
      return updated;
    });
  };

  const getActivePlugins = () => {
    return plugins.filter(plugin => plugin.isActive);
  };

  const getPluginByCategory = (category: string) => {
    return plugins.filter(plugin => plugin.category === category);
  };

  const value: PluginContextType = {
    plugins,
    togglePlugin,
    getPluginSettings,
    updatePluginSettings,
    getActivePlugins,
    getPluginByCategory,
  };

  return (
    <PluginContext.Provider value={value}>
      {children}
    </PluginContext.Provider>
  );
};
