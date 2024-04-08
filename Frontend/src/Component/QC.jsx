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
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";


const QC = ({ loggedInData }) => {
  
  const [englishSource, setEnglishSource] = useState([]);
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

  //   const handleDownload = () => {
  //     const fileName = prompt("Enter file name (without extension):", "data");
  //     const combinedData = englishSource.map((source, index) => ({
  //       source,
  //       bt: englishBT[index] || "",
  //       comment: comments[index] || "",
  //     }));
  //     const csvContent =  "Source,BT,Comment\n" +
  //       combinedData
  //         .map((row) => `${row.source},${row.bt},${row.comment}`)
  //         .join("\n");
  //     const blob = new Blob([csvContent]);
  //     const link = document.createElement("a");
  //     link.href = URL.createObjectURL(blob);
  //     link.setAttribute("download",`${fileName}.csv`);
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //   };
  //   try {
  //     await axios.post("http://localhost:8000/save-filename", {
  //       fileName,
  //       directoryPath,
  //     });
  //     console.log("File name saved to MongoDB");
  //   } catch (error) {
  //     console.error("Error saving file name to MongoDB:", error);
  //   }
  // };

  // const handleDownload = async () => {
  //   const fileName = prompt("Enter file name (without extension):", "data");
  //   if (!fileName) return;
  //   const combinedData = englishSource.map((source, index) => ({
  //     source,
  //     bt: englishBT[index] || "",
  //     comment: comments[index] || "",
  //   }));
  //   const csvContent = "Source,BT,Comment\n" +
  //     combinedData
  //       .map((row) => `${row.source},${row.bt},${row.comment}`)
  //       .join("\n");
  //   const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  //   const link = document.createElement("a");
  //   link.href = URL.createObjectURL(blob);
  //   link.setAttribute("download", `${fileName}.csv`);
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  //   try {
  //     await axios.post("http://localhost:8000/",{
  //       fileName,
  //     });
  //     console.log("File name saved to MongoDB");
  //   } catch (error) {
  //     console.error("Error saving file name to MongoDB:", error);
  //   }
  // };
  // const randomString = () => {
  //   const chars = "ABCDEFGHIJLKMNOPQRSTUVWXYZ0123456789";

  //   let result = "";

  //   for (let i = 7; i > 0; i--) {
  //     result += chars[Math.round(Math.random() * (chars.length - 1))];
  //   }

  //   return result;
  // };

  const handleDownload = async () => {
    const fileName = prompt("Enter file name (without extension):", "data");
    if (!fileName) return;
    const combinedData = englishSource.map((source, index) => ({
      source,
      bt: englishBT[index] || "",
      comment: comments[index] || "",
    }));
    const csvContent =
      "Source,BT,Comment\n" +
      combinedData
        .map((row) => `${row.source},${row.bt},${row.comment}`)
        .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `${fileName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    try {
      let data = {
        _id: loggedInData.data._id,
        filename: filename,
      };
      const response = await fetch("/api/filenames", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log("Filename added successfully");
      } else {
        console.error("Failed to add filename");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
useEffect(()=>{
  console.log("loggedin :--",loggedInData);
},[loggedInData])

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
          top: "4rem",
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
            {englishSource.map((csvRow, index) => (
              <TableRow key={index}>
                <TableCell
                  style={{
                    fontSize: "1rem",
                    width: "30%",
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
                    width: "30%",
                  }}
                >
                  {englishBT[index]}
                </TableCell>
                <TableCell>
                  <textarea
                    variant="outlined"
                    style={{ width: "90%", resize: "none", fontSize: "1rem" }}
                    multiline
                    rows={4}
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
