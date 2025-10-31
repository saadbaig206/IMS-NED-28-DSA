import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", quantity: 0 });

  useEffect(() => {
    fetch("http://localhost:8080/items")
      .then((res) => res.json())
      .then((data) => setItems(data.items || []));
  }, []);

  const addItem = async () => {
    if (!newItem.name || newItem.quantity <= 0) {
      alert("Please enter valid item details!");
      return;
    }

    await fetch("http://localhost:8080/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem),
    });
    window.location.reload();
  };

  return (
    <div className="app-container">
      <div className="inventory-card">
        <h2>Inventory Management System</h2>

        <div className="input-section">
          <input
            placeholder="Item name"
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Quantity"
            onChange={(e) =>
              setNewItem({ ...newItem, quantity: Number(e.target.value) })
            }
          />
          <button onClick={addItem}>Add Item</button>
        </div>

        <ul className="item-list">
          {items.map((item) => (
            <li key={item.id}>
              <span>{item.name}</span>
              <span className="quantity">Qty: {item.quantity}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
