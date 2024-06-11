import React, { useState } from "react";
import * as XLSX from "xlsx";
import mammoth from "mammoth";

const FileUploader = () => {
  const [htmlContent, setHtmlContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
    setHtmlContent(parsedData.map((row) => row.join(", ")).join("<br/>"));
    setIsLoading(false);
  };

  const processDOCX = async (arrayBuffer) => {
    try {
      const { value } = await mammoth.convertToHtml({ arrayBuffer });
      const lines = value.split(/(?<=\.)\s+/);
      setHtmlContent(lines.join("<br/>"));
      setIsLoading(false);
    } catch (error) {
      console.error("Error processing DOCX file:", error);
      setIsLoading(false);
    }
  };

  return (
    <div>
      <input type="file" accept=".csv, .docx" onChange={handleFileUpload} />
      {isLoading && <p>Loading...</p>}
      {htmlContent && <div dangerouslySetInnerHTML={{ __html: htmlContent }} />}
    </div>
  );
};

export default FileUploader;
