const express = require("express");
const router = express.Router();
const userSchema = require("../models/Schema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")

router.post("/addUser", async (req, res) => {
    try {
      const { userName, password, department } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new userSchema({
        userName,
        password: hashedPassword,
        department,
      });
     await newUser.save();
      res.status(201).json({ message: "User added successfuly" });
    } catch (error) {
      console.log("Error adding data:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
router.post("/authenticate", async (req, res) => {
    try {
      const { userName, password, department } = req.body;
      const user = await userSchema.findOne({ userName, department });
      if (!user) {
        return res.status(400).json({ message: "User Not Found" });
      }
      if (password !== user.password) {
        return res.status(400).json({ message: "Invalid Password" });
      }
      const token = jwt.sign(
        { userId: user._id, department: user.department },
        process.env.JWT_SECRET
      );
      return res.status(200).json({ token,userName: user.userName });
    } catch (error) {
      console.log("Error authenticating user:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  });


  //hashed password
// router.post("/authenticate", async (req, res) => {
//   try {
//     const { userName, password, department } = req.body;
//     const user = await userSchema.findOne({ userName, department });
    
//     if (!user) {
//       return res.status(400).json({ message: "User Not Found" });
//     }
//     const isPasswordValid = await bcrypt.compare(password, user.password);
    
//     if (!isPasswordValid) {
//       return res.status(400).json({ message: "Invalid Password" });
//     }
//     const token = jwt.sign(
//       { userId: user._id, department: user.department },
//       process.env.JWT_SECRET,
//       { expiresIn: '5s' } 
//     );
    
//     return res.status(200).json({ token, userName: user.userName });
//   } catch (error) {
//     console.log("Error authenticating user:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// });

  router.get("/users", async (req, res) => {
    try {
      const users = await userSchema.find(); 
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  router.post("/projects", async (req, res) => {
    try {
      const { name, userId } = req.body;
      const project = await Project.create({ name, userId });
      res.status(201).json(project);
    } catch (error) {
      console.error('Error creating project:', error);
      res.status(500).json({ message: 'Server Error' });
    }
  });

  module.exports = router;