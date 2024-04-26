import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./CSS/Component.css";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@material-ui/core";
import * as XLSX from "xlsx";
import * as ExcelJS from "exceljs";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import ClassicEditor from "ckeditor5-build-classic-extended";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import Loader from "./Common_Component/Loader";

function FT() {
  const [isLoading, setIsLoading] = useState(false);
  const [isQCSelected, setIsQCSelected] = useState(false);
  const [uploadedData, setUploadedData] = useState([]);
  const [csvData, setCSVData] = useState([]);
  const [tcxData, setTcxData] = useState([]);
  const [editableData, setEditableData] = useState([]);
  const [ftData, setFTData] = useState([]);
  const [savedData, setSavedData] = useState([]);
  const [downloadReady, setDownloadReady] = useState(false);
  const [dataTrue, setDataTrue] = useState(false);
  const [hideTmxColumn, setHideTmxColumn] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate('/FT');
    }
  }, [navigate]);

  const handleFileUploadQC = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setIsLoading(true); 
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      const workbook = XLSX.read(content, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      const [headers, ...rows] = data;
      const columnNames = headers.map((header) => header.trim());
      if (
        columnNames.length !== 3 ||
        !columnNames.includes("Source") ||
        !columnNames.includes("BT") ||
        !columnNames.includes("Comment")
      ) {
        alert(
          "The uploaded file must have three columns named Source, BT, and Comment."
        );
        setIsLoading(false);
        return;
      }
      const formattedData = rows.map((row) => ({
        source: row[columnNames.indexOf("Source")],
        bt: row[columnNames.indexOf("BT")],
        comment: row[columnNames.indexOf("Comment")],
      }));
      setUploadedData(formattedData);
      setIsLoading(false); 
    };

    reader.readAsBinaryString(file);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setIsLoading(true); 
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const parsedData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        range: 1,
      });
      setCSVData(parsedData);
      setIsLoading(false);
    };
    fileReader.readAsArrayBuffer(file);
  };

  const handleFileUploadTcx = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setIsLoading(true); 
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
      setIsLoading(false); 
    };
    reader.readAsText(file, "ISO-8859-1");
  };

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

  const handleDownloadCSV = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    savedData.forEach((sentence) => {
      const row = worksheet.addRow();
      const cell = row.getCell(1);
      const textSegments = [];
      let currentSegment = { text: "", font: {} };

      let insideTag = false;
      let tempText = "";
      let currentTag = "";

      for (let i = 0; i < sentence.length; i++) {
        if (sentence[i] === "<") {
          insideTag = true;
          textSegments.push(currentSegment);
          currentSegment = { text: "", font: {} };
        } else if (sentence[i] === ">") {
          insideTag = false;
          const htmlTag = tempText.toLowerCase();
          if (htmlTag === "strong" || htmlTag === "b") {
            currentSegment.font.bold = true;
          } else if (htmlTag === "i") {
            currentSegment.font.italic = true;
          } else if (htmlTag === "sup") {
            currentSegment.font.size = 11;
            currentSegment.font.vertAlign = "superscript";
          } else if (htmlTag === "sub") {
            currentSegment.font.size = 11;
            currentSegment.font.vertAlign = "subscript";
          }
          tempText = "";
        } else {
          if (insideTag) {
            tempText += sentence[i];
          } else {
            currentSegment.text += sentence[i];
          }
        }
      }

      textSegments.push(currentSegment);
      cell.value = { richText: textSegments };
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "formatted_data.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleEditorChange = (event, editor, index) => {
    const data = editor.getData();
    const newData = [...savedData];
    const cleanedData = data.replace(/<p>/g, "").replace(/<\/p>/g, "");
    newData[index] = cleanedData;
    setSavedData(newData);
  };

  return (
    <div>
      <div className="nav">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUploadQC}
          style={{ display: "none" }}
          id="fileQC"
        />
        <label htmlFor="fileQC">
          <Button
            variant="contained"
            component="span"
            startIcon={<CloudUploadIcon />}
          >
            QC
          </Button>
        </label>
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
            Source
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
            TMX
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
          FT
        </Button>
      </div>
        {isLoading && (
        <div className="spinner-overlay">
          <Loader />
        </div>
      )}
      {isQCSelected ? (
        <div>
          <TableContainer component={Paper} style={{ border: "2px solid" }}>
            <Table aria-label="simple table" sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell className="navbarCss">
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
                {uploadedData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell
                      style={{
                        fontSize: "1rem",
                        width: "28%",
                      }}
                    >
                      <div style={{ display: "flex" }}>
                        <div>
                          <b>({index + 1})</b>
                        </div>
                        <div style={{ marginLeft: "0.5rem" }}>{row.source}</div>
                      </div>
                    </TableCell>
                    <TableCell
                      style={{
                        fontSize: "1rem",
                        width: "28%",
                      }}
                    >
                      {row.bt}
                    </TableCell>
                    <TableCell
                      style={{
                        fontSize: "1rem",
                        width: "28%",
                      }}
                    >
                      {row.comment}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      ) : (
        <div>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <b>Source</b>
                  </TableCell>
                  <TableCell>
                    <b>TMX</b>
                    <Button onClick={() => setHideTmxColumn((prev) => !prev)}>
                      {hideTmxColumn ? (
                        <VisibilityOffIcon />
                      ) : (
                        <RemoveRedEyeIcon />
                      )}
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
                    <TableCell>
                      <textarea
                        variant="outlined"
                        style={{
                          padding: "1rem",
                          fontSize: "1rem",
                          resize: "none",
                        }}
                        multiline
                        rows={4}
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
                        style={{
                          height: "2.4rem",
                          marginLeft: "0.1rem",
                          marginTop: "-2rem",
                        }}
                        onClick={() => handleSave(index)}
                      >
                        Save
                      </Button>
                    </TableCell>
                    <TableCell style={{ width: "20%" }}>
                      <CKEditor
                        editor={ClassicEditor}
                        data={
                          compareAndSetFT(csvData[index], tcxData[index]) ===
                          "Right"
                            ? ftData[index]
                            : savedData[index]
                        }
                        onChange={(event, editor) =>
                          handleEditorChange(event, editor, index)
                        }
                        config={{
                          toolbar: [
                            "bold",
                            "italic",
                            "subscript",
                            "superscript",
                          ],
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}
    </div>
  );
}

export default FT;
