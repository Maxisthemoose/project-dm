import React, { useState } from "react";
import { Link } from "react-router-dom";
import login from "../../api/login";
import { useIsAuthenticated, useSignIn } from "react-auth-kit";
import { createTheme } from "@mui/material/styles";
import { Box, Container, ThemeProvider } from "@mui/system";
import Alert from "@mui/material/Alert";
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

import "./Login.css";

const theme = createTheme();

export default function Login() {
  const signIn = useSignIn();

  const isAuthenticated = useIsAuthenticated();

  const [error, setError] = useState("");

  if (isAuthenticated()) {
    window.location.href = "/create";
  }

  async function Login(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const form = new FormData(ev.currentTarget);
    const password = form.get("password") as string;
    const usernameOrEmail = form.get("usernameOrEmail") as string;

    const res = await login({ usernameOrEmail, password }) as any;
    const loginData = res?.data;
    if (!loginData) {
      console.log(res.response.data.message);
      setError(res.response.data.message);
      setTimeout(() => setError(""), 5000);
    } else {
      alert(JSON.stringify(loginData));
      if (signIn({
        token: loginData.accessToken,
        expiresIn: loginData.expiresIn,
        tokenType: "Bearer",
        authState: {
          username: loginData.username, email: loginData.email, id: loginData.id,
        }
      })) {
        window.location.href = "/create";
      }
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Container className="container" component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            <b>Login to your Account</b>
          </Typography>
          {
            error !== "" ?
              <div>
                <br />
                <Alert severity="error">{error}</Alert>
              </div>
              : ""
          }
          <Box component="form" noValidate={false} onSubmit={Login} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="username"
                  name="usernameOrEmail"
                  required
                  fullWidth
                  id="usernameOrEmail"
                  label="Username or Email"
                  autoFocus
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
            </Grid>
            <br />
            <Grid item xs={12}>
              <p className="forgot">
                {"Forgot your password? "}
                <Link to="/forgot">
                  Reset it now
                </Link>
              </p>
            </Grid>
            <Button
              type="submit"
              fullWidth={false}
              variant="contained"
              style={{
                borderRadius: 25,
                backgroundColor: "#21b6ae",
                padding: "10px 50px",
                fontSize: "15px"
              }}
              sx={{ mt: 3, mb: 2 }}
            >
              Login
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item xs={12}>
                Don't have an account? <br />
                <Link to="/register">
                  Make one now
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider >
  )
}