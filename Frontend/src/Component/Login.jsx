import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Logo from "../images/signInLogo.jpeg";
import BG from "../images/bgImage.jpg";
import axios from "axios";
import FT from "./FT";
import BT from "./BT";

const defaultTheme = createTheme();

const Login = () => {
  const [inputValue, setInputValue] = useState({ email: "", password: "" });
  const [loggedIn, setLoggedIn] = useState(false);

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setInputValue((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const FTComp = async () => {
    const payload = {
      userName: inputValue?.email,
      password: inputValue?.password,
    };

    try {
      const response = await axios.post(
        "http://localhost:8000/api/authenticate",
        payload
      );

      if (response.status === 200) {
        setLoggedIn(true);
      }
    } catch (error) {
      console.log("Error fetching data:", error);
      if (error.response && error.response.status === 500) {
        alert("Invalid credentials");
      }
      return [];
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    FTComp();
  };
  if (loggedIn) {
    return inputValue.email === "FT"
      ? (window.location.href = "http://localhost:3000/FT")
      : inputValue.email === "BT"
      ? (window.location.href = "http://localhost:3000/BT")
      : inputValue.email === "QC"
      ? (window.location.href = "http://localhost:3000/QC")
      : null;
  }
  return (
    <div
      style={{
        position:"fixed",
        height:"100vh",
        display: "grid",
        gridTemplateColumns: "auto auto",
      }}
    >
      <Typography>
        <img src={BG} alt="image error" height={"100%"} width={"100%"} />
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
                <img src={Logo} alt="Image Error" />
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
                  id="email"
                  label="Userid"
                  name="email"
                  value={inputValue.email}
                  onChange={handleFieldChange}
                  autoComplete="email"
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
                  id="password"
                  autoComplete="current-password"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign In
                </Button>
                <Grid container>
                  <Grid
                    item
                    xs
                    style={{ display: "flex", justifyContent: "flex-end" }}
                  >
                    {/* <Link href="#" variant="body2">
                      Forgot password?
                    </Link> */}
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Container>
        </ThemeProvider>
      </div>
    </div>
  );
};

export default Login;
