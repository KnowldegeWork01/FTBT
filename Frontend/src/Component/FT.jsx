import React, { useEffect, useState } from "react";
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
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import ClassicEditor from "ckeditor5-build-classic-extended";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";




function FT() {
  const [isQCSelected, setIsQCSelected] = useState(false);
  const [uploadedData, setUploadedData] = useState([]);
  const [csvData, setCSVData] = useState([]);
  const [tcxData, setTcxData] = useState([]);
  const [editableData, setEditableData] = useState([]);
  const [ftData, setFTData] = useState([]);
  const [savedData, setSavedData] = useState([]);
  const [downloadReady, setDownloadReady] = useState(false);
  const [dataTrue, setDataTrue] = useState(false);
  const [hideTmxColumn, sethideTmxColumn] = useState(false);

  const handleQCClick = () => {
    setIsQCSelected(true);
  };
  const handleSourceClick = () => {
    setIsQCSelected(false);
  };
  const handleFileUploadQC = (event) => {
    const file = event.target.files[0];
    if (!file) return;
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
        return;
      }
      const formattedData = rows.map((row) => ({
        source: row[columnNames.indexOf("Source")],
        bt: row[columnNames.indexOf("BT")],
        comment: row[columnNames.indexOf("Comment")],
      }));
      setUploadedData(formattedData);
    };

    reader.readAsBinaryString(file);
  };
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
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
  // const handleDownloadCSV = () => {
  //   const csvContent =
  //     "data:text/xlsx;charset=utf-8," +
  //     savedData.map((row) => `"${row}"`).join("\n");
  //   const encodedUri = encodeURI(csvContent);
  //   const link = document.createElement("a");
  //   link.setAttribute("href", encodedUri);
  //   link.setAttribute("download", "FT.xlsx");
  //   document.body.appendChild(link);
  //   link.click();
  // };

  // const handleDownloadCSV = () => {
  //   const workbook = XLSX.utils.book_new();
  //   const worksheet = XLSX.utils.aoa_to_sheet(
  //     savedData.map((row) => row.split("\t"))
  //   );
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  //   const excelBuffer = XLSX.write(workbook, {
  //     bookType: "xlsx",
  //     type: "array",
  //   });
  //   const excelBlob = new Blob([excelBuffer], {
  //     type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //   });
  //   const link = document.createElement("a");
  //   link.href = URL.createObjectURL(excelBlob);
  //   link.setAttribute("download", "FT.xlsx");
  //   document.body.appendChild(link);
  //   link.click();
  // };

  //   const handleDownloadCSV = () => {
  //     const workbook = XLSX.utils.book_new();
  //     const formattedData = savedData.map((row) => {
  //         let formattedRow = row.replace(/<sub>/g, "_").replace(/<\/sub>/g, "");
  //         formattedRow = formattedRow
  //             .replace(/<sup>/g, "^")
  //             .replace(/<\/sup>/g, "");
  //         return formattedRow;
  //     });
  //     const worksheet = XLSX.utils.aoa_to_sheet(
  //         formattedData.map((row) => row.split("\t"))
  //     );
  //     XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  //     const excelBuffer = XLSX.write(workbook, {
  //         bookType: "xlsx",
  //         type: "array",
  //     });
  //     const excelBlob = new Blob([excelBuffer], {
  //         type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //     });
  //     const link = document.createElement("a");
  //     link.href = URL.createObjectURL(excelBlob);
  //     link.setAttribute("download", "FT.xlsx");
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  // };

  
  const handleDownloadCSV = () => {
    const workbook = XLSX.utils.book_new();
    const sheetName = "Sheet1";
  
    const wsData = savedData.map((row) => {
      const temp = document.createElement("div");
      temp.innerHTML = row;
  
      // Extract text and formatting information
      const cellValue = {
        t: "s",
        v: temp.textContent, // Extract text content
      };
  
      // Check for bold and italic formatting
      if (temp.querySelector("strong")) {
        cellValue.s = { font: { bold: true } };
      }
  
      if (temp.querySelector("i") || temp.querySelector("em")) {
        cellValue.s = { ...cellValue.s, font: { italic: true } };
      }
  
      return [cellValue];
    });
  
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(workbook, ws, sheetName);
  
    // Generate Excel file object
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
  
    // Create a link element and trigger download
    const link = document.createElement("a");
    link.href = url;
    link.download = "formatted_data.xlsx";
    document.body.appendChild(link);
    link.click();
  
    // Clean up
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
    console.log("saved data :--", savedData);
  }, [savedData]);

  const handlehide = () => {
    console.log("handlehide");
    sethideTmxColumn((prevState) => !prevState);
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
            onClick={handleQCClick}
            startIcon={<CloudDownloadIcon />}
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
            onClick={handleSourceClick}
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
      {isQCSelected ? (
        <div>
          <TableContainer component={Paper}>
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
                        // border: "1px solid",
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
                    <Button onClick={() => handlehide()}>
                      {hideTmxColumn ? (
                        <VisibilityOffIcon />
                      ) : (
                        <RemoveRedEyeIcon />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <b>Edit </b>
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
                       <TableCell style={{width:"20%"  }}>
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
