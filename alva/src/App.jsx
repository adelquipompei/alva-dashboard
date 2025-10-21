import { useState } from 'react'

import './App.css'

import MiniDrawer from './components/MiniDrawer';
import { Routes, Route, Navigate } from 'react-router-dom';

import { createTheme, ThemeProvider, CssBaseline, Box } from '@mui/material';

import Login from './components/Login';




function App() {
  const [logueado, setLogueado] = useState();
  const theme = createTheme({
    palette: {
      background: {
        default: "#000",
      },
      text: {
        primary: "#000",
      },
    },
    customBackground: {
      image: 'url("/fondo2.jpg")', // ⚠️ tiene que estar en public o assets correctamente referenciado
    },
  });



  return (
    <>


      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            backgroundImage: 'url("/fondo2.jpg")',
            backgroundSize: "auto",       // o '80px 80px' si querés escalar el patrón
            backgroundPosition: "top left",
            backgroundAttachment: "fixed",
            backgroundRepeat: "repeat",    // <- aquí está la clave
            zIndex: -1,
            filter: logueado ? 'invert(0)': 'invert(1)' , // <- esto invierte los colores
            
          }}
        />

        <Routes>



          <Route
            path='/'
            element={logueado ? <Navigate to="/dashboard" /> : <Login setLogueado={setLogueado} />}
          />



          <Route
            path='dashboard/*'
            element={logueado ? <MiniDrawer /> : <Navigate to="/" />}
          />
        </Routes>



      </ThemeProvider>

    </>
  )
}

export default App
