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
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import "./CSS/Component.css"
import MuiAlert from "@mui/material/Alert";
import { MdDelete } from "react-icons/md";
import { FaRegSave } from "react-icons/fa";
import axios from "axios";
import { MdOutlinePeople } from "react-icons/md";

const MyComponent = () => {
  const [projectName, setProjectName] = useState("");
  const [projects, setProjects] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const email = localStorage.getItem("email");
      const response = await axios.get("http://localhost:8000/api/projects", {
        params: { email },
      });
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };
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
        sourceUpload: "",
        tmxUpload: "",
      });
      setProjects([...projects, response.data]);
      setProjectName("");
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
      const updatedProjects = projects?.filter((project, i) => i !== index);
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
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("tmxUpload", file);
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
      console.error("Error uploading TMX file:", error);
    }
  };

  return (
    <>
      <div style={{ margin: "2rem" }}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Enter Project Name..."
            variant="outlined"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
          <Button
            type="submit"
            style={{ fontSize: "2.4rem", margin: "0.2rem" }}
          >
            <FaRegSave />
          </Button>
        </form>
      </div>
      <div>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  style={{
                    fontWeight: "bold",
                    fontSize: "1rem",
                  }}
                >
                  S.NO.
                </TableCell>
                <TableCell
                  style={{
                    fontWeight: "bold",
                    fontSize: "1rem",
                    width: "20%",
                  }}
                >
                  Project Name
                </TableCell>
                <TableCell
                  style={{
                    fontWeight: "bold",
                    fontSize: "1rem",
                    width: "20%",
                  }}
                >
                  Status
                </TableCell>
                <TableCell
                  style={{
                    fontWeight: "bold",
                    fontSize: "1rem",
                    width: "20%",
                  }}
                >
                  Action
                </TableCell>
                <TableCell
                  style={{
                    fontWeight: "bold",
                    fontSize: "1rem",
                    width: "20%",
                  }}
                >
                  Source
                </TableCell>
                <TableCell
                  style={{
                    fontWeight: "bold",
                    fontSize: "1rem",
                    width: "20%",
                  }}
                >
                  TMX
                </TableCell>
                <TableCell
                  style={{
                    fontWeight: "bold",
                    fontSize: "1rem",
                    width: "20%",
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody style={{}}>
              {projects?.map((project, index) => (
                <TableRow key={index}>
                  <TableCell style={{ fontSize: "1.2rem" }}>
                    [{index + 1}]
                  </TableCell>
                  <TableCell style={{ fontSize: "1.2rem" }}>
                    {project.projectName}
                  </TableCell>
                  <TableCell style={{ fontSize: "1.2rem" }}>
                    {project.status}
                  </TableCell>
                  <TableCell style={{ fontSize: "1.2rem" }}>
                    <Select
                      value={project.status}
                      style={{ width: "45%" }}
                      onChange={(e) =>
                        handleStatusChange(index, e.target.value)
                      }
                    >
                      <MenuItem value="Created">Created</MenuItem>
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="Completed">Completed</MenuItem>
                    </Select>
                    <Button
                      onClick={() => handleDelete(index)}
                      style={{ fontSize: "2rem" }}
                    >
                      <MdDelete />
                    </Button>
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
                          ? project.sourceUpload.length + " "+ "Files"
                          : "No file chosen"}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" paddingRight="5rem">
                      <input
                        id={`tmx-file-input-${index}`}
                        type="file"
                        accept=".tmx"
                        onChange={(e) => handleTmxUploadChange(e, index)}
                        style={{ display: "none" }}
                      />
                      <label htmlFor={`tmx-file-input-${index}`}>
                        <IconButton component="span">
                          <CloudUploadIcon />
                        </IconButton>
                      </label>
                      <Typography variant="body1">
                        {project.tmxUpload
                          ? project.tmxUpload.length + " "+ "Files"
                          : "No file chosen"}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
      <Box display="flex" alignItems="center" paddingRight="5rem" className="icon-container">
        <MdOutlinePeople className="icon" />
      </Box>
    </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={1500}
        onClose={handleCloseSnackbar}
        TransitionComponent={Slide}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          severity="error"
          onClose={handleCloseSnackbar}
        >
          {errorMessage}
        </MuiAlert>
      </Snackbar>
    </>
  );
};
export default MyComponent;
