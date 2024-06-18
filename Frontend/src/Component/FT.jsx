import React from "react";
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
import { useFunctionContext } from "./Context/Function";
import ClassicEditor from "ckeditor5-build-classic-extended";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { FaRegArrowAltCircleRight } from "react-icons/fa";
import Loader from "../Component/Common_Component/Loader";
import parse from "html-react-parser";

function FT() {
  const context = useFunctionContext();
  const {
    isQCSelected,
    isLoading,
    uploadedData,
    csvData,
    tcxData,
    editableData,
    ftData,
    savedData,
    hideTmxColumn,
    setEditableData,
    compareAndSetFT,
    handlehide,
    handleSave,
    handleEditorChange,
  } = context;
  return (
    <div>
      {isLoading && (
        <div className="loader-container">
          <Loader />
        </div>
      )}
      {isQCSelected ? (
        <div>
          <TableContainer component={Paper}>
            <Table aria-label="simple table" sx={{ minWidth: 650 }}>
              <TableHead style={{ position: "fixed" }}>
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
                        width: "25%",
                      }}
                    >
                      {row.bt}
                    </TableCell>
                    <TableCell
                      style={{
                        fontSize: "1rem",
                        width: "25%",
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
          <TableHead
            style={{
              position: "fixed",
              width: "100%",
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              backgroundColor: "white",
              zIndex: 1,
              fontSize: "1.2rem",
            }}
          >
            <b>Source(English)</b>
            <span>
              <b>TMX</b>
              <Button onClick={() => handlehide()}>
                {hideTmxColumn ? <VisibilityOffIcon /> : <RemoveRedEyeIcon />}
              </Button>
            </span>
            <b>Edit </b>
            <b>FT(Front-Translation)</b>
          </TableHead>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableBody>
                {csvData.map((csvRow, index) => (
                  <TableRow key={index}>
                    <TableCell
                      style={{
                        fontSize: "1rem",
                        width: "25%",
                      }}
                    >
                      <div style={{ display: "flex" }}>
                        <div>
                          <b>({index + 1})</b>
                        </div>
                        <div style={{ marginLeft: "0.5rem" }}>
                          {parse(csvRow[0])}
                        </div>
                      </div>
                    </TableCell>
                    {csvRow.slice(1).map((cell, cellIndex) => (
                      <TableCell key={cellIndex}>{parse(cell)}</TableCell>
                    ))}
                    <TableCell
                      style={{
                        fontSize: "1rem",
                        width: "25%",
                        paddingTop: "1rem",
                        visibility: hideTmxColumn ? "hidden" : "visible",
                      }}
                    >
                      {tcxData[index]}
                    </TableCell>
                    <TableCell
                      style={{
                        width: "20%",
                        paddingTop: "3rem",
                      }}
                    >
                      <textarea
                        variant="outlined"
                        style={{
                          width: "60%",
                          padding: "1.3rem",
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
                      <FaRegArrowAltCircleRight
                        style={{
                         fontSize:"2.5rem",
                         color:"green",
                         cursor:"progress",
                        marginBottom:"2.5rem",
                        marginLeft:"0.5rem"
                        }}
                        onClick={() => handleSave(index)}
                      >
                        Save
                      </FaRegArrowAltCircleRight>
                    </TableCell>

                    <TableCell
                      style={{
                        width: "20%",
                        fontSize: "1rem",
                      }}
                    >
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
                        className="custom-editor"
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
