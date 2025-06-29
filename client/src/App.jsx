import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import { Toaster } from "react-hot-toast";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

function App() {
  const { authUser, isLoading } = useContext(AuthContext);
  
  if (isLoading) {
    return (
      <div className="bg-[#FFFDE7] bg-cover min-h-screen flex items-center justify-center">
        <div className="text-[#3E2723] text-xl font-medium">Loading...</div>
        <Toaster />
      </div>
    );
  }
  
  return (
    <div className="bg-[#FFFDE7] bg-cover min-h-screen">
      <Toaster />
      <Routes>
        <Route path="/" element={authUser ? <Home /> : <Navigate to="/login" />} />
        <Route path="/login" element={!authUser ? <Auth isLogin={true} /> : <Navigate to="/" />} />
        <Route path="/register" element={!authUser ? <Auth isLogin={false} /> : <Navigate to="/" />} />
        <Route path="/profile" element={authUser ? <Profile /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;