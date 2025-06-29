import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRouter.js";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

export const io = new Server(server, {
  cors: { origin: "*" },
});

// Track connected users
export const userSocketMap = {}; // { userId: socketId }

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log(`[SOCKET CONNECTED] userId: ${userId}, socketId: ${socket.id}`);

  if (userId) {
    userSocketMap[userId] = socket.id;
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  }

  socket.on("disconnect", () => {
    console.log(`[SOCKET DISCONNECTED] userId: ${userId}`);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// Middleware
app.use(cors());
app.use(express.json({ limit: "4mb" }));

// Routes
app.use("/status", (req, res) => res.send("Server is Live"));
app.use("/user", userRouter);
app.use("/messages", messageRouter);
await connectDB();

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(` Chat App Server Running on PORT: ${PORT}`);
});
