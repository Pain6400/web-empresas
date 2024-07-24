import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Box,
  Divider,
  Grid,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import api from "../../components/axiosConfig";
import GlobalAlert from "../../components/GlobalAlert";

const ModalClasificacionProducto = ({ open, handleClose, clasificacionProducto, setReload }) => {
  const [nombre, setNombre] = useState("");
  const [porcentajeTerceraEdad, setPorcentajeTerceraEdad] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (clasificacionProducto !== null && clasificacionProducto !== undefined) {
      setNombre(clasificacionProducto.nombre);
      setPorcentajeTerceraEdad(clasificacionProducto.porcentaje_tercera_edad);
    } else {
      setNombre("");
      setPorcentajeTerceraEdad("");
    }
  }, [clasificacionProducto]);

  const handleSubmit = async () => {
    const validationErrors = {};

    if (!nombre) {
      validationErrors.nombre = "El nombre es obligatorio";
    }
    if (porcentajeTerceraEdad === "" || isNaN(porcentajeTerceraEdad)) {
      validationErrors.porcentajeTerceraEdad = "El porcentaje tercera edad debe ser un número válido";
    }

    if (Object.keys(validationErrors).length === 0) {
      try {
        setLoading(true);
        let path = clasificacionProducto
          ? "/maintenance/updateClasificacionProducto"
          : "/maintenance/createClasificacionProducto";
        const payload = {
          clasificacion_producto_id: clasificacionProducto?.clasificacion_producto_id,
          nombre,
          porcentaje_tercera_edad: parseFloat(porcentajeTerceraEdad),
        };

        const response = await api.post(path, payload);
        if (response.data.status) {
          handleClose();
          setReload(true);
          if (!clasificacionProducto) {
            GlobalAlert.showSuccess("Registro creado correctamente");
          } else {
            GlobalAlert.showSuccess("Registro actualizado correctamente");
          }
        } else {
          GlobalAlert.showErrorModal("Error: ", response.data.message);
        }
      } catch (error) {
        let response = error.response?.data ?? null;
        if (response) {
          GlobalAlert.showErrorModal("Error: ", response.message);
        } else {
          GlobalAlert.showErrorModal("Error: ", error);
        }
      } finally {
        setLoading(false);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {clasificacionProducto ? "Editar Clasificación de Producto" : "Nueva Clasificación de Producto"}
      </DialogTitle>
    <Divider />
      <DialogContent>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                fullWidth
                error={Boolean(errors.nombre)}
                helperText={errors.nombre}
                sx={{ mt: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Porcentaje Tercera Edad"
                value={porcentajeTerceraEdad}
                onChange={(e) => setPorcentajeTerceraEdad(e.target.value)}
                fullWidth
                error={Boolean(errors.porcentajeTerceraEdad)}
                helperText={errors.porcentajeTerceraEdad}
                sx={{ mt: 2 }}
              />
            </Grid>
          </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancelar
        </Button> 
        <LoadingButton
          onClick={handleSubmit}
          loading={loading}               
          color="primary"
        >
          Guardar
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default ModalClasificacionProducto;
