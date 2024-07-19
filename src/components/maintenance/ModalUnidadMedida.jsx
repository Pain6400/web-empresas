import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';
import api from '../axiosConfig';
import GlobalAlert from '../GlobalAlert';

const ModalUnidadMedida = ({ open, onClose, unidadMedida, setReload }) => {
  const [nombre, setNombre] = useState('');
  const [siglas, setSiglas] = useState('');

  useEffect(() => {
    if (unidadMedida) {
      setNombre(unidadMedida.nombre);
      setSiglas(unidadMedida.siglas);
    }
  }, [unidadMedida]);

  const handleSave = async () => {
    try {
      if (unidadMedida) {
        await api.post('/maintenance/updateUnidadMedida', {
          unidad_medida_id: unidadMedida.unidad_medida_id,
          nombre,
          siglas
        });
        GlobalAlert.showSuccess('Unidad de medida actualizada correctamente');
      } else {
        await api.post('/maintenance/createUnidadMedida', {
          nombre,
          siglas
        });
        GlobalAlert.showSuccess('Unidad de medida creada correctamente');
      }
      setReload(true);
      onClose();
    } catch (error) {
      const response = error.response?.data ?? null;
      if (response) {
        GlobalAlert.showError('Error guardando unidad de medida', response.message);
      } else {
        GlobalAlert.showError('Error guardando unidad de medida', error.message);
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{unidadMedida ? 'Editar Unidad de Medida' : 'Crear Unidad de Medida'}</DialogTitle>
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
          label="Siglas"
          type="text"
          fullWidth
          value={siglas}
          onChange={(e) => setSiglas(e.target.value)}
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

export default ModalUnidadMedida;
