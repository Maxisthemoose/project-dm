import React, { useState } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import { Link } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import signup from '../../api/signup';
import { useIsAuthenticated, useSignIn } from 'react-auth-kit';
import login from '../../api/login';

import "./Register.css";

const theme = createTheme();

export default function Register() {
  const signIn = useSignIn();

  const isAuthenticated = useIsAuthenticated();

  const [error, setError] = useState("");

  if (isAuthenticated()) {
    window.location.href = "/create";
  }

  async function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const form = new FormData(ev.currentTarget);
    const email = form.get("email") as string;
    const username = form.get("username") as string;
    const password = form.get("password") as string;
    const response = await signup({ username, email, password });
    const data = (response as any).data;

    if (data.created) {
      const res = await login({ username, email, password });
      const loginData = (res as any).data;
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
            <b>Create an Account</b>
          </Typography>
          <Box component="form" noValidate={false} onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="username"
                  name="username"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  type="email"
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
              Register
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item xs={12}>
                Already have an account?<br />
                <Link to="/">
                  Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}