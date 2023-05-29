import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useGlobalContext } from "../context";

function Header() {
  const { email, setEmail, address, setAddress, township, setTownship } =
    useGlobalContext();
  const onLogout = () => {
    setEmail("");
    setAddress("");
    setTownship("");
  };
  return (
    <AppBar
      position="static"
      sx={{
        width: "100vw",
        backgroundColor: (theme) => theme.palette.primary.main,
      }}
    >
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Infinite Carpool Iterators
        </Typography>
        <Button color="inherit" component={Link} to="/home">
          Home
        </Button>
        <Button color="inherit" component={Link} to="/neighbours">
          Neighbours
        </Button>
        <Button color="inherit" component={Link} to="/matched">
          Matched
        </Button>
        {!email ? (
          <>
            <Button color="inherit" component={Link} to="/">
              Login
            </Button>
            <Button color="inherit" component={Link} to="/signup">
              Signup
            </Button>
          </>
        ) : (
          <Button
            color="inherit"
            component={Link}
            to="/"
            onClick={onLogout}
          >
            Logout
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Header;
