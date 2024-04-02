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
import Papa from "papaparse";
import * as XLSX from "xlsx";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";

function BT() {
  const [csvData, setCSVData] = useState([]);
  const [tcxData, setTcxData] = useState([]);
  const [editableData, setEditableData] = useState([]);
  const [ftData, setFTData] = useState([]);
  const [savedData, setSavedData] = useState([]);
  const [downloadReady, setDownloadReady] = useState(false);
  const [dataTrue, setDataTrue] = useState(false);
  const [hideTmxColumn, sethideTmxColumn] = useState(false);

  // const handleFileUpload = (event) => {
  //   const file = event.target.files[0];
  //   if (!file) return;
  //   const reader = new FileReader();
  //   reader.onload = (e) => {
  //     const content = e.target.result;
  //     const rows = content.split("\n").map((row) => row.trim());
  //     const data = rows
  //       .map((row, index) => {
  //         if (index === 0) return null;
  //         return row.split(",");
  //       })
  //       .filter((row) => row !== null);
  //       console.log(data);
  //     setCSVData(data);
  //   };
  //   reader.readAsText(file, "ISO-8859-1");
  // };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const parsedData = XLSX.utils.sheet_to_json(worksheet, { header: 1, range: 1 });
      setCSVData(parsedData);
    };
    fileReader.readAsArrayBuffer(file);
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
        .filter((node) => node.getAttribute("xml:lang") === "KN")
        .map((node) => node.querySelector("seg").textContent);
      setTcxData(englishTranslations);
      setEditableData(new Array(englishTranslations.length).fill(""));
      setDownloadReady(true);
      const knTranslations = Array.from(tuvNodes)
        .filter((node) => node.getAttribute("xml:lang") === "EN-US")
        .map((node) => node.querySelector("seg").textContent);
      setFTData(knTranslations);
    };
    reader.readAsText(file, "ISO-8859-1");
  };

  // const compareAndSetFT = (sourceSentence, tmxSentence) => {
  //   const sourceString = String(sourceSentence)
  //     .trim()
  //     .replace(/[^\w\s]/g, "");
  //   const tmxString = String(tmxSentence)
  //     .trim()
  //     .replace(/[^\w\s]/g, "");

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
    const cleanSource = String(sourceSentence).trim().replace(/[^\w]/g, "");
    const cleanTmx = String(tmxSentence).trim().replace(/[^\w]/g, "");

    if (cleanSource === cleanTmx) {
      return "Right";
    } else {
      return "";
    }
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
      "data:text/xlsx;charset=utf-8," +
      savedData.map((row) => `"${row}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Bt.csv");
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
          top: "1rem",
          zIndex: "1",
        }}
      >
        <input
          type="file"
          accept=".xlsx"
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
            (FT)
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
          startIcon={<CloudDownloadIcon />}
        >
          (BT)
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>
                <b>FT</b>
              </TableCell>
              <TableCell>
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
                <b>Edit </b>
              </TableCell>
              <TableCell>
                <b>BT</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {csvData.map((csvRow, index) => (
              <TableRow key={index}>
                <TableCell
                  style={{
                    fontSize: "1rem",
                    width: "25%",
                    // border: "1px solid",
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
                    visibility: hideTmxColumn ? "hidden" : "visible",
                  }}
                >
                  {tcxData[index]}
                </TableCell>
                <TableCell
                  style={{
                    width: "25%",
                  }}
                >
                  <TextField
                    variant="outlined"
                    style={{ width: "80%" }}
                    multiline
                    maxRows={3}
                    placeholder={
                      csvData.length > 0 && tcxData.length > 0
                        ? compareAndSetFT(csvData[index], tcxData[index])
                        : ""
                    }
                    value={editableData[index]} // Controlled by editableData state
                    onChange={(e) => {
                      const newEditableData = [...editableData];
                      newEditableData[index] = e.target.value;
                      setEditableData(newEditableData); // Update editableData
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

export default BT;
