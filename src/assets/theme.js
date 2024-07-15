// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0b40a8', // Color primario
      contrastText: '#fff', // Texto en botones primarios
    },
    secondary: {
      main: '#f50057', // Color secundario (puedes cambiarlo)
    },
  },
});

export default theme;
