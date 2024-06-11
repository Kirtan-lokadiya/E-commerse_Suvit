import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setSellerToken, setToken } from "../reducers/authSlice";
import { MDBBtn, MDBInput } from "mdb-react-ui-kit";
import axiosInstance from "../axiosInstance";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        E-commerce
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function SellerSignup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [image, setImage] = useState("");
  const [showSubmitButton, setShowSubmitButton] = useState(false);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };
  function success(pos) {
    var crd = pos.coords;
    setShowSubmitButton(true);
    setLatitude(crd.latitude);
    setLongitude(crd.longitude);
  }

  function errors(err) {
    alert(`ERROR(${err.code}): ${err.message}`);
  }

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then(function (result) {
          if (result.state === "granted") {
            //If granted then you can directly call your function here
            navigator.geolocation.getCurrentPosition(success, errors, options);
          } else if (result.state === "prompt") {
            //If prompt then the user will be asked to give permission
            navigator.geolocation.getCurrentPosition(success, errors, options);
          } else if (result.state === "denied") {
            alert("Location permission is compulsory");
            //If denied then you have to show instructions to enable location
          }
        });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }, []);

  function handleImageUpload(e) {
    // console.log("helo");
    let base64String;
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.onload = function () {
      base64String = reader.result.replace("data:", "").replace(/^.+,/, "");
      setImage(base64String);
    };
    reader.readAsDataURL(file);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const password = data.get("password");
    const confirmPassword = data.get("confirm");
    // console.log(confirmPassword);
    if (password !== confirmPassword) alert("Passwords are not matching");
    else {
      const sendData = {
        email: data.get("email"),
        password: data.get("password"),
        firstName: data.get("firstName"),
        lastName: data.get("lastName"),
        address: {
          street: data.get("street"),
          city: data.get("city"),
          state: data.get("state"),
          country: data.get("country"),
          zip: data.get("pincode"),
        },
        location: { type: "Point", coordinates: [longitude, latitude] },
        phone: data.get("phoneNumber"),
        photo: image,
        companyName: data.get("companyName"),
        businessRegistrationNumber: data.get("gstNumber"),
        bankName: data.get("bankName"),
        accountNumber: data.get("accountNumber"),
      };
      //   console.log(sendData);
      const res = await axiosInstance.post("/auth/sellers/signup", sendData);
      // console.log(res);
      if (res.status === 201) {
        alert("Seller created successfully");
        dispatch(setSellerToken(res.data.token, res.data.seller));
        navigate("/");
      }
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Seller Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="confirm"
                  label="Confirm-Password"
                  type="password"
                  id="confirm"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="street"
                  label="Street"
                  name="street"
                  autoComplete="street"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="city"
                  name="city"
                  required
                  fullWidth
                  id="city"
                  label="City"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="state"
                  name="state"
                  required
                  fullWidth
                  id="state"
                  label="State"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="country"
                  name="country"
                  required
                  fullWidth
                  id="country"
                  label="Country"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  autoComplete="pincode"
                  name="pincode"
                  required
                  fullWidth
                  id="pincode"
                  label="Pincode"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  autoComplete="phoneNumber"
                  name="phoneNumber"
                  required
                  fullWidth
                  id="phoneNumber"
                  label="Phone Number without country code"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  autoComplete="companyName"
                  name="companyName"
                  required
                  fullWidth
                  id="companyName"
                  label="Company Name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  autoComplete="gstNumber"
                  name="gstNumber"
                  required
                  fullWidth
                  id="gstNumber"
                  label="GST Number"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  autoComplete="bankName"
                  name="bankName"
                  required
                  fullWidth
                  id="bankName"
                  label="Bank Name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  autoComplete="accountNumber"
                  name="accountNumber"
                  required
                  fullWidth
                  id="accountNumber"
                  label="Account Number"
                />
              </Grid>
              <Grid item xs={12}>
                <MDBInput type="file" onChange={(e) => handleImageUpload(e)} />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={!showSubmitButton}
            >
              Sign Up
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}
