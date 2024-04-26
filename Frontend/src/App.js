import { Route, Routes } from "react-router-dom";
import BT from "./Component/BT";
import FT from "./Component/FT";
import Login from "./Component/Login";
import Navbar from "./Component/Navbar";
import QC from "./Component/QC";
import "./App.css";
import Project from "./Component/Project";
import Loading from "./Component/Common_Component/Loader";

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
        <Route path="/loading" element={<Loading />} />
      </Routes>
    </>
  );
}

export default App;
