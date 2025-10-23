@echo off
REM OCC Dashboard Startup Script for Windows

echo Starting OCC Dashboard Dynamic Data System...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: npm is not installed. Please install npm first.
    pause
    exit /b 1
)

REM Install backend dependencies if needed
if not exist "backend\node_modules" (
    echo Installing backend dependencies...
    cd backend
    call npm install
    cd ..
)

REM Install frontend dependencies if needed
if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
)

REM Start backend server
echo Starting backend server on port 5001...
start "Backend Server" cmd /k "cd backend && npm start"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend development server
echo Starting frontend development server on port 3000...
echo.
echo Dashboard will be available at: http://localhost:3000
echo Backend API will be available at: http://localhost:5001
echo.
echo Press any key to stop both servers
pause >nul

REM Kill backend process (this is a simple approach)
taskkill /f /im node.exe >nul 2>&1
