const express = require("express");
const dbConnect = require("./DB/dbConnect");
const router = express.Router();
const bcrypt = require("bcrypt");
const cors = require("cors");
const app = express();
const PORT = 8000;
const userSchema = require("./models/Schema");
app.use(cors());
app.use(express.json());


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
    res.status(201).json(data);
  } catch (error) {
    console.log("Error adding data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post('/api/filenames', async (req, res) => {
  try {
    const { _id, filename } = req.body;
    const user = await userSchema.findById(_id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.filename = filename;
    await user.save();
    res.status(200).json({ message: 'Filename updated successfully' });
  } catch (error) {
    console.error('Error updating filename:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post("/api/authenticate", async (req, res) => {
  try {
    const { userName, password, department } = req.body;
    const user = await userSchema.findOne({
      userName,
      password,
      department,
    });
    if (user) {
    res.status(200).json(user);
    } else {
      res.sendStatus(500);
    }
  } catch (error) {
    console.log("Error authenticating user:", error);
    res.sendStatus(500);
  }
});

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
