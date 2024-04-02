import React, { useEffect, useState } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
} from "@material-ui/core";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import SaveIcon from "@material-ui/icons/Save";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import * as XLSX from "xlsx";

const QC = () => {
  const [englishSouce, setEnglishSource] = useState([]);
  const [englishBT, setEnglishBT] = useState([]);
  const [comments, setComments] = useState([]);

  // const handleFileUpload = (event) => {
  //   const file = event.target.files[0];
  //   if (!file) return;
  //   const reader = new FileReader();
  //   reader.onload = (e) => {
  //     const content = e.target.result;
  //     const rows = content.split("\n").map((row) => row.trim());
  //     const data = rows
  //       .map((row, index) => {
  //         return row.replace(/["']/g, "").split(",");
  //       })
  //       .filter((row) => row !== null);
  //     setEnglishSource(data);
  //   };
  //   reader.readAsText(file, "ISO-8859-1");
  // };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      const rows = content.split("\n").map((row) => row.trim());
      const data = rows
        .map((row, index) => {
          if (index === 0) return null;
          return row.split(",");
        })
        .filter((row) => row !== null);
      setEnglishSource(data);
    };
    reader.readAsText(file, "ISO-8859-1");
  };

  const handleFileUpload2 = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      const rows = content.split("\n").map((row) => row.trim());
      const data = rows
        .map((row, index) => {
          return row.replace(/["']/g, "").split(",");
        })
        .filter((row) => row !== null);
      setEnglishBT(data);
    };
    reader.readAsText(file, "ISO-8859-1");
  };
  const handleCommentChange = (index, event) => {
    const newComments = [...comments];
    newComments[index] = event.target.value;
    setComments(newComments);
  };
  const handleSaveComment = (index) => {
    console.log("Comment saved:", comments[index]);
  };
  const handleDownload = () => {
    const dataRows = englishSouce.map((source, index) => [
      source,
      englishBT[index] || "",
      comments[index] || "",
    ]);
    const ws = XLSX.utils.aoa_to_sheet([
      ["Source", "BT", "Comment"],
      ...dataRows,
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "qc.csv");
  };
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "1rem",
          alignItems: "center",
          padding: "1rem",
          position: "sticky",
          top: "1rem",
          zIndex: "1",
        }}
      >
        <input
          type="file"
          accept=".csv,.xlsx"
          onChange={handleFileUpload}
          style={{ display: "none" }}
          id="fileInput"
        />
        <label htmlFor="fileInput">
          <Button
            variant="contained"
            component="span"
            startIcon={<CloudUploadIcon />}
          >
            (Source)
          </Button>
        </label>
        <input
          type="file"
          accept=".csv,.xlsx"
          onChange={handleFileUpload2}
          style={{ display: "none" }}
          id="fileInput2"
        />
        <label htmlFor="fileInput2">
          <Button
            variant="contained"
            component="span"
            startIcon={<CloudUploadIcon />}
          >
            (BT)
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleDownload}
            style={{ marginLeft: "1rem" }}
            startIcon={<CloudDownloadIcon />}
          >
            (QC)
          </Button>
        </label>
      </div>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>
                <b>Source</b>
              </TableCell>
              <TableCell>
                <b>BT</b>
              </TableCell>
              <TableCell>
                <b>Comment</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {englishSouce.map((csvRow, index) => (
              <TableRow key={index}>
                <TableCell
                  style={{
                    fontSize: "1rem",
                    width: "35%",
                    padding: "1.5rem",
                  }}
                >
                  <div style={{ display: "flex" }}>
                    <div>
                      <b>({index + 1})</b>
                    </div>
                    <div style={{ marginLeft: "0.5rem" }}>{csvRow}</div>
                  </div>
                </TableCell>
                <TableCell
                  style={{
                    fontSize: "1rem",
                    width: "35%",
                  }}
                >
                  {englishBT[index]}
                </TableCell>
                <TableCell>
                  <TextField
                    variant="outlined"
                    style={{ width: "90%" }}
                    multiline
                    maxRows={3}
                    value={comments[index] || ""}
                    onChange={(event) => handleCommentChange(index, event)}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    startIcon={<SaveIcon />}
                    style={{ padding: "1rem" }}
                    onClick={() => handleSaveComment(index)}
                  >
                    Save
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default QC;
