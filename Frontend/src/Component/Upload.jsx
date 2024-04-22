import React from "react";
import ExcelJS from "exceljs";

const ExcelDownloadComponent = () => {
  const savedData = [
    "H<i><strong>2</strong></i>O"
  ];

  const handleDownloadExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    savedData.forEach((sentence) => {
      const row = worksheet.addRow();
      const cell = row.getCell(1);
      const textSegments = [];
      let currentSegment = { text: "", font: {} };
      let insideStrong = false;
      let insideItalic = false;

      for (let i = 0; i < sentence.length; i++) {
        if (sentence[i] === "<") {
          const endIndex = sentence.indexOf(">", i);
          const tagName = sentence.substring(i + 1, endIndex);
          if (tagName === "strong" || tagName === "b") {
            insideStrong = true;
          } else if (tagName === "i") {
            insideItalic = true;
          }
          i = endIndex; // Skip to end of tag
        } else if (sentence[i] === "/") {
          const endIndex = sentence.indexOf(">", i);
          const tagName = sentence.substring(i + 2, endIndex);
          if (tagName === "strong" || tagName === "b") {
            insideStrong = false;
          } else if (tagName === "i") {
            insideItalic = false;
          }
          i = endIndex; // Skip to end of tag
        } else {
          if (insideStrong && insideItalic) {
            currentSegment.font.bold = true;
            currentSegment.font.italic = true;
          } else if (insideStrong) {
            currentSegment.font.bold = true;
          } else if (insideItalic) {
            currentSegment.font.italic = true;
          }
          currentSegment.text += sentence[i];
        }
      }

      if (currentSegment.text) {
        textSegments.push(currentSegment);
      }
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

  return (
    <div>
      <button onClick={handleDownloadExcel}>Download Excel</button>
    </div>
  );
};

export default ExcelDownloadComponent;
 