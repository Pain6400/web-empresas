import React, { useState, useEffect, useContext } from 'react';
import api from '../../components/axiosConfig';
import { Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import GlobalAlert from '../../components/GlobalAlert';
import ModalUsuario from '../../components/security/ModalUsuario';
import { LoadingContext } from '../../context/LoadingContext';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [openUsuarioModal, setOpenUsuarioModal] = useState(false);
  const { setIsLoading } = useContext(LoadingContext);
  
  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    setIsLoading(true)
    try {
      const response = await api.get('/security/getUsuarios');
      if (Array.isArray(response.data.users)) {
        setUsuarios(response.data.users);
      } else {
        GlobalAlert.showError('Error fetching users: Data is not an array');
      }
    } catch (error) {
      let response = error.response?.data ?? null;
      if(response) {
        GlobalAlert.showError('Error fetching users', response.message);
      } else {
        GlobalAlert.showError('Error logging in', error);
      }
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div>
      <Box sx={{ backgroundColor: '#6A1B9A', color: 'white', padding: '16px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">Usuarios</Typography>
        <Button variant="contained" color="primary" onClick={() => { setSelectedUsuario(null); setOpenUsuarioModal(true); }}>
          Crear
        </Button>
      </Box>
      <TableContainer component={Paper} style={{ marginBottom: '2rem' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Identidad</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Correo</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(usuarios) && usuarios.map((usuario) => (
              <TableRow key={usuario.usuario_id}>
                <TableCell>{usuario.usuario_id}</TableCell>
                <TableCell>{usuario.nombre}</TableCell>
                <TableCell>{usuario.identidad}</TableCell>
                <TableCell>{usuario.telefono}</TableCell>
                <TableCell>{usuario.correo}</TableCell>
                <TableCell>{usuario.estado === '1' ? 'Activo': 'Inactivo'}</TableCell>
                <TableCell>
                  <IconButton onClick={() => { setSelectedUsuario(usuario); setOpenUsuarioModal(true); }}>
                    <Edit />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <ModalUsuario
        open={openUsuarioModal}
        handleClose={() => setOpenUsuarioModal(false)}
        usuario={selectedUsuario}
        usuarios={usuarios}
        setUsuarios={setUsuarios}
      />
    </div>
  );
};

export default Usuarios;
