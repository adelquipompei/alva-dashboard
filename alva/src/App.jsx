import { useState } from 'react'

import './App.css'

import MiniDrawer from './components/MiniDrawer';
import { Routes, Route, Navigate } from 'react-router-dom';

import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';

import Login from './components/Login';




function App() {
  const [logueado, setLogueado] = useState();
  const theme = createTheme({
    palette: {
      background: {
        default: '#000', // fondo global
      },
      text: {
        primary: '#fff',
      },
    },
  });


  return (
    <>



      <Routes>



        <Route
          path='/'
          element={logueado ? <Navigate to="/dashboard" /> : <ThemeProvider theme={theme}><CssBaseline /><Login setLogueado={setLogueado} /></ThemeProvider>}
        />



        <Route
          path='dashboard/*'
          element={logueado ? <MiniDrawer /> : <Navigate to="/" />}
        />
      </Routes>




    </>
  )
}

export default App
