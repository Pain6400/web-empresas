import React, { useState, useEffect } from 'react';
import api from '../../components/axiosConfig';
import { Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import GlobalAlert from '../../components/GlobalAlert';
import ModalPerfil from '../../components/security/ModalPerfil';
import ModalUsuarioPerfil from '../../components/security/ModalUsuarioPerfil';

const Perfiles = () => {
  const [perfiles, setPerfiles] = useState([]);
  const [userProfiles, setUserProfiles] = useState([]);
  const [selectedPerfil, setSelectedPerfil] = useState(null);
  const [selectedUsuarioPerfil, setSelectedUsuarioPerfil] = useState(null);
  const [openPerfilModal, setOpenPerfilModal] = useState(false);
  const [openUsuarioPerfilModal, setOpenUsuarioPerfilModal] = useState(false);

  useEffect(() => {
    fetchPerfiles();
    fetchUserProfiles();
  }, []);

  const fetchPerfiles = async () => {
    try {
      const response = await api.get('/security/getPefiles');
      if (Array.isArray(response.data.perfiles)) {
        setPerfiles(response.data.perfiles);
      } else {
        GlobalAlert.showError('Error fetching profiles: Data is not an array');
      }
    } catch (error) {
      let response = error.response?.data ?? null;
      if(response) {
        GlobalAlert.showError('Error fetching profiles', response.message);
      } else {
        GlobalAlert.showError('Error logging in', error);
      }
    }
  };

  const fetchUserProfiles = async () => {
    try {
      const response = await api.get('/security/getUsuariosPefiles');
      if (Array.isArray(response.data.usuariosPerfiles)) {
        setUserProfiles(response.data.usuariosPerfiles);
      } else {
        GlobalAlert.showError('Error fetching user profiles: Data is not an array');
      }
    } catch (error) {
      console.log(error)
      let response = error.response?.data ?? null;
      if(response) {
        GlobalAlert.showError('Error fetching user profiles', response.message);
      } else {
        GlobalAlert.showError('Error logging in', error);
      }
    }
  };


  const handleSaveUsuarioPerfil = async (usuarioPerfil) => {
    // Implement similar to handleSavePerfil
  };

  const handleDeletePerfil = async (perfilId) => {
    try {
      await api.delete(`/api/perfiles/${perfilId}`);
      setPerfiles(perfiles.filter(perfil => perfil.perfil_id !== perfilId));
    } catch (error) {
      GlobalAlert.showError('Error deleting profile', error.message);
    }
  };

  const handleDeleteUsuarioPerfil = async (usuarioId, perfilId) => {
    // Implement similar to handleDeletePerfil
  };

  return (
    <div>
      <Box sx={{ backgroundColor: '#6A1B9A', color: 'white', padding: '16px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">Perfiles</Typography>
        <Button variant="contained" color="primary" onClick={() => { setSelectedPerfil(null); setOpenPerfilModal(true); }}>
          Crear
        </Button>
      </Box>
      <TableContainer component={Paper} style={{ marginBottom: '2rem' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Perfil ID</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(perfiles) && perfiles.map((perfil) => (
              <TableRow key={perfil.perfil_id}>
                <TableCell>{perfil.perfil_id}</TableCell>
                <TableCell>{perfil.descripcion}</TableCell>
                <TableCell>
                  <IconButton onClick={() => { setSelectedPerfil(perfil); setOpenPerfilModal(true); }}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDeletePerfil(perfil.perfil_id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ backgroundColor: '#6A1B9A', color: 'white', padding: '16px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">Usuarios Perfiles</Typography>
        <Button variant="contained" color="primary" onClick={() => { setSelectedUsuarioPerfil(null); setOpenUsuarioPerfilModal(true); }}>
          Crear
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Usuario ID</TableCell>
              <TableCell>Perfil ID</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(userProfiles) && userProfiles.map((userProfile) => (
              <TableRow key={`${userProfile.usuario_id}-${userProfile.perfil_id}`}>
                <TableCell>{userProfile.usuario_id}</TableCell>
                <TableCell>{userProfile.perfil_id}</TableCell>
                <TableCell>
                  <IconButton onClick={() => { setSelectedUsuarioPerfil(userProfile); setOpenUsuarioPerfilModal(true); }}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteUsuarioPerfil(userProfile.usuario_id, userProfile.perfil_id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <ModalPerfil
        open={openPerfilModal}
        handleClose={() => setOpenPerfilModal(false)}
        perfil={selectedPerfil}
      />
      <ModalUsuarioPerfil
        open={openUsuarioPerfilModal}
        handleClose={() => setOpenUsuarioPerfilModal(false)}
        usuarioPerfil={selectedUsuarioPerfil}
      />
    </div>
  );
};

export default Perfiles;
