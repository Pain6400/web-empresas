import React, { useState, useEffect, useContext  } from 'react';
import { Button, TextField, Container, Typography, Avatar, CssBaseline, Box, Snackbar, Alert,  MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom';
import api from '../../components/axiosConfig';
import { UserContext } from '../../context/UserContext';

const LoginForm = ({onLogin}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [empresaId, setEmpresaId] = useState('');
  const [empresas, setEmpresas] = useState([]);
  const [errors, setErrors] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};

    if (!username) {
      validationErrors.username = 'El usuario es obligatorio';
    }
    if (!password) {
      validationErrors.password = 'La contraseña es obligatoria';
    }
    if (!empresaId) {
      validationErrors.empresaId = 'Debe seleccionar una empresa';
    }
    if (Object.keys(validationErrors).length === 0) {
      // Redirige al dashboard si no hay errores
      try {
        const response = await api.post('/account/login', { usuario_id : username, password });
        const userInfo = { ...response.data.userInfo, empresa_id: empresaId };
        localStorage.setItem('token', response.data.tokenInfo.token);
        onLogin(userInfo)
        navigate('/dashboard');
      } catch (err) {
        setOpenSnackbar(true)
        const response = err.response.data;
        setSnackbarMessage(response.message)
        console.error('Error logging in:', response);
      }
    } else {
      // Actualiza los errores en el estado
      setErrors(validationErrors);
    }
  };

  useEffect( () => {
    const fetchEmpresas = async () => {
      try {
        const response = await api.get('/account/getEmpresas');
        setEmpresas(response.data.empresas);
      } catch (error) {
        console.error('Error fetching empresas:', error);
      }
    };

    fetchEmpresas();
  }, []);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Iniciar Sesión
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Usuario"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={Boolean(errors.username)}
            helperText={errors.username}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Contraseña"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={Boolean(errors.password)}
            helperText={errors.password}
          />
          <FormControl
            fullWidth
            variant="outlined"
            margin="normal"
            required
            error={Boolean(errors.empresaId)}
          >
            <InputLabel id="empresa-label">Empresa</InputLabel>
            <Select
              labelId="empresa-label"
              id="empresa"
              value={empresaId}
              onChange={(e) => setEmpresaId(e.target.value)}
              label="Empresa"
            >
              {empresas.map((empresa) => (
                <MenuItem key={empresa.empresa_id} value={empresa.nombre}>
                  {empresa.nombre}
                </MenuItem>
              ))}
            </Select>
            {errors.empresaId && (
              <Typography color="error">{errors.empresaId}</Typography>
            )}
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            Iniciar Sesión
          </Button>
        </Box>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default LoginForm;
