import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { useNavigate, Link } from "react-router-dom";
import { firestore, auth } from "../../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, setDoc, doc } from "firebase/firestore";
import { useGlobalContext } from "../../../context";

const validationSchema = Yup.object().shape({
  email1: Yup.string()
    .email("Please enter a valid email")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
  fullname: Yup.string().required("Full name is required"),
  contact: Yup.string().required("Contact number is required"),
});

export default function Signup() {
  const navigate = useNavigate();
  let [errorMsg, setErrorMsg] = useState("");

  const { setEmail } = useGlobalContext();
  //   const dispatch = useDispatch();
  //   const loginStatus = useSelector((state) => state?.auth?.loginStatus);

  /**
   * check if the user has already logged in,
   * if so then navigate them to dashboard
   */
  //   React.useEffect(() => {
  //     if (loginStatus === LOGGED_IN) {
  //       navigate('/');
  //     }
  //   });

  /**
   * A function to handle the user submiting their credentials.
   * If valid and 2fa is enabled, navigate them to the otp page.
   * If valid and 2fa is not enabled, navigate them to the dashboard.
   * If not valid then set the error status.
   *
   * @param {Object} values - The values from the form
   * @param {setStatus, setSubmitting} formikHelpers - helpers that formik provides
   */
  const onSubmit = async (values, { setStatus, setSubmitting }) => {
    setStatus();
    const username = values.email1;
    const fullname = values.fullname;
    const contact = values.contact;
    const address = "";
    const township = "";
    const { password } = values;
    const hoppers = [""];
    const requests = [""];

    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        username,
        password
      );

      const db = firestore;
      const usersCollectionRef = collection(db, "users");

      const user = {
        fullname: fullname,
        email: username,
        contact: contact,
        address: address,
        hoppers: hoppers,
        requests: requests,
        township: township,
      };

      const customDocumentId = username;
      const userDocRef = doc(usersCollectionRef, customDocumentId);
      await setDoc(userDocRef, user);

      if (response) {
        //console.log(response.user);
        /*console.log(auth.currentUser.email); */
        setEmail(username);
        navigate("/home");
      } else throw new Error("Signup Failed");
    } catch (error) {
      console.log(error);

      switch (error.code) {
        case "auth/invalid-email":
          setErrorMsg("Invalid Email");
          break;
        case "auth/email-already-in-use":
          setErrorMsg("Email is already in use");
          break;
        case "auth/weak-password":
          setErrorMsg("Please choose a stronger password");
          break;
        case "auth/missing-email":
          setErrorMsg("Please enter a email");
          break;
        case "auth/missing-password":
          setErrorMsg("Please enter a password");
          break;
        default:
          setErrorMsg("Error Occured. Please try again later");
          break;
      }
    }
    setSubmitting(false);
  };

  return (
    <Box
      display="flex"
      width="100%"
      height="100vh"
      justifyContent="center"
      alignItems="center"
      sx={{
        backgroundColor: (theme) => theme.palette.background.secondary,
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        gap="32px"
      >
        <Typography variant="h2">Sign Up</Typography>
        <Formik
          initialValues={{
            email1: "",
            password: "",
            contact: "",
            fullname: "",
          }}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({
            errors,
            touched,
            isValid,
            dirty,
            handleSubmit,
            isSubmitting,
            status,
          }) => (
            <Form
              style={{
                display: "flex",
                alignItems: "flex-start",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <Field name="email1">
                {({ field }) => (
                  <TextField
                    {...field}
                    variant="filled"
                    placeholder="Email address"
                    autoComplete="off"
                    error={
                      touched.email1 &&
                      (typeof errors.email1 !== "undefined" ||
                        typeof status !== "undefined")
                    }
                    sx={{
                      width: "296px",
                    }}
                  />
                )}
              </Field>
              <ErrorMessage name="email1" data-testid="emailError">
                {(msg) => (
                  <Typography
                    variant="caption1"
                    sx={{ color: (theme) => theme.palette.error.main }}
                  >
                    {msg}
                  </Typography>
                )}
              </ErrorMessage>

              <Field name="fullname">
                {({ field }) => (
                  <TextField
                    {...field}
                    variant="filled"
                    placeholder="Full name"
                    autoComplete="off"
                    error={
                      touched.fullname &&
                      (typeof errors.fullname !== "undefined" ||
                        typeof status !== "undefined")
                    }
                    sx={{
                      width: "296px",
                    }}
                  />
                )}
              </Field>
              <ErrorMessage name="fullname" data-testid="fullnameError">
                {(msg) => (
                  <Typography
                    variant="caption1"
                    sx={{ color: (theme) => theme.palette.error.main }}
                  >
                    {msg}
                  </Typography>
                )}
              </ErrorMessage>

              <Field name="contact">
                {({ field }) => (
                  <TextField
                    {...field}
                    variant="filled"
                    placeholder="Contact Number"
                    autoComplete="off"
                    error={
                      touched.contact &&
                      (typeof errors.name !== "undefined" ||
                        typeof status !== "undefined")
                    }
                    sx={{
                      width: "296px",
                    }}
                  />
                )}
              </Field>
              <ErrorMessage name="contact" data-testid="contactError">
                {(msg) => (
                  <Typography
                    variant="caption1"
                    sx={{ color: (theme) => theme.palette.error.main }}
                  >
                    {msg}
                  </Typography>
                )}
              </ErrorMessage>

              <Field name="password">
                {({ field }) => (
                  <TextField
                    {...field}
                    variant="filled"
                    placeholder="Password"
                    error={
                      touched.password &&
                      (typeof errors.password !== "undefined" ||
                        typeof status !== "undefined")
                    }
                    type="password"
                    sx={{
                      width: "296px",
                    }}
                  />
                )}
              </Field>
              <ErrorMessage name="password">
                {(msg) => (
                  <Typography
                    variant="caption1"
                    sx={{ color: (theme) => theme.palette.error.main }}
                  >
                    {msg}
                  </Typography>
                )}
              </ErrorMessage>
              {status && isValid && dirty && (
                <Typography
                  variant="caption1"
                  sx={{ color: (theme) => theme.palette.error.main }}
                >
                  {status}
                </Typography>
              )}
              <Button
                variant="contained"
                type="submit"
                disabled={!(isValid && dirty)}
                onClick={handleSubmit}
                sx={{
                  height: "48px",
                  width: "100%",
                }}
              >
                <Typography variant="button1">Sign up</Typography>
                {isSubmitting && (
                  <Box
                    sx={{
                      ml: "13px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <CircularProgress
                      size={14}
                      thickness={10}
                      sx={{
                        color: "#FCFCFC",
                      }}
                    />
                  </Box>
                )}
              </Button>
            </Form>
          )}
        </Formik>
        <Typography
          variant="body2Semibold"
          sx={{ color: (theme) => theme.palette.error.main }}
        >
          {errorMsg}
        </Typography>
        <Box display="flex" gap="4px" width="100%">
          <Typography
            variant="body2Semibold"
            sx={{ color: (theme) => theme.palette.text.secondary }}
          >
            Already have an account
          </Typography>
          <Typography variant="body2Semibold" component={Link} to="/login">
            Sign in
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
