import Typography from '@mui/material/Typography';
import LayoutWithDrawer from "./components/Drawer/LayoutWithDrawer";

const HomePage: React.FC = () => {
  return (
    <LayoutWithDrawer>
      <Typography
        variant="h4"
        className="font-bold mb-8"
        sx={{ color: "#e0e0e0" }}
      >
        MongoDB CRUD Sample
      </Typography>
      <Typography variant="body1" className="text-lg text-gray-700 dark:text-gray-300">
        Bem-vindo à página inicial! Aqui você pode navegar entre as páginas e visualizar a lista de livros.
      </Typography>
    </LayoutWithDrawer>
  );
};

export default HomePage;
