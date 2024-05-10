require("dotenv").config();
const express = require("express");
const dbConnect = require("./DB/dbConnect");
const department = require("./Routes/Project_Manager");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const app = express();
const userSchema = require("./models/Schema");
const Project = require("./models/Project");
const jwt = require("jsonwebtoken");
const ChatMessage = require("./models/Chat_Message");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");
const chatRoute = require("./Routes/Chat");
const login = require("./Routes/login");
const server = http.createServer(app);
const io = socketIo(server);

// Allow requests from both frontend and backend servers
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:8000"]
}));


io.on("connection", (socket) => {
  console.log("New client connected");
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
  // Handle chat messages
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg); // Broadcast the message to all connected clients
  });
});
//Server
const PORT = process.env.PORT || 8000;
// Middleware to parse JSON bodies
app.use(express.json());
app.use(bodyParser.json());

// app.post("/api/filenames", async (req, res) => {
//   try {
//     const { _id, filename } = req.body;
//     const user = await userSchema.findById(_id);
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }
//     user.filename = filename;
//     await user.save();
//     res.status(200).json({ message: "Filename updated successfully" });
//   } catch (error) {
//     console.error("Error updating filename:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// Use the chat route
app.use("/api/chat", chatRoute);
app.use("/api", login);


app.get("/", async (req, res) => res.send("<h1>Connected ...</h1>"));


server.listen(PORT, async () => {
  await dbConnect();
  console.log(`server at ${PORT} , DB Connected`);
});
