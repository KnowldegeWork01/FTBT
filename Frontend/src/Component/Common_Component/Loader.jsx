import React from "react";
import CircularProgress from '@mui/material/CircularProgress';

function Loading() {
  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        padding: "20px",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        zIndex: "9999",
      }}
    >
       <CircularProgress disableShrink />
    </div>
  );
}

export default Loading;
