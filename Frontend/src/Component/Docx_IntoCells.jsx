import React, { useState } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import * as docx from "docx-preview";
import "./CSS/Component.css";

const DocxTableViewer = () => {
  const [docxContent, setDocxContent] = useState([]);
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const arrayBuffer = e.target.result;
        const content = await parseDocx(arrayBuffer);
        setDocxContent(content);
      };
      reader.readAsArrayBuffer(file);
    }
  };
  const parseDocx = async (arrayBuffer) => {
    return new Promise((resolve, reject) => {
      const container = document.createElement("div");
      docx
        .renderAsync(arrayBuffer, container, null, { className: "docx" })
        .then(() => {
          const paragraphs = container.querySelectorAll("p");
          const content = Array.from(paragraphs).flatMap((p) => {
            const text = p.innerText;
            const lines = text.split(/(?<=[.,])/g).map((line) => line.trim());
            return lines.filter((line) => line.length > 0);
          });
          resolve(content);
        })
        .catch(reject);
    });
  };

  return (
    <div>
      <Button variant="contained" component="label">
        Upload DOCX
        <input
          type="file"
          accept=".docx"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </Button>
      {docxContent.length > 0 && (
        <TableContainer component={Paper} className="docx-table-container">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>Source</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody style={{ width: "25%" }}>
              {docxContent.map((line, index) => (
                <TableRow key={index}>
                  <TableCell
                    style={{
                      fontSize: "1rem",
                      width: "10%",
                    }}
                  >
                    <div style={{ display: "flex", width: "25%" }}>
                      <div>
                        <b>({index + 1})</b>
                      </div>
                      <div style={{ marginLeft: "0.5rem" }}>{line}</div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default DocxTableViewer;
