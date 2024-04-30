require("dotenv").config();
const express = require("express");
const dbConnect = require("./DB/dbConnect");
const department = require("./Routes/Project_Manager");
const router = express.Router();
const cors = require("cors");
const bcrypt = require("bcrypt")
const app = express();
const PORT = process.env.PORT || 8000;
const userSchema = require("./models/Schema");
app.use(cors());
const jwt = require("jsonwebtoken");
app.use(express.json());

app.use("/department", department);

// app.post("/api/addUser", async (req, res) => {
//   try {
//     const { userName, password, department } = req.body;
//     const newUser = new userSchema({
//       userName,
//       password,
//       department,
//     });
//     let data = await newUser.save();
//     res.status(201).json(data);
//   } catch (error) {
//     console.log("Error adding data:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });
app.post("/api/addUser", async (req, res) => {
  try {
    const { userName, password, department } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userSchema({
      userName,
      password: hashedPassword,
      department,
    });
    let data = await newUser.save();
    res.status(201).json({ message: "User added successfuly" });
  } catch (error) {
    console.log("Error adding data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//route

app.post("/api/filenames", async (req, res) => {
  try {
    const { _id, filename } = req.body;
    const user = await userSchema.findById(_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.filename = filename;
    await user.save();
    res.status(200).json({ message: "Filename updated successfully" });
  } catch (error) {
    console.error("Error updating filename:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.post("/api/authenticate", async (req, res) => {
  try {
    const { userName, password, department } = req.body;
    const user = await userSchema.findOne({ userName, department });
    if (!user) {
      return res.status(400).json({ message: "Invalid User" });
    }
    if (password !== user.password) {
      return res.status(400).json({ message: "Invalid Password" });
    }
    const token = jwt.sign(
      { userId: user._id, department: user.department },
      process.env.JWT_SECRET
    );
    return res.status(200).json({ token });
  } catch (error) {
    console.log("Error authenticating user:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});


app.get("/", async (req, res) => res.send("<h1>Connected ...</h1>"));

router.post("/users", async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.listen(PORT, async () => {
  await dbConnect();
  console.log(`server at ${PORT} , DB Connected`);
});
