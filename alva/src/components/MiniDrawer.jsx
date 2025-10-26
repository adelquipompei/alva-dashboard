import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import {
  Box, CssBaseline, Toolbar, Typography, Divider,
  IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  AppBar as MuiAppBar, Drawer as MuiDrawer, Button
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Add as AddIcon,
  Upload as UploadIcon,
  Dvr as DvrIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { useNavigate, Routes, Route } from 'react-router-dom';
import logoPrincipal from '../assets/logoPrincipal.png';
import Home from './Home';
import AgregarProducto from './AgregarProducto';
import ExcelUploader from './ExcelUploader';
import ListaPedidos from './ListaPedidos';
import { jwtDecode } from "jwt-decode";

const drawerWidth = 240;

// Mixins del Drawer
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    variants: [
      {
        props: ({ open }) => open,
        style: {
          ...openedMixin(theme),
          '& .MuiDrawer-paper': openedMixin(theme),
        },
      },
      {
        props: ({ open }) => !open,
        style: {
          ...closedMixin(theme),
          '& .MuiDrawer-paper': closedMixin(theme),
        },
      },
    ],
  }),
);

let items = [
  { text: 'Ver Pedidos', path: '/dashboard/ver-pedidos', icon: <DvrIcon /> },
  { text: 'Agregar Producto', path: '/dashboard/agregar-producto', icon: <AddIcon /> },
  { text: 'Subir Excel', path: '/dashboard/subir-excel', icon: <UploadIcon /> },
];

export default function MiniDrawer({ setLogueado }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [username, setUsername] = React.useState("");

  React.useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUsername(decoded.user || decoded.username || "Administrador");
      } catch (err) {
        console.error("Error al decodificar el token:", err);
        setLogueado(false);
      }
    }
  }, []);

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  // 🔐 Función para cerrar sesión
  const handleLogout = () => {
    sessionStorage.removeItem("token");
    setLogueado(false);
    navigate("/"); // redirige al login o página inicial
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar sx={{ backgroundColor: "#212529" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={[
              { marginRight: 5 },
              open && { display: 'none' },
            ]}
          >
            <MenuIcon sx={{ color: '#FFC107' }} />
          </IconButton>
          <img style={{ width: '70px' }} src={logoPrincipal} alt="logo" />
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, color: "#FFC107", marginLeft: 2 }}
          >
            ¡Hola, {username}!
          </Typography>

          {/* 🔘 BOTÓN DE LOGOUT */}
          <Button
            color="inherit"
            onClick={handleLogout}
            startIcon={<LogoutIcon sx={{ color: '#FFC107' }} />}
            sx={{
              color: '#FFC107',
              
            }}
          >
           
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" open={open}>
        <DrawerHeader sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
          <img style={{ width: '70px' }} src={logoPrincipal} alt="" />
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {items.map(({ text, path, icon }, index) => (
            <ListItem key={index} disablePadding sx={{ display: 'block' }} onClick={() => navigate(path)}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  px: 2.5,
                  justifyContent: open ? 'initial' : 'center'
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    justifyContent: 'center',
                    mr: open ? 3 : 'auto'
                  }}
                >
                  {icon}
                </ListItemIcon>
                <ListItemText
                  primary={text}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
      </Drawer>

      <Box component="main">
        <DrawerHeader />
        <Routes>
          <Route path='/' element={<ListaPedidos />} />
          <Route path='/agregar-producto' element={<AgregarProducto setLogueado={setLogueado} />} />
          <Route path='/subir-excel' element={<ExcelUploader setLogueado={setLogueado} />} />
          <Route path='/ver-pedidos' element={<ListaPedidos setLogueado={setLogueado} />} />
        </Routes>
      </Box>
    </Box>
  );
}
