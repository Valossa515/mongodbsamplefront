"use client";
import React, { useEffect, useState } from 'react';
import { TextField, Button, Container, Typography, Box, Paper, FormHelperText } from '@mui/material';
import clienteservice from '@/app/services/clienteService';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const LoginPage: React.FC = () => {

  const [error] = useState<string | null>(null);

  const validationSchema = Yup.object({
    email: Yup.string().email('Email inválido').required('Email é obrigatório'),
    password: Yup.string().required('Password é obrigatório'),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const response = await clienteservice.login(values.email, values.password);
        if (response) {
          localStorage.setItem('authToken', `${response}`);
          window.location.href = '/';
        } else {
          setErrors({ password: 'Login falhou. Verifique seu email e senha.' });
        }
      } catch (error) {
        setErrors({ password: 'Ocorreu um erro. Por favor, tente novamente.' });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const checkTokenValidity = () => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      return false;
    }

    const tokenPayload = JSON.parse(atob(token.split('.')[1]));
    const isTokenExpired = tokenPayload.exp < Date.now() / 1000;

    return !isTokenExpired;
  };

  useEffect(() => {
    const isValid = checkTokenValidity();
    if(isValid){
      window.location.href = '/home';
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

          <form onSubmit={formik.handleSubmit}
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
