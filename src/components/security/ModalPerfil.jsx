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
        const response = await api.put(`/security/createPefil/${perfil.perfil_id}`, perfil);
        setOpenPerfilModal(false);
      } catch (error) {
        let response = error.response?.data ?? null;
        if(response) {
          GlobalAlert.showError('Error: ', response.message);
        } else {
          GlobalAlert.showError('Error: ', error);
        }
      }
    } else {
      // Create
      try {
        const response = await api.post('/security/createPefil/', perfil);
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
