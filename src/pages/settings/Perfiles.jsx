import React, { useState, useEffect } from 'react';
import api from '../../components/axiosConfig';
import { Button, TextField, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import GlobalAlert from '../../components/GlobalAlert';

const Perfiles = () => {
  const [perfiles, setPerfiles] = useState([]);
  const [userProfiles, setUserProfiles] = useState([]);
  const [newPerfil, setNewPerfil] = useState('');
  const [editPerfilId, setEditPerfilId] = useState(null);
  const [editPerfilDescripcion, setEditPerfilDescripcion] = useState('');

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

  const handleAddPerfil = async () => {
    try {
      const response = await axios.post('/api/perfiles', { descripcion: newPerfil });
      setPerfiles([...perfiles, response.data]);
      setNewPerfil('');
    } catch (error) {
      GlobalAlert.showError('Error adding profile', error.message);
    }
  };

  const handleDeletePerfil = async (perfilId) => {
    try {
      await axios.delete(`/api/perfiles/${perfilId}`);
      setPerfiles(perfiles.filter(perfil => perfil.perfil_id !== perfilId));
    } catch (error) {
      GlobalAlert.showError('Error deleting profile', error.message);
    }
  };

  const handleEditPerfil = async () => {
    try {
      const response = await axios.put(`/api/perfiles/${editPerfilId}`, { descripcion: editPerfilDescripcion });
      setPerfiles(perfiles.map(perfil => (perfil.perfil_id === editPerfilId ? response.data : perfil)));
      setEditPerfilId(null);
      setEditPerfilDescripcion('');
    } catch (error) {
      GlobalAlert.showError('Error editing profile', error.message);
    }
  };

  return (
    <div>
      <h1>Perfiles</h1>
      <div>
        <TextField
          label="Nuevo Perfil"
          value={newPerfil}
          onChange={(e) => setNewPerfil(e.target.value)}
        />
        <Button onClick={handleAddPerfil} variant="contained" color="primary">Agregar Perfil</Button>
      </div>
      <TableContainer component={Paper}>
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
                  <IconButton onClick={() => {
                    setEditPerfilId(perfil.perfil_id);
                    setEditPerfilDescripcion(perfil.descripcion);
                  }}>
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
      {editPerfilId && (
        <div>
          <TextField
            label="Editar Descripción"
            value={editPerfilDescripcion}
            onChange={(e) => setEditPerfilDescripcion(e.target.value)}
          />
          <Button onClick={handleEditPerfil} variant="contained" color="primary">Guardar Cambios</Button>
        </div>
      )}
      <h2>Usuarios Perfiles</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Usuario ID</TableCell>
              <TableCell>Perfil ID</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(userProfiles) && userProfiles.map((userProfile) => (
              <TableRow key={`${userProfile.usuario_id}-${userProfile.perfil_id}`}>
                <TableCell>{userProfile.usuario_id}</TableCell>
                <TableCell>{userProfile.perfil_id}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Perfiles;
