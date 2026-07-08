import { useState } from "react";
import "./App.css";
import AppRoutes from "./auth/routes/AppRoutes.jsx";
import { AuthProvider } from "./auth/context/AuthContext.jsx";

function App() {
  const [count, setCount] = useState(0);

  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
