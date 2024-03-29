import { Route, Routes } from "react-router-dom";
import "./App.css";
import BT from "./Component/BT";
import FT from "./Component/FT";
import Login from "./Component/Login";
import Navbar from "./Component/Navbar";
import QC from "./Component/QC";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
         <Route path="/FT" element={<FT />} />
          <Route path="/BT" element={<BT />} />
          <Route path="/login" element={<Login />} />
          <Route path="/QC" element={<QC />} />
       </Routes>
    </>
  );
}

export default App;
