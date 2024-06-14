import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button } from '@mui/material';
import api from '../../components/axiosConfig';

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

const ModalPerfil = ({ open, handleClose, perfil }) => {
  const [descripcion, setDescripcion] = useState('');

  
  useEffect(() => {
    if (perfil) {
      setDescripcion(perfil.descripcion);
    }
  }, [perfil]);

  const handleSubmit = async () => {
    if (perfil) {
      // Edit
      try {
        const response = await api.put(`/api/perfiles/${perfil.perfil_id}`, perfil);
        setPerfiles(perfiles.map(p => p.perfil_id === perfil.perfil_id ? response.data : p));
        setOpenPerfilModal(false);
      } catch (error) {
        GlobalAlert.showError('Error editing profile', error.message);
      }
    } else {
      // Create
      try {
        const response = await api.post('/api/perfiles', perfil);
        setPerfiles([...perfiles, response.data]);
        setOpenPerfilModal(false);
      } catch (error) {
        GlobalAlert.showError('Error adding profile', error.message);
      }
    }

    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <h2>{perfil ? 'Editar Perfil' : 'Nuevo Perfil'}</h2>
        <TextField
          label="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          fullWidth
        />
        <Button onClick={handleSubmit} variant="contained" color="primary" sx={{ mt: 2 }}>
          Guardar
        </Button>
      </Box>
    </Modal>
  );
};

export default ModalPerfil;
