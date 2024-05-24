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
          height={80}
          width={80}
          color="#4fa94d"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
          ariaLabel="oval-loading"
          secondaryColor="#4fa94d"
          strokeWidth={2}
          strokeWidthSecondary={2}
        />
      </div>
    </div>
  );
}

export default Loading;
