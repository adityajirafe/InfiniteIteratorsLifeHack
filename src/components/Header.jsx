import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

function Header() {
  return (
    <AppBar position="static" sx={{ width: "100vw", backgroundColor: (theme) => theme.palette.primary.main  }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Infinite Carpool Iterators
        </Typography>
        <Button color="inherit" component={Link} to="/home">
          Home
        </Button>
        <Button color="inherit" component={Link} to="/requests">
          Requests
        </Button>
        <Button color="inherit" component={Link} to="/groupings">
          Groupings
        </Button>
        <Button color="inherit" component={Link} to="/map">
          Map
        </Button>
        <Button color="inherit" component={Link} to="/login">
          Login
        </Button>
        <Button color="inherit" component={Link} to="/signup">
          Signup
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
