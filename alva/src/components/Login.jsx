import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, InputAdornment } from '@mui/material';
import { motion } from 'framer-motion';
import { Lock, Person } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';

function Login({setLogueado}) {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  
  const theme = useTheme();

  const handleSubmit = async(e) => {
    e.preventDefault();
    const dataUser = {
      user:user,
      pass:pass
    }
    console.log(dataUser);
    const resp = await axios.post('http://localhost:3000/user-login',dataUser);
     if(resp.data.login){
       setLogueado(true)
    }
      



  };

  return (
    <Box
  sx={{
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundImage: `url(${theme.customBackground.image})`,
    backgroundRepeat: 'repeat',
    backgroundSize: 'auto', // o '100px 100px' si querés escalar el patrón
    backgroundPosition: 'top left',
  }}
>
  {/* tu contenido acá */}


      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <Paper
  elevation={0}
  sx={{
    position: 'relative',
    overflow: 'hidden',
    p: 5,
    borderRadius: 2,
    minWidth: 380,
    background: 'rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(20px) saturate(180%)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 0 25px rgba(255,140,0,0.25)',
    transition: 'all 1s ease',
    '&:hover': { transform: 'scale(1.02)', boxShadow: '0 0 35px rgba(255,140,0,0.4)' },

    // Reflejo que pasa rápido y espera 3s
    '&::before': {
  content: '""',
  position: 'absolute',
  top: '-50%',
  left: '-75%',
  width: '200%',
  height: '200%',
  background: 'linear-gradient(120deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 100%)',
  transform: 'rotate(25deg) translateX(-100%)',
  animation: 'shine 4s linear infinite',
  animationDelay: '-2s', // ⬅ arranca ya en progreso
  pointerEvents: 'none',
},
'@keyframes shine': {
  '0%, 70%': { transform: 'rotate(25deg) translateX(-100%)' }, // quieto 70% del tiempo
  '70%, 100%': { transform: 'rotate(25deg) translateX(100%)' }, // pasa rápido
},

  }}
>

          <Typography
            variant="h4"
            align="center"
            sx={{
              mb: 2,
              fontWeight: 900,
              letterSpacing: 2,
              color: '#ff9800',
              textShadow: '0 0 10px rgba(255,152,0,0.5)',
            }}
          >
            ALVA NEUMÁTICOS
          </Typography>

          <Typography
            variant="subtitle1"
            align="center"
            sx={{ mb: 4, color: '#ddd' }}
          >
            Panel Administrativo
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              variant="outlined"
              label="Usuario"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person sx={{ color: '#ffb74d' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                  '&:hover fieldset': { borderColor: '#ff9800' },
                  '&.Mui-focused fieldset': { borderColor: '#ff9800' },
                },
                '& .MuiInputLabel-root': { color: '#aaa' },
              }}
            />

            <TextField
              fullWidth
              type="password"
              variant="outlined"
              label="Contraseña"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: '#ffb74d' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                  '&:hover fieldset': { borderColor: '#ff9800' },
                  '&.Mui-focused fieldset': { borderColor: '#ff9800' },
                },
                '& .MuiInputLabel-root': { color: '#aaa' },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 4,
                py: 1.3,
                background: 'linear-gradient(90deg, #ff9800, #f44336)',
                fontWeight: 'bold',
                fontSize: '1rem',
                letterSpacing: 0.5,
                boxShadow: '0 0 15px rgba(255,152,0,0.4)',
                '&:hover': {
                  background: 'linear-gradient(90deg, #ffa726, #ef5350)',
                  boxShadow: '0 0 25px rgba(255,152,0,0.6)',
                },
              }}
            >
              Ingresar
            </Button>
          </form>
        </Paper>
      </motion.div>
    </Box>
  );
}

export default Login;
