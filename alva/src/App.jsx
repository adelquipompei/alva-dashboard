import { useState } from 'react'

import fondodash from './assets/fondodash.jpg'; // ruta relativa desde App.js

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
        default: "#212529",
      },
      text: {
        primary: "#000",
      },
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
            background:
              logueado ? `linear-gradient(135deg, rgba(255, 193, 7, 1) 0%, rgba(220, 53, 69, 0.8) 195%),url(https://images.unsplash.com/photo-1616788902258-138db56fe7e5?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687)`
                :
                `
     linear-gradient(116deg, rgb(33 37 41 / 95%) 61%, #ffa726 216%), url(${fondodash}) `
            ,
            backgroundSize: "auto",          // o '80px 80px' si querés escalar el patrón
            backgroundPosition: "top left",
            backgroundAttachment: "fixed",
            backgroundRepeat: "repeat",
            zIndex: -1
          }}
        />


        <Routes>



          <Route
            path='/'
            element={logueado ? <Navigate to="/dashboard" /> : <Login setLogueado={setLogueado} />}
          />



          <Route
            path='dashboard/*'
            element={logueado ? <MiniDrawer setLogueado={setLogueado} /> : <Navigate to="/" />}
          />
        </Routes>



      </ThemeProvider>

    </>
  )
}

export default App
