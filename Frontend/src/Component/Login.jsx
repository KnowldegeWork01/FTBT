import React, { useEffect, useState } from "react";
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
import { useNavigate } from "react-router-dom";
import QC from "./QC";

const defaultTheme = createTheme();

const Login = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
    department: "",
  });
  const [loggedIn, setLoggedIn] = useState(false);
  const [loggedInData, setLoggedInData] = useState(null);

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setInputValue((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const FTComp = async () => {
    const payload = {
      department: inputValue?.department,
      userName: inputValue?.email,
      password: inputValue?.password,
    };
    try {
      const response = await axios.post(
        "http://localhost:8000/api/authenticate",
        payload
      );

      if (response.status === 200) {
        setLoggedInData(response);
        setLoggedIn(true);
        setLoggedInData(response);
      }
      // console.log(response);
    } catch (error) {
      console.log("Error fetching data:", error);
      if (error.response && error.response.status === 500) {
        alert("Invalid credentials");
      }
      return [];
    }
  };
  useEffect(()=>{
console.log("loggedIn",loggedIn);
  },[loggedIn])
  useEffect(() => {
    console.log("loggedInData", loggedInData);
  }, [loggedInData]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    FTComp();
  };
  if (loggedIn) {
    return loggedInData?.data?.department === "FT" ? (
      navigate("/login/FT")
    ) : loggedInData?.data?.department === "BT" ? (
      navigate("/login/BT")
    ) : loggedInData?.data?.department === "QC" ? (
      navigate("/login/QC"),
      <QC loggedInData={loggedInData} />
    ) : null;
  }
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
                  id="password"
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
