# Full-Stack Todo App (React + C++ Crow)

This is a sample full-stack application using:
- Frontend: React (with Vite)
- Backend: C++ with Crow framework

## Prerequisites

1. C++ Development:
   - GCC 13.2.0 or later (with C++17 support)
   - Asio library (extracted to C:/asio-1.28.0)

2. Node.js Development:
   - Node.js and npm

## Project Structure

```
.
├── backend/
│   ├── Crow/          # Crow framework
│   ├── main.cpp       # C++ backend server
│   └── build.bat      # Backend build script
├── frontend/
│   └── React/         # React frontend
└── start.bat         # Script to start both frontend and backend
```

## Getting Started

1. Make sure all prerequisites are installed
2. Run the start script:
   ```bash
   .\start.bat
   ```

This will:
- Build and start the C++ backend server on http://localhost:8080
- Install dependencies and start the React dev server on http://localhost:5173

## API Endpoints

The backend provides these REST endpoints:

- `GET /api/todos` - List all todos
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Toggle todo completion status
- `DELETE /api/todos/:id` - Delete a todo

## Development

### Backend (C++)
- Edit `backend/main.cpp` for server logic
- The server uses Crow for REST API and CORS support
- Build manually with:
  ```bash
  cd backend
  ./app.exe
  g++ -std=c++17 -I./Crow/include -I"C:/asio-1.28.0/include" main.cpp -o app.exe -lws2_32 -lwsock32 -lmswsock
  ```
  This will amke backend server

### Frontend (React)
- Edit files in `frontend/React/src/`
- Main component is in `App.jsx`
- Run development server:
  ```bash
  cd Front_end
  cd inventory-zen-37-main
  npm install
  npm run dev
  ```
- This will start your frontend 