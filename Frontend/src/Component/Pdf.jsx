import React, { useState } from "react";
import { Button, Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

const PDF = () => {
  const [pdfUrl, setPdfUrl] = useState("");
  const [open, setOpen] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const blob = new Blob([e.target.result], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
        setOpen(true);
      };
      reader.onerror = (error) => {
        console.error("Error reading file:", error);
        alert("Failed to read file. Please try again.");
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert("Please select a valid PDF file.");
    }
  };

  const handleClose = () => {
    setOpen(false);
    setPdfUrl("");
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
    }
  };

  return (
    <div>
      <Button variant="contained" component="label">
        Choose PDF File
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xl">
        <DialogTitle>
          <IconButton aria-label="close" onClick={handleClose} sx={{ position: 'absolute', right: 0, top: 0 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent style={{ padding: 0 }}>
          {pdfUrl && (
            <iframe
              title="PDF Preview"
              src={pdfUrl}
              style={{ width: "100%", height: "89vh", border: "none" }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PDF;
