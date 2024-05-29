import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import * as docx from "docx-preview";

const DocxViewer = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [open, setOpen] = useState(false);
  const [fileContent, setFileContent] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedContent, setHighlightedContent] = useState("");

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (
      file &&
      file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      setSelectedFile(file);
      try {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const arrayBuffer = e.target.result;
          const content = await extractTextFromDocx(arrayBuffer);
          setFileContent(content);
          setHighlightedContent(content);
          setOpen(true);
        };
        reader.readAsArrayBuffer(file);
      } catch (error) {
        console.error("Error reading file:", error);
        alert("Failed to read file. Please try again.");
      }
    } else {
      alert("Please select a valid .docx file.");
    }
  };

  const extractTextFromDocx = async (arrayBuffer) => {
    return new Promise((resolve, reject) => {
      const container = document.createElement("div");
      docx
        .renderAsync(arrayBuffer, container, null, { className: "docx" })
        .then(() => {
          resolve(container.innerHTML);
        })
        .catch(reject);
    });
  };

  const handleSearch = () => {
    if (!fileContent || !searchTerm) return;
    const regex = new RegExp(`(${searchTerm})`, "gi");
    const newContent = fileContent.replace(
      regex,
      `<span style="background-color: yellow;">$1</span>`
    );
    setHighlightedContent(newContent);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedFile(null);
    setFileContent("");
    setSearchTerm("");
    setHighlightedContent("");
  };
  return (
    <div>
      <Button variant="contained" component="label">
        Choose DOCX File
        <input
          type="file"
          accept=".docx"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg" style={{border:"2px solid"}}>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Document Viewer
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ padding: "1rem" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent style={{ height: "80vh", overflow: "hidden" }}>
          <TextField
            label="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            variant="outlined"
            style={{ width: "30%", marginTop: "0.5rem" }}
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            style={{
              padding: "1rem",
              marginLeft: "0.5rem",
              marginTop: "0.5rem",
            }}
          >
            Search
          </Button>
          <div
            style={{
              height: "100%",
              width: "100%",
              overflow: "auto",
              marginTop: "1rem",
              gap: "1rem",
            }}
            dangerouslySetInnerHTML={{ __html: highlightedContent }}
          ></div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocxViewer;
