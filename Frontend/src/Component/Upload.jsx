import React from "react";
import * as ExcelJS from "exceljs";

const DownloadFormattedData = () => {
  const handleDownloadCSV = async () => {
    const savedData = [
      "ಬೇರಿಂಗ್ <strong>(a)</strong>  ಮತ್ತು ತೈಲ ಸೀಲ್<strong> (b)</strong> ಅನ್ನು ಕ್ರಾಂಕ್‌ಕೇಸ್<strong> (c)</strong> ಸೈಡ್‌ನಲ್ಲಿ (ಮ್ಯಾಗ್ನೆಟೊ ಸೈಡ್) ಸ್ಥಾಪಿಸಿ.",
      "ರಾಟ್ಚೆಟ್ನೊಂದಿಗೆ 3 ಎಂಎಂ ಟಾರ್ಕ್‌ಸ್ ಸಾಕೆಟ್.",
      "<strong>3.1</strong> ಲೀಟರ್‌ಗಳು / <strong>0.82</strong> ಇಂಪೀರಿಯಲ್ ಗ್ಯಾಲನ್‌ಗಳು.",
      "ಗಿಯರ್ (2<sup>4</sup>) ಹಲ್ಲುಗಳು",
      "<i><strong>5</strong></i>ನೇ ಗಿಯರ್ (24 ಹಲ್ಲುಗಳು)",
      "H<sup>2</sup>O",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "ಸ್ಪ್ಲೈನ್ಡ್ ಥ್ರಸ್ಟ್ ವಾಶರ್ (a) ಅನ್ನು ಕೌಂಟರ್ ಶಾಫ್ಟ್ (b) ಮೆಲೆ ಹೊಂದಿಸಿ ಮತ್ತು ಅದು ಸರಿಯಾಗಿ ಸರ್ಕ್ಲಿಪ್ ವಿರುದ್ಧ ಆಸನ ಪಡೆದಿದೆಯೇ ಎಂದು ಖಚಿತಪಡಿಸಿ.",
      "",
      "ಸಂಯೋಜನೆ 394",
      "",
      "",
      "",
      "",
      "ರಾಕರ್ ಶಾಫ್ಟ್ನ ಥ್ರೆಡೆಡ್ ಭಾಗಕ್ಕೆ ಒಂದು ಹೆಕ್ಸ್ ಫ್ಲಾಂಜ್ ಬೋಲ್ಟ್ (M6) (a) ಅನ್ನು ತಿರುಗಿಸಿ.",
      "ಕ್ಲಚ್ ಪ್ಲೇಟ್‌ಗಳು/ಕ್ಲಚ್ ಹೌಸಿಂಗ್ ಹಾನಿಯಾಗಿದೆ.",
      "ಕ್ಲಚ್ ಪ್ಲೇಟ್‌ಗಳು/ಕ್ಲಚ್ ಜೋಡಣೆಯನ್ನು ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಬದಲಾಯಿಸಿ.",
      "ಕ್ಲಚ್ ಕಾರ್ಯಾಚರಣೆ ಕಷ್ಟ.",
      "ಬ್ರಾಕೆಟ್ ಗಟ್ಟಿಯಾಗಿ ಕ್ಲಚ್ ಲಿವರ್ ಚಲನೆ.",
      "ಒಳಗಿನ ಕೇಬಲ್ ಚಲನೆಯು ಹೊರಗಿನ ಕೇಬಲ್‌ನಲ್ಲಿ ಅಂಟಿಕೊಳ್ಳುತ್ತದೆ  .",
    ];

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    savedData.forEach((sentence) => {
      const row = worksheet.addRow();
      const cell = row.getCell(1);
      const textSegments = [];
      let currentSegment = { text: "", font: {} };

      const parser = new DOMParser();
      const htmlDoc = parser.parseFromString(sentence, "text/html");
      const nodes = htmlDoc.body.childNodes;

      nodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          currentSegment.text += node.textContent;
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.nodeName === "STRONG" || node.nodeName === "B") {
            currentSegment.font.bold = true;
          } else if (node.nodeName === "I") {
            currentSegment.font.italic = true;
          } else if (node.nodeName === "SUP") {
            currentSegment.font.superscript = true;
            currentSegment.text += node.textContent;
          } else if (node.nodeName === "SUB") {
            currentSegment.font.subscript = true;
            currentSegment.text += node.textContent;
          }
        }
      });

      textSegments.push(currentSegment);
      cell.value = { richText: textSegments };
    });

    // Save the workbook
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

  return <button onClick={handleDownloadCSV}>Download Formatted Data</button>;
};

export default DownloadFormattedData;

