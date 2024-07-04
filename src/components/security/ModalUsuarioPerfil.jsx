import React, { useState, useEffect } from 'react';
import { Modal, Box, Button, Divider, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import api from '../../components/axiosConfig';
import GlobalAlert from '../../components/GlobalAlert';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const ModalUsuarioPerfil = ({ open, handleClose, usuarioPerfil }) => {
  const [usuarioId, setUsuarioId] = useState('');
  const [perfilId, setPerfilId] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [perfiles, setPerfiles] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await api.get('/user/getAllUsers');
        setUsuarios(response.data.users);
      } catch (error) {
        GlobalAlert.showError('Error fetching usuarios', error.message);
      }
    };

    const fetchPerfiles = async () => {
      try {
        const response = await api.get('/security/getPefiles');
        setPerfiles(response.data.perfiles);
      } catch (error) {
        GlobalAlert.showError('Error fetching perfiles', error.message);
      }
    };

    fetchUsuarios();
    fetchPerfiles();
    setUsuarioId('');
    setPerfilId('');
  }, []);

  const handleSubmit = async () => {
    const validationErrors = {};

    if (!usuarioId) {
      validationErrors.usuarioId = 'El usuario es obligatorio';
    }
    if (!perfilId) {
      validationErrors.perfilId = 'El perfil es obligatoria';
    }

    if (Object.keys(validationErrors).length === 0) {
      try {
        let path = '/security/createPerfilPermiso'
        const response = await api.post(path, {
          usuarioId,
          perfilId
        });

        if(response.data.status) {
          handleClose();
          GlobalAlert.showSuccess('Registro creado correctamente');
        } else {
          GlobalAlert.showError('Error: ', response.data.message);
        }
      } catch (error) {
        let response = error.response?.data ?? null;
        if(response) {
          GlobalAlert.showError('Error: ', response.message);
        } else {
          GlobalAlert.showError('Error: ', error);
        }
      }
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <h2>{usuarioPerfil ? 'Editar Usuario Perfil' : 'Nuevo Usuario Perfil'}</h2>
        <Divider />
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Usuario ID</InputLabel>
          <Select
            value={usuarioId}
            onChange={(e) => setUsuarioId(e.target.value)}
            error={Boolean(errors.usuarioId)}
          >
            {usuarios.map((usuario) => (
              <MenuItem key={usuario.usuario_id} value={usuario.usuario_id}>
                {usuario.nombre}
              </MenuItem>
            ))}
          </Select>
          {errors.usuarioId && <p style={{ color: 'red' }}>{errors.usuarioId}</p>}
        </FormControl>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Perfil ID</InputLabel>
          <Select
            value={perfilId}
            onChange={(e) => setPerfilId(e.target.value)}
            error={Boolean(errors.perfilId)}
          >
            {perfiles.map((perfil) => (
              <MenuItem key={perfil.perfil_id} value={perfil.perfil_id}>
                {perfil.descripcion}
              </MenuItem>
            ))}
          </Select>
          {errors.perfilId && <p style={{ color: 'red' }}>{errors.perfilId}</p>}
        </FormControl>
        <Button onClick={handleSubmit} variant="contained" color="primary" sx={{ mt: 2 }}>
          Guardar
        </Button>
      </Box>
    </Modal>
  );
};

export default ModalUsuarioPerfil;
