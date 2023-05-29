import "./App.css";
// /* eslint-disable react/no-multi-comp */
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Page from "./components/Page";

const Login = React.lazy(() => import('./pages/auth/signin/Login'));
const SignUp = React.lazy(() => import('./pages/auth/signup/Signup'));
const Home = React.lazy(() => import('./pages/home'));
const Neighbours = React.lazy(() => import('./pages/neighbours'));
const Matched = React.lazy(() => import('./pages/matched'));

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

          <Route
            exact={true}
            path='/neighbours'
            element={<Page component={<Neighbours />} title='Neighbours page' />}
          />

          <Route
            exact={true}
            path='/matched'
            element={<Page component={<Matched />} title='My rides page' />}
          />
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  );
}

export default App;
