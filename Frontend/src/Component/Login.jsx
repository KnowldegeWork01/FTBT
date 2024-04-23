import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Logo from "../images/signInLogo.jpeg";
import BG from "../images/bgImage.jpg";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { jwtDecode as jwt_decode } from "jwt-decode"; 


const defaultTheme = createTheme();

const Login = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
    department: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setInputValue((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/api/authenticate",
        {
          userName: inputValue.email,
          password: inputValue.password,
          department: inputValue.department,
        }
      );
      if (response.status === 200 && response.data.token) {
        localStorage.setItem("token", response.data.token);
        const decodedToken = jwt_decode(response.data.token); // Decode the token
        const department = decodedToken.department; // Extract department from the decoded token
        localStorage.setItem("department", department); // Save department to local storage
        switch (department) {
          case "FT":
            navigate("/FT");
            break;
          case "BT":
            navigate("/BT");
            break;
          case "QC":
            navigate("/QC");
            break;
          case "PM":
            navigate("/PM");
            break;
          default:
            navigate("/");
        }
      } else {
        setErrorMessage("Invalid credentials");
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setErrorMessage("Invalid credentials");
      setOpenSnackbar(true);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwt_decode(token); 
      const department = decodedToken.department; 
      switch (department) {
        case "FT":
          navigate("/FT");
          break;
        case "BT":
          navigate("/BT");
          break;
        case "QC":
          navigate("/QC");
          break;
        case "PM":
          navigate("/PM");
          break;
        default:
          navigate("/");
      }
    }
  }, [navigate]);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <div
      style={{
        position: "fixed",
        height: "100vh",
        display: "grid",
        gridTemplateColumns: "auto auto",
      }}
    >
      <Typography>
        <img src={BG} alt="background" height={"100%"} width={"100%"} />
      </Typography>
      <div style={{}}>
        <ThemeProvider theme={defaultTheme}>
          <Container component="main" maxWidth="xs">
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: "5rem",
              }}
            >
              <Typography>
                <img src={Logo} alt="logo" />
              </Typography>
              <Typography component="h1" variant="h5">
                Sign in
              </Typography>
              <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ mt: 1 }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="department"
                  label="Department"
                  name="department"
                  value={inputValue.department}
                  onChange={handleFieldChange}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Userid"
                  name="email"
                  value={inputValue.email}
                  onChange={handleFieldChange}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  value={inputValue.password}
                  onChange={handleFieldChange}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign In
                </Button>
              </Box>
            </Box>
          </Container>
        </ThemeProvider>
      </div>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        style={{marginTop:"3rem"}}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          severity="error"
          onClose={handleCloseSnackbar}
        >
          {errorMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default Login;
