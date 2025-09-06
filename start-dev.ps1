Write-Host "Starting Blog Engine Development Servers..." -ForegroundColor Green

# Start Docker containers
Write-Host "Starting Docker containers..." -ForegroundColor Yellow
docker compose up -d

# Start backend server in background
Write-Host "Starting backend server..." -ForegroundColor Yellow
Start-Job -ScriptBlock {
    Set-Location "server"
    npm run dev
} | Out-Null

# Wait a moment for backend to start
Start-Sleep -Seconds 5

# Start frontend server
Write-Host "Starting frontend server..." -ForegroundColor Yellow
Set-Location "client"
npm run dev

