import Books from "@/app/components/Books";
import Typography from '@mui/material/Typography';
import LayoutWithDrawer from "../components/Drawer/LayoutWithDrawer";

const BooksPage: React.FC = () => {
  return (
    <LayoutWithDrawer>
      <Typography variant="h4" className="font-bold mb-8 text-gray-900 dark:text-gray-100">
        Lista de Livros
      </Typography>
      <Books />
    </LayoutWithDrawer>
  );
};

export default BooksPage;
