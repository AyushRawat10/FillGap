import { useState } from "react";
import "./App.css";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Register />
    </>
  );
}

export default App;
