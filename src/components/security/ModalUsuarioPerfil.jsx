import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Divider } from '@mui/material';
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
  const [errors, setErrors] = useState({});

  useEffect(() => {
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
        <Divider  />
        <TextField
          label="Usuario ID"
          value={usuarioId}
          onChange={(e) => setUsuarioId(e.target.value)}
          fullWidth
          error={Boolean(errors.usuarioId)}
          helperText={errors.usuarioId}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Perfil ID"
          value={perfilId}
          onChange={(e) => setPerfilId(e.target.value)}
          fullWidth
          error={Boolean(errors.perfilId)}
          helperText={errors.perfilId}
          sx={{ mb: 2 }}
        />
        <Button onClick={handleSubmit} variant="contained" color="primary" sx={{ mt: 2 }}>
          Guardar
        </Button>
      </Box>
    </Modal>
  );
};

export default ModalUsuarioPerfil;
