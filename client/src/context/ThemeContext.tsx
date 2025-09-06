import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Theme {
  id: string;
  name: string;
  description: string;
  colorScheme: 'blue' | 'teal' | 'purple' | 'orange' | 'pink';
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  isActive: boolean;
}

interface ThemeContextType {
  currentTheme: Theme;
  themes: Theme[];
  switchTheme: (themeId: string) => void;
  getThemeColors: () => { primary: string; secondary: string; background: string; text: string };
}

const defaultThemes: Theme[] = [
  {
    id: 'default',
    name: 'Default Theme',
    description: 'A clean, modern default theme',
    colorScheme: 'blue',
    primaryColor: '#3182CE',
    secondaryColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    textColor: '#1A202C',
    isActive: true,
  },
  {
    id: 'dark',
    name: 'Dark Mode',
    description: 'A dark theme for comfortable night reading',
    colorScheme: 'teal',
    primaryColor: '#319795',
    secondaryColor: '#2D3748',
    backgroundColor: '#1A202C',
    textColor: '#F7FAFC',
    isActive: false,
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'A minimalist theme focusing on content',
    colorScheme: 'purple',
    primaryColor: '#805AD5',
    secondaryColor: '#F7FAFC',
    backgroundColor: '#FFFFFF',
    textColor: '#2D3748',
    isActive: false,
  },
  {
    id: 'warm',
    name: 'Warm',
    description: 'A warm, cozy theme with orange accents',
    colorScheme: 'orange',
    primaryColor: '#DD6B20',
    secondaryColor: '#FEF5E7',
    backgroundColor: '#FFFAF0',
    textColor: '#2D3748',
    isActive: false,
  },
  {
    id: 'elegant',
    name: 'Elegant',
    description: 'An elegant theme with sophisticated colors',
    colorScheme: 'pink',
    primaryColor: '#D53F8C',
    secondaryColor: '#FED7E2',
    backgroundColor: '#FFF5F7',
    textColor: '#1A202C',
    isActive: false,
  },
];

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themes, setThemes] = useState<Theme[]>(defaultThemes);
  const [currentTheme, setCurrentTheme] = useState<Theme>(defaultThemes[0]);

  // Load theme preference from localStorage on mount
  useEffect(() => {
    const savedThemeId = localStorage.getItem('selectedTheme');
    if (savedThemeId) {
      const savedTheme = themes.find(theme => theme.id === savedThemeId);
      if (savedTheme) {
        switchTheme(savedThemeId);
      }
    }
  }, []);

  const switchTheme = (themeId: string) => {
    const newThemes = themes.map(theme => ({
      ...theme,
      isActive: theme.id === themeId
    }));
    
    setThemes(newThemes);
    
    const selectedTheme = newThemes.find(theme => theme.id === themeId);
    if (selectedTheme) {
      setCurrentTheme(selectedTheme);
      localStorage.setItem('selectedTheme', themeId);
      
      // Apply theme colors to CSS custom properties and Chakra UI theme
      document.documentElement.style.setProperty('--chakra-colors-primary', selectedTheme.primaryColor);
      document.documentElement.style.setProperty('--chakra-colors-secondary', selectedTheme.secondaryColor);
      document.documentElement.style.setProperty('--chakra-colors-background', selectedTheme.backgroundColor);
      document.documentElement.style.setProperty('--chakra-colors-text', selectedTheme.textColor);
      
      // Apply theme to body for global styling
      document.body.style.backgroundColor = selectedTheme.backgroundColor;
      document.body.style.color = selectedTheme.textColor;
      
      // Update Chakra UI color mode if needed
      if (themeId === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        // Force Chakra UI to use dark mode
        document.documentElement.setAttribute('data-chakra-ui-color-mode', 'dark');
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
        document.documentElement.setAttribute('data-chakra-ui-color-mode', 'light');
      }
      
      // Dispatch custom event for theme change
      window.dispatchEvent(new CustomEvent('themeChanged', { 
        detail: { theme: selectedTheme } 
      }));
    }
  };

  const getThemeColors = () => ({
    primary: currentTheme.primaryColor,
    secondary: currentTheme.secondaryColor,
    background: currentTheme.backgroundColor,
    text: currentTheme.textColor,
  });

  const value: ThemeContextType = {
    currentTheme,
    themes,
    switchTheme,
    getThemeColors,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
