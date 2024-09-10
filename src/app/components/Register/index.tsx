"use client";
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Container, Typography, Box, Paper } from '@mui/material';
import clienteservice from '@/app/services/clienteService';

const Register: React.FC = () => {
  const validationSchema = Yup.object({
    name: Yup.string().required('Nome é obrigatório'),
    email: Yup.string().email('Email inválido').required('Email é obrigatório'),
    password: Yup.string().required('Password é obrigatório').min(6, 'Password deve ter pelo menos 6 caracteres'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'As senhas não coincidem')
      .required('Confirmação de senha é obrigatória'),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const response = await clienteservice.register(
          values.name,
          values.email,
          values.password,
          values.confirmPassword
        );

        if (response && response.Sucesso) {
          window.location.href = '/';
        } else {
          setErrors({ email: response?.Mensagem || 'Falha no registro. Tente novamente.' });
        }
      } catch (error) {
        setErrors({ email: 'Ocorreu um erro. Por favor, tente novamente.' });
      } finally {
        setSubmitting(false);
      }
    },
  });

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
          <form onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              id="name"
              name="name"
              label="Nome"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              fullWidth
              id="email"
              name="email"
              label="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              fullWidth
              id="password"
              name="password"
              label="Password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              fullWidth
              id="confirmPassword"
              name="confirmPassword"
              label="Confirmar Password"
              type="password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
              helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
              sx={{ marginBottom: 2 }}
            />
            {formik.errors.email && (
              <Typography color="error" sx={{ mt: 2 }}>
                {formik.errors.email}
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
              Registrar
            </Button>
          </form>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
