import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {Container, Box, Typography, TextField, Button, Grid, Radio, RadioGroup, FormControlLabel, FormControl,FormLabel, CircularProgress, Snackbar, MenuItem} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { userRegistration, userLogin } from "../backend/services/userService";

/**
 * Handles both user registration and login processes. It dynamically switches
 * between the login and registration forms based on user interaction. This component
 * utilizes react-hook-form for form management and validation.
 */

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);// Tracks whether the current mode is registration or login.
  const [loading, setLoading] = useState(false);// Controls the display of the loading indicator during API calls.
  const [openSnackbar, setOpenSnackbar] = useState(false);// Controls the visibility of the snackbar for notifications.
  const [snackbarMessage, setSnackbarMessage] = useState("");// Holds the message to be displayed in the snackbar.
  const {register, handleSubmit, formState: { errors }, reset, watch,} = useForm();

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const onSubmit = async (data) => {
    /**
 * Handles form submission for both registration and login. It performs an API call
 * and navigates based on the user type. Errors are caught and displayed in a snackbar.
 */
    console.log("Form Submitted", data);
    setLoading(true);
    try {
      if (isRegistering) {
        const registrationResponse = await userRegistration(data);
        login(registrationResponse.token, registrationResponse.user);
        setSnackbarMessage("Registration successful.");
        setOpenSnackbar(true);
        //if user registered is a client navigate to energy requirement page and supplier page otherwise
        navigate(registrationResponse.user.userType === "supplier" ? "/Supplier" : "/EnergyRequirement");
      } else {
        const loginResponse = await userLogin(data);
        login(loginResponse.token, loginResponse.user);
        navigate(loginResponse.user.user_type === "client" ? "/User" : "/Supplier");
      }
    } catch (error) {
      setSnackbarMessage(error.message || "An error occurred.");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
      reset();
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          {isRegistering ? "Register" : "Login"}
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
  {isRegistering && (
    <>
      <TextField
        margin="normal"
        required
        fullWidth
        label="First Name"
        {...register("firstName", { required: "First Name is required" })}
        error={!!errors.firstName}
        helperText={errors.firstName?.message}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        label="Last Name"
        {...register("lastName", { required: "Last Name is required" })}
        error={!!errors.lastName}
        helperText={errors.lastName?.message}
      />
    </>
  )}
  <TextField
    margin="normal"
    required
    fullWidth
    label="Email Address"
    {...register("username", {
      required: "Email is required",
      //validate email is right format using regex
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
        message: "Invalid email address",
      },
    })}
    error={!!errors.username}
    helperText={errors.username?.message}
  />
  <TextField
    margin="normal"
    required
    fullWidth
    label="Password"
    type="password"
    {...register("password", {
      required: "Password is required",
      minLength: {
        value: 8,
        message: "Password must be at least 8 characters",
      },
    })}
    error={!!errors.password}
    helperText={errors.password?.message}
  />
  {isRegistering && (
    <>
      <TextField
        margin="normal"
        required
        fullWidth
        label="Confirm Password"
        type="password"
        {...register("confirmPassword", {
          validate: value => value === watch("password") || "Passwords do not match",
        })}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword?.message}
      />
      <TextField
      select
      label="User Type"
      fullWidth
      margin="normal"
      {...register("userType", { required: "User Type is required" })}
      error={!!errors.userType}
      helperText={errors.userType?.message}
    >
      <MenuItem value="client">Client</MenuItem>
      <MenuItem value="supplier">Supplier</MenuItem>
    </TextField>

    </>
  )}
  <Button
    type="submit"
    fullWidth
    variant="contained"
    sx={{ mt: 3, mb: 2 }}
    disabled={loading}
  >
    {loading ? <CircularProgress size={24} /> : isRegistering ? "Register" : "Login"}
  </Button>
  <Grid container justifyContent="flex-end">
    <Grid item>
      <Button onClick={() => setIsRegistering(!isRegistering)}>
        {isRegistering ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
      </Button>
    </Grid>
  </Grid>
</Box>

      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Container>
   );
  }
  
  export default Login;
  
