import { GetServerSideProps } from 'next';
import ErrorPage from '../components/ErrorPage';

interface ErrorProps {
  statusCode: number;
}

const Error: React.FC<ErrorProps> = ({ statusCode }) => {
  return <ErrorPage statusCode={statusCode} />;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const statusCode = parseInt(context.query.statusCode as string, 10) || 404;
  return { props: { statusCode } };
};

export default Error;
