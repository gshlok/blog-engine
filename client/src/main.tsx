import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './theme/themeStyles.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { PluginProvider } from './context/PluginContext';
import { ChakraProvider } from '@chakra-ui/react';
import customTheme from './theme/customTheme';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <PluginProvider>
            <ChakraProvider theme={customTheme}>
              <App />
            </ChakraProvider>
          </PluginProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);