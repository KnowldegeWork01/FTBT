const express = require("express");
const dbConnect = require("./DB/dbConnect");
const cors = require("cors");
const app = express();
const FT = require("./models/FT");

const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.post("/api/addUser", async (req, res) => {
  try {
    const { userName, password } = req.body;
    const newUser = new FT({
      userName,
      password,
    });
    await newUser.save();
    res.status(201).json({ message: "Data added successfully" });
  } catch (error) {
    console.log("Error adding data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/authenticate", async (req, res) => {
  try {
    const { userName, password } = req.body;
    const user = await FT.findOne({ userName, password });
    if (user) {
      res.sendStatus(200);
    } else {
      res.sendStatus(500);
    }
  } catch (error) {
    console.log("Error authenticating user:", error);
    res.sendStatus(500);
  }
});
app.get("/", (req, res) => {
  res.send("<h1>DB Connected</h1>");
});

app.listen(PORT, async () => {
  await dbConnect();
  console.log(`server at ${PORT} , DB Connected`);
});
