import React from "react";
import { RotatingLines } from "react-loader-spinner";

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
      <div className="d-flex justify-content-center align-items-center">
        <RotatingLines
          strokeWidth="4"
          animationDuration="0.75"
          color="black"
          width="96"
          visible={true}
        />
      </div>
    </div>
  );
}

export default Loading;
