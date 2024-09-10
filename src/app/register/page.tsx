import Books from "@/app/components/Books";
import Typography from '@mui/material/Typography';
import Register from "../components/Register";

const RegisterPage: React.FC = () => {
  return (
    <>
      <Typography variant="h4" className="font-bold mb-8 text-gray-900 dark:text-gray-100">
      </Typography>
      <Register />
    </>
  );
};

export default RegisterPage;
