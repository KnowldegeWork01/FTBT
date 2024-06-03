import React from "react";
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
import DoneIcon from '@mui/icons-material/Done';
import { useFunctionContext } from "./Context/Function";
import Loader from "../Component/Common_Component/Loader";


const QC = ({ loggedInData }) => {
  const context = useFunctionContext();
  const { handleCommentChange, englishSource, englishBT, comments } = context;
  const handleSaveComment = (index) => {
    console.log("Comment saved:", comments[index]);
  };

  return (
    <div>
       <TableContainer component={Paper} style={{ maxHeight: '100vh', overflow: 'auto'}}>
        <Table aria-label="simple table">
          <TableHead style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#fff' }}>
            <TableRow>
              <TableCell>
                <b>Source</b>
              </TableCell>
              <TableCell>
                <b>BT</b>
              </TableCell>
              <TableCell>
                <b>Comment</b>
              </TableCell>
              <TableCell>
                <b>Save</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {englishSource.map((csvRow, index) => (
              <TableRow key={index}>
                <TableCell
                  style={{
                    fontSize: "1rem",
                    width: "30%",
                    padding: "1.5rem",
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
                  }}
                >
                  {englishBT[index]}
                </TableCell>
                <TableCell>
                  <textarea
                    variant="outlined"
                    style={{ width: "90%", resize: "none", fontSize: "1rem" }}
                    multiline
                    rows={4}
                    value={comments[index] || ""}
                    onChange={(event) => handleCommentChange(index, event)}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<DoneIcon />}
                    style={{ padding: "1rem" }}
                    onClick={() => handleSaveComment(index)}
                  >
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default QC;
