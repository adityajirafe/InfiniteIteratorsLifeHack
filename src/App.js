import "./App.css";
// /* eslint-disable react/no-multi-comp */
import React, { useEffect, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material";
import theme from "./theme";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Page from "./components/Page";
import Header from "./components/Header";

const Login = React.lazy(() => import("./pages/auth/signin/Login"));
const SignUp = React.lazy(() => import("./pages/auth/signup/Signup"));
const Home = React.lazy(() => import("./pages/home"));
const Map = React.lazy(() => import("./pages/map"));
const Neighbours = React.lazy(() => import('./pages/neighbours'));
const Matched = React.lazy(() => import('./pages/matched'));
const Settings = React.lazy(() => import('./pages/settings/Settings'));


function App() {
  const [primary, setPrimary] = useState('');
  const [secondary, setSecondary] = useState('');
  const [address, setAddress] = useState('');

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Header />
        <React.Suspense>
          <Routes>
            <Route
              exact={true}
              path="/"
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
              path="/neighbours"
              element={<Page component={<Neighbours />} title="Neighbours" />}
            />

            <Route
              exact={true}
              path="/matched"
              element={<Page component={<Matched />} title="Matched" />}
            />
            <Route
              exact={true}
              path="/settings"
              element={<Page component={<Settings primary={primary} setPrimary={setPrimary} secondary={secondary} setSecondary={setSecondary} address={address} setAddress={setAddress} />} title="Settings" />}
            />
          </Routes>
        </React.Suspense>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
