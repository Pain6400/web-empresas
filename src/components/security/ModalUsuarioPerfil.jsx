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

const ModalUsuarioPerfil = ({ open, handleClose, handleSave, usuarioPerfil }) => {
  const [usuarioId, setUsuarioId] = useState('');
  const [perfilId, setPerfilId] = useState('');

  useEffect(() => {
    if (usuarioPerfil) {
      setUsuarioId(usuarioPerfil.usuario_id);
      setPerfilId(usuarioPerfil.perfil_id);
    }
  }, [usuarioPerfil]);

  const handleSubmit = () => {
    handleSave({ usuario_id: usuarioId, perfil_id: perfilId });
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <h2>{usuarioPerfil ? 'Editar Usuario Perfil' : 'Nuevo Usuario Perfil'}</h2>
        <TextField
          label="Usuario ID"
          value={usuarioId}
          onChange={(e) => setUsuarioId(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Perfil ID"
          value={perfilId}
          onChange={(e) => setPerfilId(e.target.value)}
          fullWidth
        />
        <Button onClick={handleSubmit} variant="contained" color="primary" sx={{ mt: 2 }}>
          Guardar
        </Button>
      </Box>
    </Modal>
  );
};

export default ModalUsuarioPerfil;
