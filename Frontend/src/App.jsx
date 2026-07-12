import { useState } from "react";
import "./App.css";
import AppRoutes from "./auth/routes/AppRoutes.jsx";
import { AuthProvider } from "./auth/context/AuthContext.jsx";
import { InterviewProvider } from "./interview/contexts/InterviewContext.jsx";

function App() {
  const [count, setCount] = useState(0);

  return (
    <AuthProvider>
      <InterviewProvider>
        <AppRoutes />
      </InterviewProvider>
    </AuthProvider>
  );
}

export default App;
