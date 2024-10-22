"use client";

import { Box, Typography, Button } from '@mui/material';
import Link from 'next/link';

const NotFoundPage: React.FC = () => {
  return (
    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="100vh">
      <Typography variant="h1" fontWeight="bold" color="error" gutterBottom>
        404
      </Typography>
      <img
        src="https://http.cat/404.jpg"
        alt="Erro 404"
        style={{ width: '100%', maxWidth: '400px', marginBottom: '16px' }}
      />
      <Typography variant="h6" gutterBottom>
        Página não encontrada.
      </Typography>
      <Button variant="contained" color="primary" component={Link} href="/">
        Voltar à Página Inicial
      </Button>
    </Box>
  );
};

export default NotFoundPage;
