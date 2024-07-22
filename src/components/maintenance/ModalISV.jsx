import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';
import LoadingButton from "@mui/lab/LoadingButton";
import api from '../axiosConfig';
import GlobalAlert from '../GlobalAlert';

const ModalISV = ({ open, onClose, isv, setReload }) => {
  const [nombre, setNombre] = useState('');
  const [porcentaje, setPorcentaje] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isv) {
      setNombre(isv.nombre);
      setPorcentaje(isv.porcentaje);
    }
  }, [isv]);

  const handleSave = async () => {
    const validationErrors = {};

    if (!nombre) {
      validationErrors.nombre = "El nombre es obligatorio";
    }

    if (!porcentaje) {
      validationErrors.porcentaje = "El porcentaje es obligatorio";
    }
    if (Object.keys(validationErrors).length === 0) {
      try {
        setLoading(true);
        if (isv) {
          await api.post("/maintenance/updateISV", {
            isv_id: isv.isv_id,
            nombre,
            porcentaje,
          });
          GlobalAlert.showSuccess("ISV actualizado correctamente");
        } else {
          await api.post("/maintenance/createISV", {
            nombre,
            porcentaje,
          });
          GlobalAlert.showSuccess("ISV creado correctamente");
        }
        setReload(true);
        onClose();
      } catch (error) {
        const response = error.response?.data ?? null;
        if (response) {
          GlobalAlert.showError("Error guardando ISV", response.message);
        } else {
          GlobalAlert.showError("Error guardando ISV", error.message);
        }
      } finally {
        setLoading(false);
      }
    } else {
      setErrors(validationErrors);
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
          error={Boolean(errors.nombre)}
          helperText={errors.nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Porcentaje"
          type="number"
          fullWidth
          value={porcentaje}
          error={Boolean(errors.porcentaje)}
          helperText={errors.porcentaje}
          onChange={(e) => setPorcentaje(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancelar
        </Button> 
        <LoadingButton
          onClick={handleSave}
          loading={loading}               
          color="primary"
        >
          Guardar
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default ModalISV;
