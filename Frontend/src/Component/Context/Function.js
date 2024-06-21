import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import * as ExcelJS from "exceljs";
import * as docxPreview from "docx-preview";
import parse from "html-react-parser";
import mammoth from "mammoth";

export const FunctionContext = createContext();

export const FunctionProvider = ({ children }) => {
  const [isQCSelected, setIsQCSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedData, setUploadedData] = useState([]);
  const [csvData, setCSVData] = useState([]);
  const [tcxData, setTcxData] = useState([]);
  const [editableData, setEditableData] = useState([]);
  const [ftData, setFTData] = useState([]);
  const [savedData, setSavedData] = useState([]);
  const [downloadReady, setDownloadReady] = useState(false);
  const [dataTrue, setDataTrue] = useState(false);
  const [hideTmxColumn, sethideTmxColumn] = useState(false);
  const [englishSource, setEnglishSource] = useState([]);
  const [englishBT, setEnglishBT] = useState([]);
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();

  // useEffect(() => {
  //   console.log("savedData", savedData);
  // }, [savedData]);

  //URL blockage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

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
  // const handleFileUpload = (event) => {
  //   const file = event.target.files[0];
  //   if (!file) return;
  //   setIsLoading(true);
  //   const fileReader = new FileReader();
  //   fileReader.onload = (e) => {
  //     const data = new Uint8Array(e.target.result);
  //     const workbook = XLSX.read(data, { type: "array" });
  //     const firstSheetName = workbook.SheetNames[0];
  //     const worksheet = workbook.Sheets[firstSheetName];
  //     const parsedData = XLSX.utils.sheet_to_json(worksheet, {
  //       header: 1,
  //       range: 1,
  //     });
  //     setCSVData(parsedData);
  //     setIsLoading(false);
  //   };
  //   fileReader.readAsArrayBuffer(file);
  // };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setIsLoading(true);
    const extension = file.name.split(".").pop().toLowerCase();
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      if (extension === "csv") {
        processCSV(data);
      } else if (extension === "docx") {
        processDOCX(data);
      }
    };
    fileReader.readAsArrayBuffer(file);
  };
  const processCSV = (data) => {
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
  // const processDOCX = async (arrayBuffer) => {
  //   try {
  //     const { value } = await mammoth.convertToHtml({ arrayBuffer });
  //     const lines = value.split(/(?<=[.,])/g).map((line) => line.trim());
  //     setCSVData(lines.filter((line) => line.length > 0).map((line) => [line]));
  //     console.log(lines);
  //     setIsLoading(false);
  //   } catch (error) {
  //     console.error("Error processing DOCX file:", error);
  //     setIsLoading(false);
  //   }
  // };
  const processDOCX = async (arrayBuffer) => {
    try {
      const { value } = await mammoth.convertToHtml({ arrayBuffer });
      const parser = new DOMParser();
      const doc = parser.parseFromString(value, "text/html");
      const lines = Array.from(doc.querySelectorAll("p, br")).map((node) =>
        node.innerHTML.trim()
      );
      const sentences = lines.flatMap((line) =>
        line
          .split(".")
          .map((sentence) => sentence.trim())
          .filter(Boolean)
          .map((sentence, index, arr) =>
            index === arr.length - 1 && sentence !== line
              ? sentence
              : sentence + "."
          )
      );
      setCSVData(sentences.map((sentence) => [sentence]));
      setIsLoading(false);
      return sentences;
    } catch (error) {
      console.error("Error processing DOCX file:", error);
      setIsLoading(false);
      return [];
    }
  };
  // const processDOCX = async (arrayBuffer) => {
  //   try {
  //     const { value } = await mammoth.convertToHtml({ arrayBuffer });
  //     const container = document.createElement("div");
  //     container.innerHTML = value;
  //     const paragraphs = container.querySelectorAll("p");
  //     const content = Array.from(paragraphs).flatMap((p) => {
  //       const html = p.innerHTML;
  //       const lines = html.split(/(?<=[.,])/g).map((line) => line.trim());
  //       return lines.filter((line) => line.length > 0);
  //     });
  //     setCSVData(content.map((line) => [line]));
  //     setIsLoading(false);
  //   } catch (error) {
  //     console.error("Error processing DOCX file:", error);
  //     setIsLoading(false);
  //   }
  // };

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
        .filter((node) => node.getAttribute("xml:lang") !== "EN-US")
        .map((node) => node.querySelector("seg").textContent);
      setFTData(knTranslations);
      setIsLoading(false);
    };
    reader.readAsText(file, "ISO-8859-1");
  };
  const handleFileUploadTcxBT = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(content, "text/xml");
      const tuvNodes = xmlDoc.getElementsByTagName("tuv");
      const englishTranslations = Array.from(tuvNodes)
        .filter((node) => node.getAttribute("xml:lang") !== "EN-US")
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
    link.setAttribute("download", "front_translation_data.csv");
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
  const handleFileUploadQCSource = (event) => {
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
  const handleFileUploadQCSource2 = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      const filteredData = jsonData.slice(1);
      setEnglishBT(filteredData);
    };
    reader.readAsArrayBuffer(file);
  };
  const handleCommentChange = (index, event) => {
    const newComments = [...comments];
    newComments[index] = event.target.value;
    setComments(newComments);
  };
  const handleDownloadQC = async () => {
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
  // const handleSaveComment = (index) => {
  //   console.log("Comment saved:", comments[index]);
  // };

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
  const handlehide = () => {
    sethideTmxColumn((prevState) => !prevState);
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
  // useEffect(() => {
  //   console.log("saved data", savedData);
  // }, [savedData]);

  const contextValue = {
    isQCSelected,
    isLoading,
    uploadedData,
    csvData,
    tcxData,
    editableData,
    ftData,
    savedData,
    downloadReady,
    dataTrue,
    hideTmxColumn,
    englishSource,
    englishBT,
    comments,
    handleFileUploadTcxBT,
    setIsQCSelected,
    setIsLoading,
    setUploadedData,
    setCSVData,
    setTcxData,
    setEditableData,
    setFTData,
    setSavedData,
    setDownloadReady,
    setDataTrue,
    sethideTmxColumn,
    handleQCClick,
    handleSourceClick,
    handleFileUploadQC,
    handleFileUpload,
    handleFileUploadTcx,
    compareAndSetFT,
    handleSave,
    handleDownloadCSV,
    handleEditorChange,
    handlehide,
    handleFileUploadQCSource,
    handleFileUploadQCSource2,
    handleCommentChange,
    handleDownloadQC,
  };

  return (
    <FunctionContext.Provider value={contextValue}>
      {children}
    </FunctionContext.Provider>
  );
};

export const useFunctionContext = () => useContext(FunctionContext);
