import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Button from '@mui/material/Button';
import MiniDrawer from './components/MiniDrawer';
import { Routes,Route } from 'react-router-dom';
import Home from './components/Home'
import AgregarProducto from './components/AgregarProducto';



function App() {
  const [count, setCount] = useState(0)

  return (
    <>

      <MiniDrawer />
      <Routes>
        <Route path='/' element= {<Home/>} />
        <Route path='/agregar-producto' element= {<AgregarProducto/>} />
      </Routes>



    </>
  )
}

export default App
