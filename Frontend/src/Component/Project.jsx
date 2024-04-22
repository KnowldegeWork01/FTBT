import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const MyComponent = () => {
    const [projectName, setProjectName] = useState("");
    const [projects, setProjects] = useState(
      JSON.parse(localStorage.getItem("projects")) || []
    );
  
    useEffect(() => {
      localStorage.setItem("projects", JSON.stringify(projects));
    }, [projects]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (projectName === "") {
      alert("Please enter a project name.");
      return;
    }
    const newProject = {
      id: projects.length + 1,
      name: projectName,
      status: "Pending",
      sourceUpload: null,
    };
    setProjects([...projects, newProject]);
    setProjectName("");
  };

  const handleStatusChange = (index, newStatus) => {
    const updatedProjects = [...projects];
    updatedProjects[index].status = newStatus;
    setProjects(updatedProjects);
  };

  const handleDelete = (index) => {
    const updatedProjects = projects.filter((project, i) => i !== index);
    setProjects(updatedProjects);
  };

  const handleUploadChange = (e, index) => {
    const file = e.target.files[0];
    const updatedProjects = [...projects];
    updatedProjects[index].sourceUpload = file;
    setProjects(updatedProjects);
  };

  return (
    <>
      <div style={{ margin: "2rem" }}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Project Name"
            variant="outlined"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
          <Button
            type="submit"
            style={{ marginLeft: "1rem", padding: "0.9rem" }}
            variant="contained"
            color="primary"
          >
            Add Project
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
                    width: "20%",
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
                  Source Upload
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.map((project, index) => (
                <TableRow key={index}>
                  <TableCell style={{ fontSize: "1.2rem", width: "20%" }}>
                  ({index + 1})
                  </TableCell>
                  <TableCell style={{ fontSize: "1rem", width: "20%" }}>
                    {project.name}
                  </TableCell>
                  <TableCell style={{ fontSize: "1rem", width: "20%" }}>
                    {project.status}
                  </TableCell>
                  <TableCell style={{ fontSize: "1rem", width: "20%" }}>
                    <Select
                      value={project.status}
                      onChange={(e) =>
                        handleStatusChange(index, e.target.value)
                      }
                    >
                      <MenuItem value="Created">Created</MenuItem>
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="Completed">Completed</MenuItem>
                    </Select>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(index)}
                      style={{ marginLeft: "1rem",padding:"0.9rem" }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                  <TableCell style={{ fontSize: "1rem", width: "20%" }}>
                    <Box display="flex" alignItems="center">
                      <input
                        id={`file-input-${index}`}
                        type="file"
                        accept=".csv"
                        onChange={(e) => handleUploadChange(e, index)}
                        style={{ display: "none" }}
                      />
                      <label htmlFor={`file-input-${index}`}>
                        <IconButton component="span">
                          <CloudUploadIcon />
                        </IconButton>
                      </label>
                      <Typography variant="body1">
                        {project.sourceUpload
                          ? project.sourceUpload.name
                          : "No file chosen"}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
};

export default MyComponent;
