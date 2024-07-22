import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import api from "../axiosConfig";
import GlobalAlert from "../GlobalAlert";

const ModalUnidadMedida = ({ open, onClose, unidadMedida, setReload }) => {
  const [nombre, setNombre] = useState("");
  const [siglas, setSiglas] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (unidadMedida) {
      setNombre(unidadMedida.nombre);
      setSiglas(unidadMedida.siglas);
    }
  }, [unidadMedida]);

  const handleSave = async () => {
    const validationErrors = {};

    if (!nombre) {
      validationErrors.nombre = "El nombre es obligatorio";
    }

    if (!siglas) {
      validationErrors.siglas = "El siglas es obligatorio";
    }

    if (Object.keys(validationErrors).length === 0) {
      try {
        setLoading(true);
        let path = unidadMedida
        ? "/maintenance/updateUnidadMedida"
        : "/maintenance/createUnidadMedida";
        const payload = {
          unidad_medida_id: unidadMedida?.unidad_medida_id,
          nombre,
          siglas,
        };
        const response = await api.post(path, payload);
        if (response.data.status) {
          onClose();
          setReload(true);
          if (!unidadMedida) {
            GlobalAlert.showSuccess("Registro creado correctamente");
          } else {
            GlobalAlert.showSuccess("Registro actualizado correctamente");
          }
        } else {
          GlobalAlert.showErrorModal("Error: ", response.data.message);
        }
      } catch (error) {
        const response = error.response?.data ?? null;
        if (response) {
          GlobalAlert.showError(
            "Error guardando unidad de medida",
            response.message
          );
        } else {
          GlobalAlert.showError(
            "Error guardando unidad de medida",
            error.message
          );
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
      <DialogTitle>
        {unidadMedida ? "Editar Unidad de Medida" : "Crear Unidad de Medida"}
      </DialogTitle>
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
          label="Siglas"
          type="text"
          fullWidth
          value={siglas}
          error={Boolean(errors.siglas)}
          helperText={errors.siglas}
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
