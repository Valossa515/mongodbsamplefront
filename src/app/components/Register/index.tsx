"use client";

import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Paper } from '@mui/material';
import clienteservice from '@/app/services/clienteService';

const Register: React.FC = () => {
  const [name, SetName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    try {
      const response = await clienteservice.register(name, email, password, confirmPassword);

      if (response && response.Sucesso) {
        window.location.href = '/';
      } else {
        setError(response?.Mensagem || 'Falha no registro. Tente novamente.');
      }
    } catch (error) {
      setError('Ocorreu um erro. Por favor, tente novamente.');
    }
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
            Registrar
          </Typography>
          <Box
            component="form"
            noValidate
            sx={{ mt: 1 }}
            onSubmit={handleRegister}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Nome"
              name="name"
              autoComplete="name"
              autoFocus
              value={name}
              onChange={(e) => SetName(e.target.value)}
              InputLabelProps={{ style: { color: '#333' } }}
              InputProps={{ style: { color: '#000' } }}
              sx={{ marginBottom: 2 }}
            />
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
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputLabelProps={{ style: { color: '#333' } }}
              InputProps={{ style: { color: '#000' } }}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirmar Password"
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
              Registrar
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
