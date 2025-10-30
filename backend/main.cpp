#define CROW_MAIN
#include "crow.h"
#include <vector>
#include <string>

// Enable CORS manually
void enableCORS(crow::response& res) {
    res.add_header("Access-Control-Allow-Origin", "*");
    res.add_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.add_header("Access-Control-Allow-Headers", "Content-Type");
}

// Sample data structure
struct Todo {
    int id;
    std::string text;
    bool completed;
    
    crow::json::wvalue to_json() const {
        crow::json::wvalue json;
        json["id"] = id;
        json["text"] = text;
        json["completed"] = completed;
        return json;
    }
};

int main() {
    crow::SimpleApp app;
    std::vector<Todo> todos = {
        {1, "Learn C++", true},
        {2, "Learn React", true},
        {3, "Build Full-stack App", false}
    };
    int next_id = 4;

    // Root route
    CROW_ROUTE(app, "/")([]() {
        return "C++ Crow Backend API";
    });

    // Get all todos
    CROW_ROUTE(app, "/api/todos").methods("GET"_method)([&todos]() {
        crow::json::wvalue response;
        std::vector<crow::json::wvalue> todo_list;
        for (const auto& todo : todos) {
            todo_list.push_back(todo.to_json());
        }
        response["todos"] = std::move(todo_list);
        return response;
    });

    // Add new todo
    CROW_ROUTE(app, "/api/todos").methods("POST"_method)
    ([&todos, &next_id](const crow::request& req) {
        auto x = crow::json::load(req.body);
        if (!x) {
            return crow::response(400);
        }
        
        Todo new_todo;
        new_todo.id = next_id++;
        new_todo.text = x["text"].s();
        new_todo.completed = false;
        todos.push_back(new_todo);
        
        return crow::response(201, new_todo.to_json());
    });

    // Toggle todo status
    CROW_ROUTE(app, "/api/todos/<int>").methods("PUT"_method)
    ([&todos](int id) {
        for (auto& todo : todos) {
            if (todo.id == id) {
                todo.completed = !todo.completed;
                return crow::response(200, todo.to_json());
            }
        }
        return crow::response(404);
    });

    // Delete todo
    CROW_ROUTE(app, "/api/todos/<int>").methods("DELETE"_method)
    ([&todos](int id) {
        auto it = std::find_if(todos.begin(), todos.end(),
            [id](const Todo& t) { return t.id == id; });
        if (it != todos.end()) {
            todos.erase(it);
            return crow::response(204);
        }
        return crow::response(404);
    });

    // Handle preflight requests (CORS)
    CROW_ROUTE(app, "/<path>").methods("OPTIONS"_method)
    ([](const crow::request&, crow::response& res, std::string) {
        enableCORS(res);
        res.end();
    });

    app.port(8080).multithreaded().run();
}
