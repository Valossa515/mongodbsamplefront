"use client";

import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Container, Typography, Box, FormHelperText } from '@mui/material';
import clienteservice from '@/app/services/clienteService';

const Login: React.FC = () => {

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

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: 8,
        }}
      >
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <Box
          component="form"
          noValidate
          sx={{ mt: 1 }}
          onSubmit={formik.handleSubmit}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            name="email"
            label="Email"
            autoComplete="email"
            autoFocus
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
          />
          {formik.touched.email && formik.errors.email && (
            <FormHelperText error>{formik.errors.email}</FormHelperText>
          )}

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
          />
          {formik.touched.password && formik.errors.password && (
            <FormHelperText error>{formik.errors.password}</FormHelperText>
          )}

          {formik.errors.password && !formik.touched.password && (
            <FormHelperText error>{formik.errors.password}</FormHelperText>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={formik.isSubmitting}
            sx={{ mt: 3, mb: 2 }}
          >
            Login
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
