import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  makeStyles,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@material-ui/core";
import { Link, useLocation } from "react-router-dom";
import { useFunctionContext } from "./Context/Function";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import ChatIcon from "@mui/icons-material/Chat";
import Chat from "./Chat";

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
  },
  fileUploadContainer: {
    display: "flex",
    alignItems: "center",
  },
  fileUploadButton: {
    color: "white",
    fontSize: "1rem",
    padding: "1rem",
  },
}));

const Navbar = () => {
  const userId = "123"; // Change userId according to your logic
  const context = useFunctionContext();
  const {
    handleFileUploadQC,
    handleQCClick,
    handleFileUpload,
    handleSourceClick,
    handleFileUploadTcx,
    handleDownloadCSV,
    handleFileUploadTcxBT,
    downloadReady,
    handleFileUploadQCSource,
    handleFileUploadQCSource2,
    handleCommentChange,
    handleDownloadQC
  } = context;
  const classes = useStyles();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isFT, setIsFT] = useState(false);
  const [isBT, setIsBT] = useState(false);
  const [isQC, setIsQC] = useState(false);
  const [isPM, setIsPM] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Define handleLogout function
  const handleLogout = () => {
    localStorage.clear()
    setIsLoggedIn(false);
    setIsFT(false);
    setIsBT(false);
  };

  const handleOpenChat = () => {
    setIsChatOpen(true);
  };
  const handleCloseChat = () => {
    setIsChatOpen(false);
  };
  const userName = localStorage.getItem("userName");

  // UseEffect to set isLoggedIn, isFT, and isBT based on token and department
  useEffect(() => {
    const token = localStorage.getItem("token");
    const department = localStorage.getItem("department");
    if (token && department) {
      setIsLoggedIn(true);
      setIsFT(department === "FT");
      setIsBT(department === "BT");
      setIsQC(department === "QC");
      setIsPM(department === "PM");
    } else {
      setIsLoggedIn(false);
      setIsFT(false);
      setIsBT(false);
      setIsQC(false);
      setIsPM(false);
    }
  }, [location.pathname]);

  // Function to render file upload buttons based on user's department
  const renderFileUpload = () => {
    if (isLoggedIn) {
      return (
        <div className={classes.fileUploadContainer}>
          {isFT && (
            <>
            <Button
          className={classes.fileUploadButton}
          onClick={handleOpenChat}
          startIcon={<ChatIcon />}
        >
          Chat
        </Button>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUploadQC}
                style={{ display: "none" }}
                id="fileQC"
              />
              <label htmlFor="fileQC">
                <Button
                  className={classes.fileUploadButton}
                  component="span"
                  onClick={handleQCClick}
                  startIcon={<CloudDownloadIcon />}
                >
                  QC
                </Button>
              </label>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                style={{ display: "none" }}
                id="fileInput"
              />
              <label htmlFor="fileInput">
                <Button
                  className={classes.fileUploadButton}
                  component="span"
                  onClick={handleSourceClick}
                  startIcon={<CloudUploadIcon />}
                >
                  Source
                </Button>
              </label>
              <input
                type="file"
                accept=".tmx"
                onChange={handleFileUploadTcx}
                style={{ display: "none" }}
                id="fileInput2"
              />
              <label htmlFor="fileInput2">
                <Button
                  className={classes.fileUploadButton}
                  component="span"
                  startIcon={<CloudUploadIcon />}
                >
                  TMX
                </Button>
              </label>
              <Button
                className={classes.fileUploadButton}
                color="secondary"
                onClick={handleDownloadCSV}
                disabled={!downloadReady}
                startIcon={<CloudDownloadIcon />}
              >
                FT
              </Button>
            </>
          )}
          {isBT && (
            <>
               <Button
          className={classes.fileUploadButton}
          onClick={handleOpenChat}
          startIcon={<ChatIcon />}
        >
          Chat
        </Button>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUploadQC}
                style={{ display: "none" }}
                id="fileQC"
              />
              <label htmlFor="fileQC">
                <Button
                  className={classes.fileUploadButton}
                  component="span"
                  onClick={handleQCClick}
                  startIcon={<CloudDownloadIcon />}
                >
                  QC
                </Button>
              </label>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                style={{ display: "none" }}
                id="fileInput"
              />
              <label htmlFor="fileInput">
                <Button
                  className={classes.fileUploadButton}
                  component="span"
                  onClick={handleSourceClick}
                  startIcon={<CloudUploadIcon />}
                >
                  FT
                </Button>
              </label>
              <input
                type="file"
                accept=".tmx"
                onChange={handleFileUploadTcxBT}
                style={{ display: "none" }}
                id="fileInput2"
              />
              <label htmlFor="fileInput2">
                <Button
                  className={classes.fileUploadButton}
                  component="span"
                  startIcon={<CloudUploadIcon />}
                >
                  TMX
                </Button>
              </label>
              <Button
                className={classes.fileUploadButton}
                color="secondary"
                onClick={handleDownloadCSV}
                disabled={!downloadReady}
                startIcon={<CloudDownloadIcon />}
              >
                BT
              </Button>
            </>
          )}
          {isQC && (
            <>
            <Button
          className={classes.fileUploadButton}
          onClick={handleOpenChat}
          startIcon={<ChatIcon />}
        >
          Chat
        </Button>
        <input
          type="file"
          accept=".csv,.xlsx"
          onChange={handleFileUploadQCSource}
          style={{ display: "none" }}
          id="fileInput"
        />
        <label htmlFor="fileInput">
          <Button
            component="span"
            startIcon={<CloudUploadIcon />}
          className={classes.fileUploadButton}

          >
            (Source)
          </Button>
        </label>
        <input
          type="file"
          accept=".csv,.xlsx"
          onChange={handleFileUploadQCSource2}
          style={{ display: "none" }}
          id="fileInput2"
        />
        <label htmlFor="fileInput2">
          <Button
            component="span"
            startIcon={<CloudUploadIcon />}
          className={classes.fileUploadButton}

          >
            (BT)
          </Button>
          <Button
            onClick={handleDownloadQC}
          className={classes.fileUploadButton}
            startIcon={<CloudDownloadIcon />}
          >
            (QC)
          </Button>
        </label>
            </>
          )}
          {isPM && (
              <>
                <Button
          className={classes.fileUploadButton}
          onClick={handleOpenChat}
          startIcon={<ChatIcon />}
        >
          Chat
        </Button>
              </>
            )
          }
        </div>
      );
    }
    return null;
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography className={classes.title}>{/* LOGO */}</Typography>
        {renderFileUpload()}
        {isLoggedIn && location.pathname !== "/login" ? (
          <Typography variant="h6">
            <Link
              to="/"
              onClick={handleLogout}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Logout
            </Link>
          </Typography>
        ) : (
          <Typography variant="h6">
            <Link
              to="/login"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Login
            </Link>
          </Typography>
        )}
      </Toolbar>
      <Dialog
  open={isChatOpen}
  onClose={handleCloseChat}
  fullWidth
  maxWidth="lg" 
>
  <DialogTitle>Login_User: <b>{userName}</b></DialogTitle>
  <DialogContent style={{ overflow: "hidden" }}> 
    <Chat userId={userId} />
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseChat} color="primary">
      Close
    </Button>
  </DialogActions>
</Dialog>
    </AppBar>
  );
};

export default Navbar;
