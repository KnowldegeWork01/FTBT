import React from "react";
import { Vortex } from "react-loader-spinner";

function Loding() {
  return (
    <div
      style={{ height: "350px", width: "100%" }}
      className="d-flex justify-content-center align-items-center"
    >
      <Vortex width="200" height="200" color="#4fa94d" />
    </div>
  );
}
export default Loding;
