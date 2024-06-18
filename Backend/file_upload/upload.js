const multer = require("multer");
const path = require("path");

const storage = multer.memoryStorage(); // Correctly call memoryStorage as a function

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "text/csv" ||
    file.mimetype === "text/tmx" ||
    file.mimetype === "application/xml"
  ) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type, only CSV and TMX files are allowed!"),
      false
    );
  }
};

// Set up multer middleware
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

module.exports = upload;
