# Build and start backend
Set-Location -Path "$PSScriptRoot\backend"
g++ -std=c++17 -I./Crow/include -I"C:/asio-1.28.0/include" main.cpp -o app.exe -lws2_32 -lwsock32 -lmswsock
if ($LASTEXITCODE -eq 0) {
    Start-Process -FilePath ".\app.exe"
    Write-Host "Backend started at http://localhost:8080"
} else {
    Write-Host "Backend build failed!"
    exit 1
}

# Start frontend
Set-Location -Path "$PSScriptRoot\frontend\React"
npm install
if ($LASTEXITCODE -eq 0) {
    npm run dev
    Write-Host "Frontend started at http://localhost:5173"
} else {
    Write-Host "Frontend setup failed!"
    exit 1
}