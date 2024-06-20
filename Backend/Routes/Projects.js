const express = require("express");
const router = express.Router();
const Project = require("../models/Project.js");
const User = require("../models/Schema.js");

router.post("/projects", async (req, res) => {
  try {
    const { projectName, email, tmxUpload, sourceUpload } = req.body;
    if (!email) {
      return res.status(400).json({
        error: "Email not found in localStorage",
        details: "User email is required to create a project",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        error: "User not found",
        details: `User with email ${email} not found`,
      });
    }
    const newProject = new Project({
      projectName,
      userId: user._id,
      status: "Created",
      sourceUpload:[],
      tmxUpload:[],
      email,
    });
    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error Creating Project", details: error.message });
  }
});

router.get("/projects", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({
        error: "Email not provided",
        details: "User email is required to fetch projects",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        error: "User not found",
        details: `User with email ${email} not found`,
      });
    }
    const projects = await Project.find({ userId: user._id });
    res.status(200).json(projects);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching projects", details: error.message });
  }
});

router.get("/projects/:id", async (req, res) => {
  try {
    const project = await Project.findById(res.params.id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.status(200).json(project);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching Project", details: error.message });
  }
});

router.put("/projects/:id", async (req, res) => {
  try {
    const { projectName, userId, status, sourceUpload, tmxUpload } = req.body;
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      { projectName, userId, status, sourceUpload, tmxUpload },
      { new: true, runValidators: true }
    );
    if (!updatedProject) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.status(200).json(updatedProject);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error updating project", details: error.message });
  }
});
router.delete("/projects/:id", async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);
    if (!deletedProject) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error deleting project", details: error.message });
  }
});

module.exports = router;
