#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('🚀 Setting up Modern Chyrp Blog Engine...\n');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step, description) {
  log(`\n${step} ${description}`, 'cyan');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

// Check if Docker is running
function checkDocker() {
  try {
    execSync('docker info', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

// Generate secure JWT secret
function generateJWTSecret() {
  return crypto.randomBytes(64).toString('hex');
}

// Create environment file
function createEnvFile() {
  const serverEnvPath = path.join(__dirname, 'server', '.env');
  
  if (fs.existsSync(serverEnvPath)) {
    logInfo('Environment file already exists, checking configuration...');
    return;
  }

  const jwtSecret = generateJWTSecret();
  const envContent = `# Modern Chyrp Blog Engine Environment Configuration
# Generated on ${new Date().toISOString()}

# JWT Configuration
JWT_SECRET="${jwtSecret}"

# Database Configuration
DB_USER="bloguser"
DB_PASSWORD="securepassword123"
DB_NAME="blogdb"
DB_HOST="localhost"
DB_PORT="5432"

# Database URL (used by Prisma)
DATABASE_URL="postgresql://bloguser:securepassword123@localhost:5432/blogdb"

# Server Configuration
PORT=3000
NODE_ENV="development"

# CORS Configuration
CORS_ORIGIN="http://localhost:5173"

# Security
BCRYPT_ROUNDS=12
`;

  try {
    fs.writeFileSync(serverEnvPath, envContent);
    logSuccess('Environment file created successfully');
    logWarning(`JWT Secret: ${jwtSecret.substring(0, 16)}...`);
    logInfo('Please keep this secret secure and do not share it');
  } catch (error) {
    logError(`Failed to create environment file: ${error.message}`);
    process.exit(1);
  }
}

// Start Docker containers
function startDocker() {
  logStep('🐳', 'Starting Docker containers...');
  
  try {
    execSync('docker compose up -d', { stdio: 'inherit' });
    logSuccess('Docker containers started successfully');
    
    // Wait for database to be ready
    logInfo('Waiting for database to be ready...');
    setTimeout(() => {
      logSuccess('Database should be ready now');
    }, 5000);
    
  } catch (error) {
    logError('Failed to start Docker containers');
    logError('Make sure Docker Desktop is running');
    process.exit(1);
  }
}

// Install dependencies
function installDependencies() {
  logStep('📦', 'Installing dependencies...');
  
  try {
    // Install root dependencies
    logInfo('Installing root dependencies...');
    execSync('npm install', { stdio: 'inherit' });
    
    // Install server dependencies
    logInfo('Installing server dependencies...');
    execSync('cd server && npm install', { stdio: 'inherit' });
    
    // Install client dependencies
    logInfo('Installing client dependencies...');
    execSync('cd client && npm install', { stdio: 'inherit' });
    
    logSuccess('All dependencies installed successfully');
  } catch (error) {
    logError('Failed to install dependencies');
    process.exit(1);
  }
}

// Run database migrations
function runMigrations() {
  logStep('🗄️', 'Setting up database...');
  
  try {
    execSync('cd server && npx prisma generate', { stdio: 'inherit' });
    logSuccess('Prisma client generated');
    
    execSync('cd server && npx prisma migrate dev --name init', { stdio: 'inherit' });
    logSuccess('Database migrations completed');
    
  } catch (error) {
    logError('Failed to run database migrations');
    logError('Make sure the database is running and accessible');
    process.exit(1);
  }
}

// Create sample data
function createSampleData() {
  logStep('📝', 'Creating sample data...');
  
  try {
    // This would typically create some sample categories, tags, and posts
    logInfo('Sample data creation not implemented yet');
    logInfo('You can create your first post through the admin interface');
  } catch (error) {
    logWarning('Failed to create sample data, but this is not critical');
  }
}

// Main setup function
async function main() {
  try {
    log('🎯 Modern Chyrp Blog Engine Setup', 'bright');
    log('=====================================\n', 'bright');
    
    // Check Docker
    if (!checkDocker()) {
      logError('Docker is not running!');
      logError('Please start Docker Desktop and try again');
      process.exit(1);
    }
    logSuccess('Docker is running');
    
    // Create environment file
    createEnvFile();
    
    // Start Docker containers
    startDocker();
    
    // Install dependencies
    installDependencies();
    
    // Run migrations
    runMigrations();
    
    // Create sample data
    createSampleData();
    
    log('\n🎉 Setup completed successfully!', 'green');
    log('\n📋 Next steps:', 'bright');
    log('1. Start the application: npm run dev', 'cyan');
    log('2. Open http://localhost:5173 in your browser', 'cyan');
    log('3. Register a new account', 'cyan');
    log('4. Start creating your blog!', 'cyan');
    
    log('\n🔧 Available commands:', 'bright');
    log('• npm run dev          - Start development servers', 'cyan');
    log('• npm run build        - Build for production', 'cyan');
    log('• npm run start        - Start production server', 'cyan');
    
    log('\n📚 Documentation:', 'bright');
    log('• README.md            - Complete setup and usage guide', 'cyan');
    log('• API endpoints        - Available at http://localhost:3000', 'cyan');
    
    log('\n🚀 Happy blogging!', 'green');
    
  } catch (error) {
    logError(`Setup failed: ${error.message}`);
    process.exit(1);
  }
}

// Run setup
if (require.main === module) {
  main();
}

module.exports = { main };
