import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import Box from '@mui/material/Box';

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

function Keko() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Keko
      </Box>
    </ThemeProvider>
  );
}

export default Keko;
