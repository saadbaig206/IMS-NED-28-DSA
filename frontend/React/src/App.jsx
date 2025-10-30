import React, { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/message")
      .then((res) => res.json())
      .then((data) => setMessage(data.text))
      .catch((err) => console.error("Error fetching:", err));
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>React + C++ Crow Backend</h1>
      <h2>{message || "Hello Guyss......."}</h2>
    </div>
  );
}

export default App;
