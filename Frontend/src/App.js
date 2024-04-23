import { Route, Routes } from "react-router-dom";
import BT from "./Component/BT";
import FT from "./Component/FT";
import Login from "./Component/Login";
import Navbar from "./Component/Navbar";
import QC from "./Component/QC";
import "./App.css";
import Project from "./Component/Project";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/FT" element={<FT />} />
        <Route path="/BT" element={<BT />} />
        <Route path="/login" element={<Login />} />
        <Route path="/QC" element={<QC />} />
        <Route path="/PM" element={<Project />} />
      </Routes>
    </>
  );
}

export default App;
