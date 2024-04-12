import React from "react";
import ReactHTMLTableToExcel from "react-html-table-to-excel";

const Download = () => {
  const data = `
    <table id="myTable">
      <thead>
        <tr>
          <th>Column 1</th>
          <th>Column 2</th>
          <th>Column 3</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>ಬೇರಿಂಗ್ <strong>(a)</strong> ಮತ್ತು ತೈಲ ಸೀಲ್ (b) ಅನ್ನು ಕ್ರಾಂಕ್‌ಕೇಸ್ (c) ಒಳಗೆ ಲೆಫ್ಟ್ ಹ್ಯಾಂಡ್ <i><strong>(LH)</strong></i> ಸೈಡ್‌ನಲ್ಲಿ (ಮ್ಯಾಗ್ನೆಟೊ ಸೈಡ್) ಸ್ಥಾಪಿಸಿ.</td>
          <td>Value <sup>2</sup></td>
          <td>Value <sub>3</sub></td>
        </tr>
        <tr>
          <td>gdfg<sup>4</sup>gfg</td>
          <td>Value <sub>2</sub></td>
          <td>Value 6</td>
        </tr>
        <tr>
          <td>ರಾಟ್ಚೆಟ್ನೊಂದಿಗೆ <sub>4</sub> ಎಂಎಂ ಟಾರ್ಕ್ಸ್ ಸಾಕೆಟ್.</td>
          <td>Value 8</td>
          <td>Value 9</td>
        </tr>
      </tbody>
    </table>
  `;

  return (
    <div>
      <ReactHTMLTableToExcel
        id="test-table-xls-button"
        className="download-table-xls-button"
        table="myTable"
        filename="data"
        sheet="sheet1"
        buttonText="Download Excel"
      />
      <div dangerouslySetInnerHTML={{ __html: data }}></div>
    </div>
  );
};

export default Download;
