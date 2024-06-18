import React, { useState } from "react";
import mammoth from "mammoth";
import { saveAs } from "file-saver";

const XLIFFtoWordConverter = () => {
  const [xliffContent, setXliffContent] = useState("");
  const [error, setError] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      setXliffContent(content);
    };
    reader.readAsText(file);
  };
  // const convertToWord = () => {
  //   const parser = new DOMParser();
  //   const xmlDoc = parser.parseFromString(xliffContent, "application/xml");
  //   const targetTags = xmlDoc.getElementsByTagName("target");
  //   let targetContent = "";
  //   Array.from(targetTags).forEach((tag) => {
  //     const text = tag.textContent.trim();
  //     targetContent += `<target>${text}</target>\n`; // Wrap each target content with <target></target> and add newline
  //   });
  //   const htmlContent = `
  //       <!DOCTYPE html>
  //       <html lang="en">
  //       <head>
  //         <meta charset="UTF-8">
  //         <style>
  //           body {
  //         font-family: Arial, sans-serif;
  //         margin: 2cm;
  //       }
  //           p {
  //             margin-bottom: 0.5cm;
  //           }
  //         </style>
  //       </head>
  //       <body>
  //         <p>${targetContent}</p>
  //       </body>
  //       </html>
  //     `;
  //   const blob = new Blob([htmlContent], { type: "application/msword" });
  //   const url = window.URL.createObjectURL(blob);
  //   const a = document.createElement("a");
  //   a.href = url;
  //   a.download = "converted_document.doc";
  //   a.click();
  //   window.URL.revokeObjectURL(url);
  // };

  const convertToWord = () => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xliffContent, "application/xml");
    const targetTags = xmlDoc.getElementsByTagName("target");
    let targetContent = "";
    Array.from(targetTags).forEach((tag) => {
      const text = tag.textContent.trim();
      targetContent += `<target>${text}</target><br />\n`;
    });
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
    </head>
    <body>
      ${targetContent}
    </body>
    </html>
  `;
    const blob = new Blob([htmlContent], { type: "application/msword" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "converted_document.doc";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({
        arrayBuffer,
        styleMap: [
          "b => strong",
          "i => em",
          "u => u",
          "p[style-name='Heading 1'] => h1",
          "p[style-name='Heading 2'] => h2",
          "p[style-name='Heading 3'] => h3",
        ],
      });
      const html = result.value;
      const xliff = convertToXLIFF(html);
      setXliffContent(xliff);
      setError(null);
    } catch (error) {
      console.error("Error processing document:", error);
      setError(`Error processing document: ${error.message}`);
    }
  };
  const convertToXLIFF = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const body = doc.body;
    let xliff = `<?xml version="1.0" encoding="utf-8"?>\n`;
    xliff += `<xliff version="1.2">\n`;
    xliff += `  <file source-language="en-US" target-language="en-US" datatype="html">\n`;
    xliff += `    <body>\n`;
    const traverseNode = (node, index) => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent.trim();
      }
      if (node.nodeType === Node.ELEMENT_NODE) {
        const tag = node.tagName.toLowerCase();
        const style = node.getAttribute("style") || "";
        const content = Array.from(node.childNodes)
          .map((child, idx) => traverseNode(child, `${index}-${idx}`))
          .join("");
        const styleAttribute = style ? ` style="${style}"` : "";
        if (tag === "strong" || tag === "b") {
          return ` <strong${styleAttribute}>${content}</strong>`;
        } else if (tag === "em" || tag === "i") {
          return ` <em${styleAttribute}>${content}</em> `;
        } else if (tag === "u") {
          return `<u${styleAttribute}>${content}</u>`;
        } else if (tag === "p") {
          const alignment = node.style.textAlign;
          const alignmentAttribute = alignment ? ` align="${alignment}"` : "";
          return `<p${styleAttribute}${alignmentAttribute}>${content}</p>`;
        } else {
          return `<${tag}${styleAttribute}>${content}</${tag}>`;
        }
      }
      return "";
    };
    Array.from(body.childNodes).forEach((node, index) => {
      const lineHtml = traverseNode(node, index).trim();
      if (lineHtml) {
        xliff += `      <trans-unit id="${index + 1}">\n`;
        xliff += `        <source><![CDATA[${lineHtml}]]></source>\n`;
        xliff += `        <target><![CDATA[${lineHtml}]]></target>\n`;
        xliff += `      </trans-unit>\n`;
      }
    });
    xliff += `    </body>\n`;
    xliff += `  </file>\n`;
    xliff += `</xliff>`;
    return xliff;
  };
  const downloadXLIFF = () => {
    const blob = new Blob([xliffContent], { type: "application/xliff+xml" });
    saveAs(blob, "document.xliff");
  };
  return (
    <div style={{}}>
      <div style={{}}>
        <h1>Word to XLIFF Converter</h1>
        <input type="file" accept=".docx" onChange={handleFileChange} />
        {error && <div style={{ color: "red" }}>{error}</div>}
        {xliffContent && (
          <div>
            <button onClick={downloadXLIFF}>Download XLIFF</button>
            <pre>{xliffContent}</pre>
          </div>
        )}
      </div>
      <div style={{}}>
        <h1>Xliff to Word Converter</h1>
        <input type="file" accept=".xliff" onChange={handleFileUpload} />
        <button onClick={convertToWord}>Convert to Word</button>
      </div>
    </div>
  );
};

export default XLIFFtoWordConverter;
