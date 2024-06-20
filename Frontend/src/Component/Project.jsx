import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  IconButton,
  Typography,
  Box,
  Snackbar,
  Slide,
  Drawer,
  AppBar,
  Toolbar,
  IconButton as MUIButton,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import MuiAlert from "@mui/material/Alert";
import { MdDelete, MdOutlinePeople } from "react-icons/md";
import { GoPlus } from "react-icons/go";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import "./CSS/Component.css";

const MyComponent = () => {
  const [projectName, setProjectName] = useState("");
  const [projects, setProjects] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [language, setLanguage] = useState([]);
  const [sourceLanguage, setSourceLanguage] = useState("");
  const [targetLanguage, setTargetLanguage] = useState([]);
  const [clientName, setClientName] = useState("");
  useEffect(() => {
    fetchProjects();
    fetchLanguage();
  }, []);

  const fetchProjects = async () => {
    try {
      const email = localStorage.getItem("email");
      const response = await axios.get("http://localhost:8000/api/Projects", {
        params: { email },
      });
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };
  const fetchLanguage = async () => {
    try {
      const languageData = await fetch("http://localhost:8000/language", {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("email"),
        },
      });
      const json = await languageData.json();
      setLanguage(json);
    } catch (err) {
      console.log(err);
    }
  };

  // const handleCloseSnackbar = (event, reason) => {
  //   if (reason === "clickaway") {
  //     return;
  //   }
  //   setOpenSnackbar(false);
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (projectName === "") {
      setErrorMessage("Please enter a project name");
      setOpenSnackbar(true);
      return;
    }
    const email = localStorage.getItem("email");
    if (!email) {
      setErrorMessage("User email not found in localStorage.");
      setOpenSnackbar(true);
      return;
    }
    try {
      const response = await axios.post("http://localhost:8000/api/projects", {
        projectName: projectName,
        email: email,
        sourceUpload: [],
        tmxUpload: [],
      });
      setProjects([...projects, response.data]);
      setProjectName("");
      setIsDrawerOpen(false); // Close the drawer after submission
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };
  const handleCreateProject = async () => {
    const email = localStorage.getItem("email");

    try {
      const response = await axios.post(
        "http://localhost:8000/api/createProject",
        {
          projectName: clientName + Date.now(),
          email: email,
          sourceLanguage,
          targetLanguage,
        }
      );
      console.log("Project created:", response.data);
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const handleStatusChange = async (index, newStatus) => {
    try {
      const updatedProject = { ...projects[index], status: newStatus };
      await axios.put(
        `http://localhost:8000/api/projects/${updatedProject._id}`,
        updatedProject
      );
      const updatedProjects = [...projects];
      updatedProjects[index] = updatedProject;
      setProjects(updatedProjects);
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const handleDelete = async (index) => {
    try {
      await axios.delete(
        `http://localhost:8000/api/projects/${projects[index]._id}`
      );
      const updatedProjects = projects?.filter((_, i) => i !== index);
      setProjects(updatedProjects);
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const handleSourceUploadChange = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("sourceUpload", file);
    try {
      const response = await axios.post(
        `http://localhost:8000/api/projects/${projects[index]._id}/upload-source`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      const updatedProjects = [...projects];
      updatedProjects[index].sourceUpload = response?.data?.fileName;
      setProjects(updatedProjects);
    } catch (error) {
      console.error("Error uploading source file:", error);
    }
  };

  const handleTmxUploadChange = async (e, index) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    const formData = new FormData();
    files.forEach((file) => formData.append("tmxUpload", file));
    try {
      const response = await axios.post(
        `http://localhost:8000/api/projects/${projects[index]._id}/upload-tmx`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      const updatedProjects = [...projects];
      updatedProjects[index].tmxUpload = response?.data?.files;
      setProjects(updatedProjects);
    } catch (error) {
      console.error("Error uploading TMX files:", error);
    }
  };

  const toggleDrawer = (isOpen) => () => {
    setIsDrawerOpen(isOpen);
  };
  return (
    <>
      <div style={{ margin: "2rem" }}>
        <Box>
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", justifyContent: "end" }}
          >
            <TextField
              label="Enter Project Name..."
              variant="outlined"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
            <Button
              type="button"
              style={{ fontSize: "2.5rem", color: "black" }}
              onClick={toggleDrawer(true)}
            >
              <GoPlus />
            </Button>
          </form>
        </Box>
      </div>
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{ style: { width: "40%" } }}
      >
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              Add New Project
            </Typography>
            <MUIButton edge="end" color="inherit" onClick={toggleDrawer(false)}>
              <CloseIcon />
            </MUIButton>
          </Toolbar>
        </AppBar>
        <div
          style={{
            margin: "70px 22px 0px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: "15px", fontWeight: "bold" }}>
            Client Name<span style={{ color: "red" }}>*</span>
          </span>
          <span>
            <TextField
              name="fullName"
              variant="standard"
              placeholder="Full Name"
              onChange={(e) => setClientName(e.target.value)}
              sx={{ width: "350px" }}
            />
          </span>
        </div>
        <div
          style={{
            margin: "70px 22px 0px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: "15px", fontWeight: "bold" }}>
            Source Language<span style={{ color: "red" }}>*</span>
          </span>
          <span>
            <select
              value={sourceLanguage}
              onChange={(e) => setSourceLanguage(e.target.value)}
              style={{ width: "200px" }}
            >
              <option value="" disabled>
                Select Language
              </option>
              {language.map((lang) => (
                <option key={lang._id} value={lang.languageName}>
                  {lang.languageName}
                </option>
              ))}
            </select>
          </span>
        </div>
        <div
          style={{
            margin: "70px 22px 0px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: "15px", fontWeight: "bold" }}>
            target Language<span style={{ color: "red" }}>*</span>
          </span>
          <span>
            <select
              value={targetLanguage}
              onChange={(e) => {
                const updatedLanguages = [...targetLanguage]; // Create a copy of the targetLanguage array
                updatedLanguages[0] = e.target.value; // Update the language at the specified index
                setTargetLanguage(updatedLanguages); // Set the updated array to state
              }}
              // onChange={(e) => setTargetLanguage(e.target.value)}
              style={{ width: "200px" }}
            >
              <option value="" disabled>
                Select Language
              </option>
              {language.map((lang) => (
                <option key={lang._id} value={lang.languageName}>
                  {lang.languageName}
                </option>
              ))}
            </select>
          </span>
        </div>
        <Button onClick={handleCreateProject}>Save</Button>
      </Drawer>
      <div>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {["Project Name", "Status", "Source", "TMX", "Actions"].map(
                  (header, index) => (
                    <TableCell
                      key={index}
                      style={{
                        fontWeight: "bold",
                        fontSize: "1rem",
                        width: "20%",
                      }}
                    >
                      {header}
                    </TableCell>
                  )
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {projects?.map((project, index) => (
                <TableRow key={index}>
                  <TableCell style={{ fontSize: "1.2rem" }}>
                    {project.projectName}
                  </TableCell>
                  <TableCell style={{ fontSize: "1.2rem" }}>
                    {project.status}
                  </TableCell>

                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <input
                        id={`source-file-input-${index}`}
                        type="file"
                        accept=".csv"
                        onChange={(e) => handleSourceUploadChange(e, index)}
                        style={{ display: "none" }}
                      />
                      <label htmlFor={`source-file-input-${index}`}>
                        <IconButton component="span">
                          <CloudUploadIcon />
                        </IconButton>
                      </label>
                      <Typography variant="body1">
                        {project.sourceUpload
                          ? `${project.sourceUpload.length} Files`
                          : "No file chosen"}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <input
                        id={`tmx-file-input-${index}`}
                        type="file"
                        accept=".tmx"
                        onChange={(e) => handleTmxUploadChange(e, index)}
                        multiple
                        style={{ display: "none" }}
                      />
                      <label htmlFor={`tmx-file-input-${index}`}>
                        <IconButton component="span">
                          <CloudUploadIcon />
                        </IconButton>
                      </label>
                      <Typography variant="body1">
                        {project.tmxUpload
                          ? `${project.tmxUpload.length} Files`
                          : "No file chosen"}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box
                      display="flex"
                      alignItems="center"
                      paddingRight="5rem"
                      className="icon-container"
                    >
                      <MdOutlinePeople className="icon" />
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      {/* <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        TransitionComponent={Slide}
      >
        <MuiAlert
          onClose={handleCloseSnackbar}
          severity="error"
          elevation={6}
          variant="filled"
        >
          {errorMessage}
        </MuiAlert>
      </Snackbar> */}
    </>
  );
};

export default MyComponent;
