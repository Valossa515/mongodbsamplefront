"use client";
import React, { useEffect, useState } from 'react';
import { TextField, Button, Container, Typography, Box, Paper } from '@mui/material';
import clienteservice from '@/app/services/clienteService';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import useHttp from './Hooks/useHttp';

const LoginPage: React.FC = () => {
  const { request } = useHttp();
  const clienteServiceInstance = clienteservice(request);
  const [error] = useState<string | null>(null);

  const validationSchema = Yup.object({
    email: Yup.string().email('Email inválido').required('Email é obrigatório'),
    password: Yup.string().required('Password é obrigatório'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const response = await clienteServiceInstance.login(values.email, values.password);

        // Ajuste para pegar o token diretamente da resposta
        if (response && response.Result.Token) {
          localStorage.setItem("authToken", response.Result.Token);
          window.location.href = "/"; // Redireciona para a página inicial após o login
        } else {
          setErrors({ password: "Login falhou. Verifique seu email e senha." });
        }
      } catch (error) {
        console.error("Erro ao fazer login:", error);
        setErrors({ password: "Ocorreu um erro. Por favor, tente novamente." });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const checkTokenValidity = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('Token não encontrado no localStorage');
      return false;
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('Formato de token inválido');
      return false;
    }

    try {
      const tokenPayload = JSON.parse(atob(parts[1]));
      const isTokenExpired = tokenPayload.exp < Date.now() / 1000;
      return !isTokenExpired;
    } catch (error) {
      console.error('Erro ao decodificar o token:', error);
      return false;
    }
  };

  useEffect(() => {
    const isValid = checkTokenValidity();
    if (isValid) {
      window.location.href = '/home'; // Redireciona se o token for válido
    }
  }, []);

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

          <form onSubmit={formik.handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
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
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
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
              disabled={formik.isSubmitting}
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
          </form>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;
