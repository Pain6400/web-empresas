import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';
import api from '../axiosConfig';
import GlobalAlert from '../GlobalAlert';

const ModalISV = ({ open, onClose, isv, setReload }) => {
  const [nombre, setNombre] = useState('');
  const [porcentaje, setPorcentaje] = useState('');

  useEffect(() => {
    if (isv) {
      setNombre(isv.nombre);
      setPorcentaje(isv.porcentaje);
    }
  }, [isv]);

  const handleSave = async () => {
    try {
      if (isv) {
        await api.post('/maintenance/updateISV', {
          isv_id: isv.isv_id,
          nombre,
          porcentaje
        });
        GlobalAlert.showSuccess('ISV actualizado correctamente');
      } else {
        await api.post('/maintenance/createISV', {
          nombre,
          porcentaje
        });
        GlobalAlert.showSuccess('ISV creado correctamente');
      }
      setReload(true);
      onClose();
    } catch (error) {
      const response = error.response?.data ?? null;
      if (response) {
        GlobalAlert.showError('Error guardando ISV', response.message);
      } else {
        GlobalAlert.showError('Error guardando ISV', error.message);
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{isv ? 'Editar ISV' : 'Crear ISV'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Nombre"
          type="text"
          fullWidth
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Porcentaje"
          type="number"
          fullWidth
          value={porcentaje}
          onChange={(e) => setPorcentaje(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancelar
        </Button>
        <Button onClick={handleSave} color="primary">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalISV;
