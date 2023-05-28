import "./App.css";
// /* eslint-disable react/no-multi-comp */
import React from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Page from "./components/Page";

const Login = React.lazy(() => import("./pages/auth/signin/Login"));
const SignUp = React.lazy(() => import("./pages/auth/signup/Signup"));
const Home = React.lazy(() => import("./pages/home"));

function App() {
  return (
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
  );
}

export default App;
