cmake_minimum_required(VERSION 3.12)
project(crow_backend)

# Set C++ standard to C++17
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

# Add Crow subdirectory
add_subdirectory(Crow)

# Create the executable
add_executable(${PROJECT_NAME} main.cpp)

# Link against Crow
target_link_libraries(${PROJECT_NAME} PRIVATE Crow::Crow)

# Include directories
target_include_directories(${PROJECT_NAME} PRIVATE ${CMAKE_CURRENT_SOURCE_DIR})