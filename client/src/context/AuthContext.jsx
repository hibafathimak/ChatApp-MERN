import axios from "axios";
import { createContext } from "react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    const savedToken = localStorage.getItem("token");
    return savedToken;
  });
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await axios.get("/user/check");

      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
      } else {
        logout();
      }
    } catch (error) {
      // If token is invalid, clear it
      if (error.response?.status === 403 || error.response?.status === 401) {
        logout();
      } else {
        toast.error(error?.response?.data?.message || "Auth check failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      // Set the authorization header
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      checkAuth();
    } else {
      // Clear the authorization header if no token
      delete axios.defaults.headers.common["Authorization"];
      setIsLoading(false);
    }
  }, [token]);

  const connectSocket = (userData) => {
    if (!userData || socket?.connected) return;

    const newSocket = io(backendUrl, {
      query: { userId: userData._id },
    });

    newSocket.connect();
    setSocket(newSocket);

    newSocket.on("getOnlineUsers", (userIds) => {
      setOnlineUsers(userIds);
    });
  };

  const login = async (state, credentials) => {
    try {
      setIsLoading(true);
      const response = await axios.post(`/user/${state}`, credentials);

      if (response.status >= 200 && response.status < 300) {
        const { token, user, message } = response.data;
        setToken(token);
        setAuthUser(user);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        localStorage.setItem("token", token);
        connectSocket(user);

        toast.success(message);
        return true; 
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setAuthUser(null);
    setOnlineUsers([]);

    delete axios.defaults.headers.common["Authorization"];
    localStorage.removeItem("token");

    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
    if (authUser) {
      toast.success("Logged out");
    }
  };

  const updateUserProfile = async (updatedData) => {
    try {
      const response = await axios.put("/user/update-profile", updatedData);

      if (response.status === 200) {
        setAuthUser(response.data.user);
        toast.success(response.data.message);
        return true;
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Update failed");
      return false;
    }
  };

    const value = {
      axios,
    authUser,
    setAuthUser,
    token,
    login,
    logout,
    updateUserProfile,
    onlineUsers,
    socket,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};