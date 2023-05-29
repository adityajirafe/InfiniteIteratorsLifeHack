import "./App.css";
// /* eslint-disable react/no-multi-comp */
import React from "react";
import { ThemeProvider } from "@mui/material";
import theme from "./theme";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Page from "./components/Page";

const Login = React.lazy(() => import("./pages/auth/signin/Login"));
const SignUp = React.lazy(() => import("./pages/auth/signup/Signup"));
const Home = React.lazy(() => import("./pages/home"));

function App() {
  return (
    // <ThemeProvider them={theme}>
    <BrowserRouter>
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
              <Page component={<SignUp />} title="Signup Infinite Iterators" />
            }
          />
          <Route
            exact={true}
            path="/home"
            element={<Page component={<Home />} title="Home page" />}
          />
        </Routes>
      </React.Suspense>
    </BrowserRouter>
    // </ThemeProvider>
  );
}

export default App;
