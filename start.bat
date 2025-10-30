@echo off

REM Start Backend
cd /d %~dp0\backend
start cmd /k "g++ -std=c++17 -I./Crow/include -I"C:/asio-1.28.0/include" main.cpp -o app.exe -lws2_32 -lwsock32 -lmswsock && app.exe"

REM Start Frontend
cd /d %~dp0\frontend\React
start cmd /k "npm install && npm run dev"

echo Full-stack application is starting...
echo Backend: http://localhost:8080
echo Frontend: http://localhost:5173