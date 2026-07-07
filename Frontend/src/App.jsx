import { useState } from "react";
import { Routes, Route } from "react-router";
import "./App.css";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Landing from "./pages/Landing.jsx";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Routes>
      <Route path="/" element={<Landing/>} />
      <Route path="/api/v1/auth/register" element={<Register/>} />
      <Route path="/api/v1/auth/login" element={<Login/>} />
    </Routes>
  );
}

export default App;
