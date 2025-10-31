#define CROW_MAIN
#include "crow.h"
#include <vector>
#include <string>
using namespace std;

struct Item {
    int id;
    string name;
    string description;
    int quantity;
    double price;
    string category;
    string created_at;
    string updated_at;

    static string get_current_time() {
        time_t now = time(0);
        struct tm tstruct;
        char buf[80];
        tstruct = *localtime(&now);
        strftime(buf, sizeof(buf), "%Y-%m-%d %X", &tstruct);
        return string(buf);
    }

    crow::json::wvalue to_json() const {
        crow::json::wvalue obj;
        obj["id"] = id;
        obj["name"] = name;
        obj["description"] = description;
        obj["quantity"] = quantity;
        obj["price"] = price;
        obj["category"] = category;
        obj["created_at"] = created_at;
        obj["updated_at"] = updated_at;
        return obj;
    }
};

// ✅ Global CORS Enabler Middleware
struct CORS {
    struct context {};
    void before_handle(crow::request& req, crow::response& res, context&) {
        if (req.method == "OPTIONS"_method) {
            res.add_header("Access-Control-Allow-Origin", "*");
            res.add_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            res.add_header("Access-Control-Allow-Headers", "Content-Type");
            res.end();
        }
    }
    void after_handle(crow::request&, crow::response& res, context&) {
        res.add_header("Access-Control-Allow-Origin", "*");
        res.add_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.add_header("Access-Control-Allow-Headers", "Content-Type");
    }
};

int main() {
    crow::App<CORS> app;  // ✅ enable middleware globally
    vector<Item> inventory;

    // GET all items
    CROW_ROUTE(app, "/api/items")
    ([&inventory]() {
        crow::json::wvalue result;
        vector<crow::json::wvalue> items;
        for (const auto &item : inventory) {
            items.push_back(item.to_json());
        }
        result["items"] = std::move(items);
        return result;
    });

    // POST new item
    CROW_ROUTE(app, "/api/items").methods("POST"_method)
    ([&inventory](const crow::request& req) {
        auto data = crow::json::load(req.body);
        if (!data)
            return crow::response(400, "Invalid JSON");

        if (!data.has("name") || !data.has("quantity"))
            return crow::response(400, "Missing required fields");

        Item newItem;
        newItem.id = inventory.empty() ? 1 : (inventory.back().id + 1);
        newItem.name = data["name"].s();
        newItem.description = data.has("description") ? std::string(data["description"].s()) : std::string("");
        newItem.quantity = data["quantity"].i();
        newItem.price = data.has("price") ? data["price"].d() : 0.0;
        newItem.category = data.has("category") ? std::string(data["category"].s()) : std::string("Uncategorized");
        newItem.created_at = Item::get_current_time();
        newItem.updated_at = newItem.created_at;
        
        inventory.push_back(newItem);
        return crow::response(201, newItem.to_json());
    });

    // Update item
    CROW_ROUTE(app, "/api/items/<int>").methods("PUT"_method)
    ([&inventory](const crow::request& req, int id) {
        auto it = find_if(inventory.begin(), inventory.end(),
            [id](const Item& item) { return item.id == id; });
            
        if (it == inventory.end()) {
            return crow::response(404, "Item not found");
        }

        auto data = crow::json::load(req.body);
        if (!data)
            return crow::response(400, "Invalid JSON");

        if (data.has("name")) it->name = data["name"].s();
        if (data.has("description")) it->description = data["description"].s();
        if (data.has("quantity")) it->quantity = data["quantity"].i();
        if (data.has("price")) it->price = data["price"].d();
        if (data.has("category")) it->category = data["category"].s();
        it->updated_at = Item::get_current_time();

        return crow::response(200, it->to_json());
    });

    // Delete item
    CROW_ROUTE(app, "/api/items/<int>").methods("DELETE"_method)
    ([&inventory](int id) {
        auto it = find_if(inventory.begin(), inventory.end(),
            [id](const Item& item) { return item.id == id; });
            
        if (it == inventory.end()) {
            return crow::response(404, "Item not found");
        }

        inventory.erase(it);
        return crow::response(204);
    });

    // Optional: allow browser preflight
    CROW_ROUTE(app, "/<path>").methods("OPTIONS"_method)
    ([](const crow::request&, crow::response& res, std::string) {
        res.add_header("Access-Control-Allow-Origin", "*");
        res.add_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.add_header("Access-Control-Allow-Headers", "Content-Type");
        res.end();
    });

    app.port(8080).multithreaded().run();
}
