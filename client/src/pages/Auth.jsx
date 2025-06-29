import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { Lock, Mail, User, Eye, EyeOff, MessagesSquare } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

const Auth = ({ isLogin }) => {
  const { login, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUsername] = useState("");

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setUsername("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const credentials = isLogin
      ? { email, password }
      : { email, password, userName };

    try {
      const success = await login(isLogin ? "login" : "register", credentials);

      if (success) {
        setTimeout(() => {
          navigate("/");
          resetForm();
        }, 100);
      }
    } catch (error) {
      console.error("Auth error:", error);
    }
  };

  const toggleAuthState = () => {
    navigate(isLogin ? "/register" : "/login");
    resetForm();
  };

  return (
    <div className="min-h-screen bg-[#FFFDE7] flex items-center backdrop-blur-2xl justify-center gap-8 sm:justify-evenly max-sm:flex-col p-4">
      <div className="text-center">
        <div className="bg-[#FFD54F] w-fit mx-auto p-6 rounded-full flex items-center justify-center mb-4">
          <MessagesSquare size={100} className="text-[#3E2723]" />
        </div>
        <h1 className="text-3xl font-bold text-[#3E2723] mb-2">
          {isLogin ? "Welcome Back" : "Join Us"}
        </h1>
        <p className="text-[#3E2723]/70 max-w-md mx-auto">
          {isLogin
            ? "Login to access your account and continue your journey with us."
            : "Create an account to get started and explore all features."}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-[#FFF9C4]/80 backdrop-blur-lg border-2 border-[#FFD54F]/50 p-4 md:p-8 flex flex-col gap-6 rounded-xl shadow-xl w-full max-w-[350px]"
      >
        <h2 className="text-2xl font-semibold text-[#3E2723] text-center">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        {!isLogin && (
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-[#F57F17]" />
            </div>
            <input
              type="text"
              name="username"
              value={userName}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full pl-10 pr-4 py-3 bg-[#FFF176]/50 border-2 border-[#FFD54F]/40 rounded-lg text-[#3E2723] placeholder-[#3E2723]/60 focus:outline-none focus:ring-2 focus:ring-[#F57F17] focus:border-[#F57F17]"
              required
            />
          </div>
        )}

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-[#F57F17]" />
          </div>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            className="w-full pl-10 pr-4 py-3 bg-[#FFF176]/50 border-2 border-[#FFD54F]/40 rounded-lg text-[#3E2723] placeholder-[#3E2723]/60 focus:outline-none focus:ring-2 focus:ring-[#F57F17] focus:border-[#F57F17]"
            required
          />
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-[#F57F17]" />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full pl-10 pr-12 py-3 bg-[#FFF176]/50 border-2 border-[#FFD54F]/40 rounded-lg text-[#3E2723] placeholder-[#3E2723]/60 focus:outline-none focus:ring-2 focus:ring-[#F57F17] focus:border-[#F57F17]"
            required
            minLength={6}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-[#F57F17] hover:text-[#3E2723]" />
            ) : (
              <Eye className="h-5 w-5 text-[#F57F17] hover:text-[#3E2723]" />
            )}
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#FFD54F] hover:bg-[#F57F17] disabled:bg-[#FFD54F]/50 disabled:cursor-not-allowed text-[#3E2723] py-3 px-4 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-[#FFD54F]/30"
        >
          {isLoading ? "Please wait..." : isLogin ? "Login" : "Create Account"}
        </button>

        <div className="text-center text-[#3E2723]/70">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={toggleAuthState}
            disabled={isLoading}
            className="text-[#F57F17] hover:text-[#3E2723] font-medium disabled:cursor-not-allowed transition-colors"
          >
            {isLogin ? "Sign up" : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Auth;
