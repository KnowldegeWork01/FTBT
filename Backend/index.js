require("dotenv").config();
const express = require("express");
const dbConnect = require("./DB/dbConnect");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const ChatMessage = require("./models/Chat_Message");
const http = require("http");
const socketIo = require("socket.io");
const chatRoute = require("./Routes/Chat");
const login = require("./Routes/login");
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  }
});

app.use(cors());


// Socket.IO connection
io.on("connection", (socket) => {
  console.log("New client connected");
  // Join the user-specific room
  socket.on("joinRoom", (userName) => {
    socket.join(userName);
    console.log(`${userName} joined the room`);
  });
  socket.on("sendMessage", async (message) => {
    const chatMessage = new ChatMessage(message);
    await chatMessage.save();
    io.to(message.toSender).to(message.toReceiver).emit("receiveMessage", chatMessage);
  });
  socket.on("disconnect", () => {
    console.log("Client disconnected");
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

// Set the io object on the app
app.set("io", io);


app.get("/", async (req, res) => res.send("<h1>Connected ...</h1>"));


server.listen(PORT, async () => {
  await dbConnect();
  console.log(`server at ${PORT} , DB Connected`);
});
