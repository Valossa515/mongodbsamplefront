"use client";

import React, { useEffect, useState } from 'react';
import { TextField, Button, Container, Typography, Box, Paper } from '@mui/material';
import clienteservice from '@/app/services/clienteService';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Função para verificar se o token existe e é válido
  const checkTokenValidity = () => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      return false;
    }

    // Exemplo de verificação básica para expiração do token (ajuste conforme o formato do seu token)
    const tokenPayload = JSON.parse(atob(token.split('.')[1]));
    const isTokenExpired = tokenPayload.exp < Date.now() / 1000;

    return !isTokenExpired;
  };

  // useEffect para verificar o token assim que o componente for montado
  useEffect(() => {
    const isValid = checkTokenValidity();
    console.log(isValid);
    if(isValid){
      window.location.href = '/home';
    }
    // if (!isValid) {
    //   // Se o token for inválido ou expirado, redirecione para a página de login
    //   window.location.href = '/';
    // } else {
    //   // Se o token for válido, redirecione para a página principal
    //   window.location.href = '/home';
    // }
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await clienteservice.login(email, password).then((response) => {
      if (response) {
        localStorage.setItem('authToken', `${response}`);
        window.location.href = '/home';
        console.log('Login successful');
      } else {
        setError('Login failed. Please check your email and password.');
      }
    });
  };

  const handleRegisterRedirect = () => {
    window.location.href = '/register';
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Paper elevation={6} sx={{ padding: 4, borderRadius: 2 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5" sx={{ marginBottom: 2 }}>
            Login
          </Typography>
          <Box
            component="form"
            noValidate
            sx={{ mt: 1 }}
            onSubmit={handleLogin}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputLabelProps={{ style: { color: '#333' } }}
              InputProps={{ style: { color: '#000' } }}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputLabelProps={{ style: { color: '#333' } }}
              InputProps={{ style: { color: '#000' } }}
              sx={{ marginBottom: 2 }}
            />
            {error && (
              <Typography color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{
                mt: 3,
                mb: 2,
                backgroundColor: '#1976d2',
                ':hover': {
                  backgroundColor: '#1565c0',
                },
              }}
            >
              Login
            </Button>
            <Button
              fullWidth
              variant="outlined"
              color="secondary"
              onClick={handleRegisterRedirect}
              sx={{
                mt: 1,
                mb: 2,
              }}
            >
              Registrar
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;
