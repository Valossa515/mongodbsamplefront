"use client";
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ErrorPage from '../components/ErrorPage';

const Error: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Captura o statusCode dos parâmetros da URL
  const statusCode = parseInt(searchParams.get('statusCode') || '404', 10);

  useEffect(() => {
    // Você pode implementar lógica adicional aqui se necessário
    if (statusCode === 404) {
      console.log("Página não encontrada.");
    } else if (statusCode === 500) {
      console.log("Erro interno do servidor.");
    } else if (statusCode === 401) {
      console.log("Usuário não autorizado.");
    } else if (statusCode === 403) {
      console.log("Acesso negado.");
    }
  }, [router, statusCode]);

  return <ErrorPage statusCode={statusCode} />;
};

export default Error;
