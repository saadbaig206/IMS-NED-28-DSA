@echo off
g++ -std=c++17 -I./Crow/include -I"C:/asio-1.28.0/include" main.cpp -o app.exe -lws2_32 -lwsock32 -lmswsock
if %ERRORLEVEL% EQU 0 (
    echo Build successful! Running server...
    .\app.exe
) else (
    echo Build failed!
)