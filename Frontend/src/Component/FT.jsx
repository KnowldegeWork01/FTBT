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
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';


function FT() {
  const [csvData, setCSVData] = useState([]);
  const [tcxData, setTcxData] = useState([]);
  const [editableData, setEditableData] = useState([]);
  const [ftData, setFTData] = useState([]);
  const [savedData, setSavedData] = useState([]);
  const [downloadReady, setDownloadReady] = useState(false);
  const [dataTrue, setDataTrue] = useState(false);
  const [hideTmxColumn, sethideTmxColumn] = useState(false);

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
      setCSVData(data);
    };
    reader.readAsText(file, "ISO-8859-1");
  };

  const handleFileUploadTcx = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(content, "text/xml");
      const tuvNodes = xmlDoc.getElementsByTagName("tuv");
      const englishTranslations = Array.from(tuvNodes)
        .filter((node) => node.getAttribute("xml:lang") === "EN-US")
        .map((node) => node.querySelector("seg").textContent);
      setTcxData(englishTranslations);
      setEditableData(new Array(englishTranslations.length).fill(""));
      setDownloadReady(true);
      const knTranslations = Array.from(tuvNodes)
        .filter((node) => node.getAttribute("xml:lang") === "KN")
        .map((node) => node.querySelector("seg").textContent);
      setFTData(knTranslations);
    };
    reader.readAsText(file, "ISO-8859-1");
  };

  // const compareAndSetFT = (sourceSentence, tmxSentence) => {
  //   const sourceString = String(sourceSentence)
  //     .trim()
  //     .replace(/[^\w\s]/g, ""); // Remove special characters except alphanumeric characters
  //   const tmxString = String(tmxSent
  //     .trim()
  //     .replace(/[^\w\s]/g, ""); // Remove special characters except alphanumeric characters

  //   const sourceWords = sourceString.split(/\s+/).sort().join(" ");
  //   const tmxWords = tmxString.split(/\s+/).sort().join(" ");

  //   if (sourceWords.length !== tmxWords.length) {
  //     return "Wrong";
  //   }

  //   for (let i = 0; i < sourceWords.length; i++) {
  //     if (sourceWords[i] !== tmxWords[i]) {
  //       return "Wrong";
  //     }
  //   }

  //   return "Right";
  // };

  const compareAndSetFT = (sourceSentence, tmxSentence) => {
    const sourceString = String(sourceSentence)
      .trim()
      .replace(/[^\w\s]/g, "");
    const tmxString = String(tmxSentence)
      .trim()
      .replace(/[^\w\s]/g, "");

    const sourceWords = sourceString
      .split(/\s+/)
      .filter((word) => word.trim() !== "")
      .sort();
    const tmxWords = tmxString
      .split(/\s+/)
      .filter((word) => word.trim() !== "")
      .sort();

    if (sourceWords.length !== tmxWords.length) {
      return "";
    }

    for (let i = 0; i < sourceWords.length; i++) {
      if (sourceWords[i] !== tmxWords[i]) {
        return "";
      }
    }

    return "Right";
  };

  const handleSave = (index) => {
    const newSavedData = [...savedData];
    newSavedData[index] = editableData[index];
    setSavedData(newSavedData);

    const newEditableData = [...editableData];
    newEditableData[index] = "";
    setEditableData(newEditableData);
  };

  const handleDownloadCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      savedData.map((row) => `"${row}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "ft_column_data.csv");
    document.body.appendChild(link);
    link.click();
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (dataTrue) {
        setDataTrue(false);
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [dataTrue]);

  useEffect(() => {
    if (ftData.length > 0) {
      const newData = [...savedData];
      ftData.forEach((value, index) => {
        if (compareAndSetFT(csvData[index], tcxData[index]) === "Right") {
          newData[index] = value;
        } else {
          newData[index] = editableData[index];
        }
      });
      setSavedData(newData);
    }
  }, [ftData]);

  useEffect(() => {
    console.log("saved data", savedData);
  }, [savedData]);

  const handlehide = () => {
    console.log("handlehide");
    sethideTmxColumn((prevState) => !prevState);
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
          top: "4rem",
          zIndex: "1",
        }}
      >
        <input
          type="file"
          accept=".csv"
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
          accept=".tmx"
          onChange={handleFileUploadTcx}
          style={{ display: "none" }}
          id="fileInput2"
        />
        <label htmlFor="fileInput2">
          <Button
            variant="contained"
            component="span"
            startIcon={<CloudUploadIcon />}
          >
           (TMX)
          </Button>
        </label>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleDownloadCSV}
          disabled={!downloadReady}
          style={{ marginLeft: "1rem" }}
          startIcon={<CloudDownloadIcon/>}
        >
        (FT)
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>
                <b>Source</b>
              </TableCell>
              <TableCell >
                <b>TMX</b>
                <Button
                  onClick={() => {
                    handlehide();
                  }}
                >
                  {hideTmxColumn ? <RemoveRedEyeIcon /> : <VisibilityOffIcon />}
                </Button>
              </TableCell>
              <TableCell>
                <b>Edit</b>
              </TableCell>
              <TableCell>
                <b>FT</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {csvData.map((csvRow, index) => (
              <TableRow key={index}>
                <TableCell
                  style={{
                    fontSize: "1rem",
                    width: "30%",
                    // display: "flex",
                    // border: "1px solid",
                  }}
                >
                  <div style={{ display: "flex" }}>
                    <div><b>({index + 1})</b></div>
                    <div style={{ marginLeft: "0.5rem" }}>{csvRow}</div>
                  </div>
                </TableCell>
                <TableCell
                  style={{
                    fontSize: "1rem",
                    width: "30%",
                    visibility: hideTmxColumn ? "hidden" : "visible",
                  }}
                >
                  {tcxData[index]}
                </TableCell>
                <TableCell
                  style={{
                    width: "20%",
                  }}
                >
                  <TextField
                    variant="outlined"
                    style={{ width: "70%" }}
                    multiline
                    maxRows={3}
                    placeholder={
                      csvData.length > 0 && tcxData.length > 0
                        ? compareAndSetFT(csvData[index], tcxData[index])
                        : ""
                    }
                    value={editableData[index]}
                    onChange={(e) => {
                      const newEditableData = [...editableData];
                      newEditableData[index] = e.target.value;
                      setEditableData(newEditableData);
                    }}
                    disabled={
                      compareAndSetFT(csvData[index], tcxData[index]) ===
                      "Right"
                    }
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    startIcon={<SaveIcon />}
                    style={{
                      height: "3.4rem",
                      width: "5rem",
                      marginLeft: "0.2rem",
                    }}
                    onClick={() => handleSave(index)}
                  >
                    Save
                  </Button>
                </TableCell>
                <TableCell>
                  <div>
                    <CKEditor
                      editor={ClassicEditor}
                      data={
                        compareAndSetFT(csvData[index], tcxData[index]) ===
                        "Right"
                          ? ftData[index]
                          : savedData[index]
                      }
                      config={{
                        toolbar: ["bold", "italic"],
                      }}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default FT;
