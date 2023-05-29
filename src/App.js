import "./App.css";
// /* eslint-disable react/no-multi-comp */
import React from "react";
import { ThemeProvider } from "@mui/material";
import theme from "./theme";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Page from "./components/Page";
import Header from "./components/Header";

const Login = React.lazy(() => import("./pages/auth/signin/Login"));
const SignUp = React.lazy(() => import("./pages/auth/signup/Signup"));
const Home = React.lazy(() => import("./pages/home"));
const Map = React.lazy(() => import("./pages/map"));

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Header />
        <React.Suspense>
          <Routes>
            <Route
              exact={true}
              path="/login"
              element={
                <Page component={<Login />} title="Login Infinite Iterators" />
              }
            />
            <Route
              exact={true}
              path="/signup"
              element={
                <Page
                  component={<SignUp />}
                  title="Signup Infinite Iterators"
                />
              }
            />
            <Route
              exact={true}
              path="/home"
              element={<Page component={<Home />} title="Home page" />}
            />
            <Route
              exact={true}
              path="/map"
              element={<Page component={<Map />} title="Map" />}
            />
          </Routes>
        </React.Suspense>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
