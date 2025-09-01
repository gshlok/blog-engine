// in main.js (at the project root)
const { app, BrowserWindow } = require('electron');
const path = require('path');
const { exec } = require('child_process');

let serverProcess;

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  win.loadURL('http://localhost:5173');
}

function startServer(callback) {
  // Start the backend server from the 'server' directory
  serverProcess = exec('npm run dev', { cwd: path.join(__dirname, 'server') });
  serverProcess.stdout.on('data', (data) => {
    console.log(`Server: ${data}`);
    // Wait for the server to confirm it's running before opening the app window
    if (data.includes('Server is running')) {
      callback();
    }
  });
  serverProcess.stderr.on('data', (data) => console.error(`Server Error: ${data}`));
}

app.whenReady().then(() => {
  startServer(createWindow);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
  if (serverProcess) serverProcess.kill(); // Make sure to stop the server when the app closes
});