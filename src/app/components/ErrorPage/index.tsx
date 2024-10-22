import { Box, Typography, Button } from '@mui/material';
import Link from 'next/link';

interface ErrorPageProps {
  statusCode: number;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ statusCode }) => {
  const catImageUrl = `https://http.cat/${statusCode}.jpg`;
  let errorMessage = "Página não encontrada.";
  if (statusCode === 401) {
    errorMessage = "Você não está autorizado. Faça login para acessar essa página.";
  } else if (statusCode === 403) {
    errorMessage = "Você não tem permissão para acessar essa página.";
  } else if (statusCode === 500) {
    errorMessage = "Ocorreu um erro no servidor.";
  }

  return (
    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="100vh">
      <Typography variant="h1" fontWeight="bold" color="error" gutterBottom>
        {statusCode}
      </Typography>
      <Box 
        component="img"
        src={catImageUrl}
        alt={`Erro ${statusCode}`}
        sx={{ 
          width: '100%', 
          maxWidth: '400px', 
          marginBottom: '16px', 
          padding: '16px', 
          backgroundColor: 'white', // Cor de fundo
          borderRadius: '8px', // Bordas arredondadas
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' // Sombra para dar um destaque
        }}
      />
      <Typography variant="h6" gutterBottom>
        {errorMessage}
      </Typography>
      <Button variant="contained" color="primary" component={Link} href="/">
        Voltar à Página Inicial
      </Button>
    </Box>
  );
};

export default ErrorPage;
