"use client"; // Adiciona esta linha para o uso de hooks no lado do cliente

import { useState } from 'react';
import Link from "next/link";
import { AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemText, ListItemButton, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const HomePage: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  return (
    <Box className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* AppBar com ícone de menu */}
      <AppBar position="fixed" className="bg-blue-600">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className="flex-grow font-semibold">
            MongoDB CRUD Sample
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Drawer retrátil no topo */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 250, backgroundColor: "#132039", height: "100%" }}>
          <Typography variant="h6" className="p-4" sx={{ color: "#ffffff" }}>
            Menu
          </Typography>
          <List onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
            <ListItem disablePadding>
              <ListItemButton component={Link} href="/books">
                <ListItemText
                  primary="Ir para Livros"
                  primaryTypographyProps={{ sx: { color: "#ffffff" } }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Conteúdo da página */}
      <Box className="flex-grow flex flex-col items-center justify-center text-center mt-16 p-6">
        <Typography variant="h4" className="font-bold mb-8 text-gray-900 dark:text-gray-100">
          MongoDB CRUD Sample
        </Typography>
        <Typography variant="body1" className="text-lg text-gray-700 dark:text-gray-300">
          Bem-vindo à página inicial! Aqui você pode navegar entre as páginas e visualizar a lista de livros.
        </Typography>
      </Box>
    </Box>
  );
};

export default HomePage;
