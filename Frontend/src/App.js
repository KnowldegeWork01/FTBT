import { Route, Routes } from "react-router-dom";
import BT from "./Component/BT";
import FT from "./Component/FT";
import Login from "./Component/Login";
import Navbar from "./Component/Navbar";
import QC from "./Component/QC";
import "./App.css";
import Upload from "./Component/Upload"

function App() {
  return (
    <>
      <Navbar />
      <Routes>
  
        <Route path="/login/FT" element={<FT />} />
        <Route path="/login/BT" element={<BT />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login/QC" element={<QC />} />
        <Route path="/login/upload" element={<Upload />} />
      </Routes>
    </>
  );
}

export default App;
