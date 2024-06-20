import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Box,
  Typography,
  Container,
  createTheme,
  ThemeProvider,
  Snackbar,
  Slide,
  IconButton,
  InputAdornment,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import MuiAlert from "@mui/material/Alert";
import Logo from "../images/signInLogo.jpeg";
import BG from "../images/bgImage.jpg";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode as jwt_decode } from "jwt-decode";

const defaultTheme = createTheme();

const Login = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
    department: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwt_decode(token);
      const department = decodedToken.department;
      localStorage.setItem("department", department);
      
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

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setInputValue((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleClickShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/api/authenticate",
        {
          email: inputValue.email,
          password: inputValue.password,
          department: inputValue.department,
        }
      );
      if (response.status === 200 && response.data.token) {
        localStorage.setItem("token", response.data.token);
        const decodedToken = jwt_decode(response.data.token);
        // Use department from decoded token
        const department = decodedToken.department;
        localStorage.setItem("department", department);

        // Use the emaail from the backend response
        localStorage.setItem("email", response.data.email);
        setOpenSuccessSnackbar(true);
        setTimeout(() => {
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
        }, 1000);
      } else {
        setErrorMessage("Invalid credentials");
        setOpenSnackbar(true);
      }
    } catch (error) {
      setErrorMessage("User Not Found...");
      setOpenSnackbar(true);
    }
  };
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };
  const handleCloseSuccessSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSuccessSnackbar(false);
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
      <div>
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
                  label="Email"
                  type="email"
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
                  type={showPassword ? "text" : "password"}
                  value={inputValue.password}
                  onChange={handleFieldChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
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
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        TransitionComponent={Slide}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
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
      <Snackbar
        open={openSuccessSnackbar}
        autoHideDuration={2000}
        onClose={handleCloseSuccessSnackbar}
        TransitionComponent={Slide}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          severity="success"
          onClose={handleCloseSuccessSnackbar}
        >
          Login Successful
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default Login;
