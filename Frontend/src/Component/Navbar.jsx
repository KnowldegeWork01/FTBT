import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, makeStyles } from "@material-ui/core";
import { Link, useLocation } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
  },
}));

const Navbar = () => {
  const classes = useStyles();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const department = localStorage.getItem("department");
    if (token && department) {
      setIsLoggedIn(true); 
    } else {
      setIsLoggedIn(false);
    }
  }, [location.pathname]); 

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("department");
    setIsLoggedIn(false);
  };
  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography className={classes.title}>{/* LOGO */}</Typography>
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
    </AppBar>
  );
};

export default Navbar;
