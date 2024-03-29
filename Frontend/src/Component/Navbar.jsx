import React from 'react';
import { AppBar, Toolbar, Typography, makeStyles } from '@material-ui/core';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
  },
}));

const Navbar = () => {
  const classes = useStyles();

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          {/* Your Website */}
        </Typography>
        <Typography variant="h6">
          <Link to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>LOGIN</Link>
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
