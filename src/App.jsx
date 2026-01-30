import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import AIInsights from "./pages/AIInsights";
import Login from "./pages/Login";
import { useAuth } from "./context/AuthContext";
import SignUp from "./pages/SignUp";


const Protected = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" />;
};

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
     <Route path="/signup" element={<SignUp />} />


      <Route
        path="/dashboard"
        element={<Protected><Dashboard /></Protected>}
      />
      <Route
        path="/profile"
        element={<Protected><Profile /></Protected>}
      />
      <Route
        path="/ai"
        element={<Protected><AIInsights /></Protected>}
      />
    </Routes>
  );
}
