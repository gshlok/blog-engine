const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

// Generate a secure random JWT secret
const jwtSecret = crypto.randomBytes(32).toString('hex');

// Server environment variables
const serverEnv = `DATABASE_URL="postgresql://myuser:mypassword@localhost:5432/mydb"
JWT_SECRET="${jwtSecret}"`;

// Client environment variables
const clientEnv = `VITE_API_BASE_URL=http://localhost:3000`;

// Write the .env files
fs.writeFileSync(path.join(__dirname, 'server', '.env'), serverEnv);
fs.writeFileSync(path.join(__dirname, 'client', '.env'), clientEnv);

console.log('✨ Environment files created successfully!');
console.log('📝 Server .env and client .env have been configured.');
console.log('🔐 A secure JWT secret has been generated.');
console.log('🚀 You can now run: docker compose up -d && npm run dev');
