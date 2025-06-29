import { useContext } from "react";
import { useState } from "react";
import { createContext } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { useCallback } from "react";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { socket,axios } = useContext(AuthContext); 

  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});

  const getUsers =useCallback(async () => {
    try {
      const response = await axios.get("/messages/users");
      if (response.status === 200) {
        setUsers(response.data.users);
        setUnseenMessages(response.data.unseenMessages);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to get users");
    }
  },[]) 

 const getMessages = useCallback(async (userId) => {
  try {
    const response = await axios.get(`/messages/${userId}`);
    if (response.status === 200) {
      setMessages(response.data);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message || "Failed to get messages");
  }
}, []);


  const sendMessage = async (messageData) => {
    try {
      const response = await axios.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );

      if (response.status === 200) {
        setMessages((prev) => [...prev, response.data.newMessage]);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send message");
    }
  };

  const subscribeToMessages = () => {
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      if (selectedUser && newMessage.senderId == selectedUser._id) {
        newMessage.seen = true;
        setMessages((prev) => [...prev, newMessage]);
        axios.put(`/messages/mark/${newMessage._id}`).catch((error) => {
          console.error("Failed to mark message as seen:", error);
        });
      } else {
        setUnseenMessages((prev) => ({
          ...prev,
          [newMessage.senderId]: prev[newMessage.senderId]
            ? prev[newMessage.senderId] + 1
            : 1,
        }));
      }
    });
  };

  const unsubscribeFromMessages = () => {
    if (socket) socket.off("newMessage");
  };

  useEffect(() => {
    subscribeToMessages();
    return () => unsubscribeFromMessages(); 
  }, [socket, selectedUser]);

  const value = {
    messages,
    users,
    selectedUser,
    getUsers,
    setMessages,
    sendMessage,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
    
    setUsers,
    getMessages,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
