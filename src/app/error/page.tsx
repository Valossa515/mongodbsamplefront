"use client";

import { useSearchParams } from 'next/navigation';
import ErrorPage from '../components/ErrorPage';


const Error: React.FC = () => {

  if (typeof window === 'undefined') {
    return <ErrorPage statusCode={404} />;
  }

  const searchParams = useSearchParams();
  const statusCode = searchParams.get('statusCode') || '404';

  return <ErrorPage statusCode={parseInt(statusCode, 10)} />;
};

export default Error;