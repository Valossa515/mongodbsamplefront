import { notFound } from 'next/navigation';
import ErrorPage from '../components/ErrorPage';


interface ErrorProps {
  searchParams: {
    statusCode?: string;
  };
}

const Error: React.FC<ErrorProps> = ({ searchParams }) => {
  // Captura o statusCode dos parâmetros da URL
  const statusCode = parseInt(searchParams.statusCode || '404', 10);

  // Redireciona ou exibe a página de erro baseada no statusCode
  if (![401, 403, 404, 500].includes(statusCode)) {
    return notFound(); // Para códigos de status não tratados, retorna 404
  }

  return <ErrorPage statusCode={statusCode} />;
};

export default Error;