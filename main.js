// in main.js (at the project root)
const { app, BrowserWindow } = require('electron');
const path = require('path');
const { exec } = require('child_process');

let serverProcess;
let mainWindow;

function createWindow() {
  console.log('Creating Electron window...');
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    show: false, // Don't show the window until it's ready
  });

  mainWindow.loadURL('http://localhost:5173');

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    console.log('Window ready to show');
    mainWindow.show();
  });

  // Handle window load errors
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load window:', errorCode, errorDescription);
    // Retry loading after a short delay
    setTimeout(() => {
      console.log('Retrying to load window...');
      mainWindow.loadURL('http://localhost:5173');
    }, 1000);
  });
}

async function startServer() {
  return new Promise((resolve, reject) => {
    console.log('Starting server...');
    
    // Kill any existing process on port 3000
    const killPort = exec('npx kill-port 3000', (error) => {
      if (error) console.log('Port 3000 was not in use');
    });

    killPort.on('close', () => {
      // Generate Prisma client and start the server
      console.log('Generating Prisma client...');
      serverProcess = exec('npm run dev', { 
        cwd: path.join(__dirname, 'server'),
        env: { ...process.env, PORT: '3000' }
      });

      if (!serverProcess.stdout || !serverProcess.stderr) {
        reject(new Error('Failed to start server process'));
        return;
      }
      
      let output = '';
      
      serverProcess.stdout.on('data', (data) => {
        const message = data.toString();
        output += message;
        console.log(`Server: ${message}`);
        if (message.includes('Server is running')) {
          console.log('Server is up and running!');
          resolve();
        }
      });

      serverProcess.stderr.on('data', (data) => {
        const message = data.toString();
        output += message;
        console.error(`Server Error: ${message}`);
      });

      serverProcess.on('error', (error) => {
        console.error('Failed to start server:', error);
        reject(error);
      });

      serverProcess.on('exit', (code) => {
        if (code !== 0) {
          console.error(`Server process exited with code ${code}`);
          console.error('Server output:', output);
          reject(new Error(`Server process exited with code ${code}`));
        }
      });

      // Set a longer timeout and provide more information
      setTimeout(() => {
        console.error('Last server output:', output);
        reject(new Error('Server startup timed out. Check the server logs for details.'));
      }, 60000); // Increased timeout to 60 seconds
    });
  });
}

async function startApp() {
  try {
    await startServer();
    createWindow();
  } catch (error) {
    console.error('Failed to start application:', error);
    app.quit();
  }
}

app.whenReady().then(startApp);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('before-quit', () => {
  if (serverProcess) {
    console.log('Shutting down server...');
    serverProcess.kill();
  }
});