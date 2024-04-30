import React, { createContext, useState } from "react";
import FT from "../FT";
export const myFunctionContext = createContext();

const Function = () => {
    const [csvData, setCSVData] = useState([]);
    const [tcxData, setTcxData] = useState([]);
    const [ftData, setFTData] = useState([]);
    const [savedData, setSavedData] = useState([]);
    const [uploadedData, setUploadedData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [editableData, setEditableData] = useState([]); 

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
    <myFunctionContext.Provider
    value={{
      handleFileUploadQC,
      handleEditorChange,
      handleFileUploadTcx,
      compareAndSetFT,
      handleFileUpload,
      handleDownloadCSV,
      handleSave,
      csvData,
      setCSVData,
      editableData, 
    }}
  >
    <FT />
  </myFunctionContext.Provider>
  
   
  );
};

export default Function;
