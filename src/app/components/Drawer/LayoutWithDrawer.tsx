"use client";
import { useState, useEffect } from 'react';
import Link from "next/link";
import { usePathname, useRouter } from 'next/navigation';
import { AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemText, ListItemButton, Box } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import useAuthToken from '@/app/Hooks/useAuthToken';

const LayoutWithDrawer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { token, roles, isTokenDecoded } = useAuthToken();

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  useEffect(() => {
    if (isTokenDecoded) {
      if (!token) {
        router.push('/error?statusCode=403');
      } else {
        const hasAdminRole = roles.includes('ADMIN');
        if ((pathname === '/books') && !hasAdminRole) {
          router.push('/error?statusCode=403');
        }
      }
    }
  }, [token, roles, pathname, router, isTokenDecoded]);

  return (
    <Box className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
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
          <Typography
            variant="h6"
            className="flex-grow font-semibold"
            sx={{
              color: "#ffffff",
              fontWeight: 'bold',
              fontSize: '1.25rem',
            }}
          >
            MongoDB CRUD Sample
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 250, backgroundColor: "#132039", height: "100%" }}>
          <Typography variant="h6" className="p-4" sx={{ color: "#ffffff" }}>
            Menu
          </Typography>
          <List onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
            {pathname !== "/home" && (
              <ListItem disablePadding>
                <ListItemButton component={Link} href="/home">
                  <AssignmentReturnIcon sx={{ color: "#ffffff", marginRight: 2 }} />
                  <ListItemText primary="Ir para Home" primaryTypographyProps={{ sx: { color: "#ffffff" } }} />
                </ListItemButton>
              </ListItem>
            )}
            {roles.includes("ADMIN") && pathname !== "/books" && (
              <ListItem disablePadding>
                <ListItemButton component={Link} href="/books">
                  <MenuBookIcon sx={{ color: "#ffffff", marginRight: 2 }} />
                  <ListItemText primary="Ir para Livros" primaryTypographyProps={{ sx: { color: "#ffffff" } }} />
                </ListItemButton>
              </ListItem>
            )}
            {pathname !== "/reservations" && (
              <ListItem disablePadding>
                <ListItemButton component={Link} href="/reservations">
                  <MenuBookIcon sx={{ color: "#ffffff", marginRight: 2 }} />
                  <ListItemText primary="Ir para Reservas" primaryTypographyProps={{ sx: { color: "#ffffff" } }} />
                </ListItemButton>
              </ListItem>
            )}
            <ListItem disablePadding>
              <ListItemButton component={Link} href="/" onClick={() => localStorage.setItem('authToken', "")}>
                <LogoutIcon sx={{ color: "#ffffff", marginRight: 2 }} />
                <ListItemText primary="Logout" primaryTypographyProps={{ sx: { color: "#ffffff" } }} />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <Box className="flex-grow flex flex-col items-center justify-center text-center mt-16 p-6">
        {children}
      </Box>
    </Box>
  );
};

export default LayoutWithDrawer;
