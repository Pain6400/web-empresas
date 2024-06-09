import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button } from '@mui/material';

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

const ModalPerfil = ({ open, handleClose, handleSave, perfil }) => {
  const [descripcion, setDescripcion] = useState('');

  useEffect(() => {
    if (perfil) {
      setDescripcion(perfil.descripcion);
    }
  }, [perfil]);

  const handleSubmit = () => {
    handleSave({ ...perfil, descripcion });
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
