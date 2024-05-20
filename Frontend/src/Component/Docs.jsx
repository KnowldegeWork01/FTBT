import React, { useState, useEffect, useRef } from "react";
import { Button, Dialog, DialogContent } from "@mui/material";
// import { pdfjs } from "pdfjs-dist/webpack";
import "./Docs.css"; // Import CSS file for styling

const Docs = () => {
  const [pdf, setPdf] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = useState(false);
  const canvasRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      const reader = new FileReader();
      reader.onload = () => {
        const pdfData = new Uint8Array(reader.result);
        loadPdf(pdfData);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const loadPdf = async (pdfData) => {
    const loadingTask = pdfjs.getDocument({ data: pdfData });
    const pdf = await loadingTask.promise;
    setPdf(pdf);
    setNumPages(pdf.numPages);
    setCurrentPage(1);
    setOpen(true);
  };

  const renderPage = async (pageNum) => {
    if (!pdf) return;

    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 1.5 });
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };

    await page.render(renderContext).promise;
  };

  useEffect(() => {
    if (pdf) {
      renderPage(currentPage);
    }
  }, [pdf, currentPage]);

  const handleNextPage = () => {
    if (currentPage < numPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setPdf(null);
    setNumPages(null);
    setCurrentPage(1);
  };

  return (
    <div>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogContent>
          <canvas ref={canvasRef}></canvas>
          {numPages && (
            <div className="pagination">
              <Button onClick={handlePrevPage} disabled={currentPage === 1}>
                Previous
              </Button>
              <span>
                Page {currentPage} of {numPages}
              </span>
              <Button
                onClick={handleNextPage}
                disabled={currentPage === numPages}
              >
                Next
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Docs;
