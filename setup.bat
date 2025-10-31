@echo off
echo Checking development environment...
echo.

echo Checking GCC installation...
g++ --version
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: GCC is not installed or not in PATH
    echo Please install MinGW-w64 with GCC 13.2.0 and add it to PATH
    echo Download from: https://github.com/niXman/mingw-builds-binaries/releases
    pause
    exit /b 1
)

echo.
echo Checking Node.js installation...
node --version
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo.
echo Checking npm installation...
npm --version
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: npm is not installed
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo.
echo Checking Asio installation...
if not exist "C:\asio-1.28.0\include\asio.hpp" (
    echo ERROR: Asio is not found at C:\asio-1.28.0
    echo Please download Asio from https://think-async.com/Asio/
    echo and extract it to C:\asio-1.28.0
    pause
    exit /b 1
)

echo.
echo All dependencies are installed!
echo.
echo Setting up the project...

echo.
echo Installing frontend dependencies...
cd frontend\React
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)

echo.
echo Building backend...
cd ..\..\backend
g++ -std=c++17 -I./Crow/include -I"C:/asio-1.28.0/include" main.cpp -o app.exe -lws2_32 -lwsock32 -lmswsock
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to build backend
    pause
    exit /b 1
)

echo.
echo Setup complete! You can now run the application using:
echo .\start.bat
echo.
cd ..

pause