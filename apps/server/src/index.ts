import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";

// ✅ NEW imports for socket.io
import { createServer } from "http";
import { Server } from "socket.io";
import type { Socket } from "socket.io"; // <-- the type for socket

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Health check route
app.get("/", (req: Request, res: Response) => {
  res.send("Server is running 🚀");
});

// Auth routes
app.use("/api/auth", authRoutes);

// ✅ Create HTTP server and attach socket.io
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // frontend URL
    methods: ["GET", "POST"],
  },
});

// 🟢 Canvas history to keep drawings in sync
let canvasHistory: { x: number; y: number; type: "start" | "draw" }[] = [];

// ✅ Properly typed socket
io.on("connection", (socket) => {
  console.log("a user connected");

  // Send the current canvas state to the new client
  socket.emit("canvasState", canvasHistory);

  // 🟢 When someone starts a new stroke
  socket.on("startDrawing", (data) => {
    canvasHistory.push({ ...data, type: "start" });
    socket.broadcast.emit("startDrawing", data);
  });

  // 🟢 When someone is drawing (moving mouse)
  socket.on("draw", (data) => {
    canvasHistory.push({ ...data, type: "draw" });
    socket.broadcast.emit("draw", data);
  });

  // 🟢 When someone clears the canvas
  socket.on("clear", () => {
    canvasHistory = [];
    socket.broadcast.emit("clear");
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

// ✅ Start the server
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

