import { Route, Routes } from "react-router-dom";
import BT from "./Component/BT";
import FT from "./Component/FT";
import Login from "./Component/Login";
import Navbar from "./Component/Navbar";
import QC from "./Component/QC";
import "./App.css";
import Project from "./Component/Project";
import { FunctionProvider } from "./Component/Context/Function";
import Docs from "./Component/Docx";
import Loading from "./Component/Common_Component/Loader";
import PDF from "./Component/Pdf";
import Docx_IntoCells from "./Component/Docx_IntoCells"
function App() {
  return (
    <>
      <FunctionProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/FT" element={<FT />} />
          <Route path="/BT" element={<BT />} />
          <Route path="/login" element={<Login />} />
          <Route path="/QC" element={<QC />} />
          <Route path="/PM" element={<Project />} />
          <Route path="/pdf" element={<PDF />} />
          <Route path="/Docx" element={<Docs />} />
          <Route path="/loader" element={<Loading />} />
          <Route path="/docxIntoCells" element={<Docx_IntoCells />} />
        </Routes>
      </FunctionProvider>
    </>
  );
}
export default App;
