@echo off
echo Starting Blog Engine Development Servers...

REM Start Docker containers
echo Starting Docker containers...
docker compose up -d

REM Start backend server in a new window
echo Starting backend server...
start "Backend Server" cmd /k "cd server && npm run dev"

REM Wait a moment for backend to start
timeout /t 3 /nobreak > nul

REM Start frontend server in current window
echo Starting frontend server...
cd client && npm run dev

