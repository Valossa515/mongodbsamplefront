"use client";

import { useSearchParams } from 'next/navigation';
import ErrorPage from '../components/ErrorPage';


const Error: React.FC = () => {
  const searchParams = useSearchParams();
  const statusCode = searchParams.get('statusCode') || '404';

  return <ErrorPage statusCode={parseInt(statusCode, 10)} />;
};

export default Error;