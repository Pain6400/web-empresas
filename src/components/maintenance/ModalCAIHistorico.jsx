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
import Switch from "@mui/material/Switch";

const ModalCAIHistorico = ({ open, handleClose, cai, setReload }) => {
  const [formData, setFormData] = useState({
    cai: "",
    factura_desde: "",
    factura_hasta: "",
    ultima_factura_generada: "",
    fecha_vigencia: "",
    estado: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cai !== null && cai !== undefined) {
      setFormData({
        cai: cai.cai,
        factura_desde: cai.factura_desde,
        factura_hasta: cai.factura_hasta,
        ultima_factura_generada: cai.ultima_factura_generada,
        fecha_vigencia: cai.fecha_vigencia,
        estado: cai.estado == '1',
      });
    } else {
      setFormData({
        cai: "",
        factura_desde: "",
        factura_hasta: "",
        ultima_factura_generada: "",
        fecha_vigencia: "",
        estado: false,
      });
    }
  }, [cai]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (e) => {
    setFormData((prev) => ({ ...prev, estado: e.target.checked }));
  };

  const handleSubmit = async () => {
    const validationErrors = {};

    if (!formData.cai) {
      validationErrors.cai = "El CAI es obligatorio";
    }
    if (!formData.factura_desde) {
      validationErrors.factura_desde = "La factura desde es obligatoria";
    }
    if (!formData.factura_hasta) {
      validationErrors.factura_hasta = "La factura hasta es obligatoria";
    }
    if (!formData.ultima_factura_generada) {
      validationErrors.ultima_factura_generada = "La última factura generada es obligatoria";
    }
    if (!formData.fecha_vigencia) {
      validationErrors.fecha_vigencia = "La fecha de vigencia es obligatoria";
    }

    if (Object.keys(validationErrors).length === 0) {
      try {
        setLoading(true);
        let path = cai
          ? "/maintenance/updateCAIHistorico"
          : "/maintenance/createCAIHistorico";
        const payload = {
          ...formData,
          estado: formData.estado ? '1' : '0',
        };

        const response = await api.post(path, payload);
        if (response.data.status) {
          handleClose();
          setReload(true);
          if (!cai) {
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
        {cai ? "Editar CAI Histórico" : "Nuevo CAI Histórico"}
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="CAI"
              name="cai"
              value={formData.cai}
              onChange={handleChange}
              fullWidth
              error={Boolean(errors.cai)}
              helperText={errors.cai}
              sx={{ mt: 2 }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Factura Desde"
              name="factura_desde"
              value={formData.factura_desde}
              onChange={handleChange}
              fullWidth
              type="number"
              error={Boolean(errors.factura_desde)}
              helperText={errors.factura_desde}
              sx={{ mt: 2 }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Factura Hasta"
              name="factura_hasta"
              value={formData.factura_hasta}
              onChange={handleChange}
              fullWidth
              type="number"
              error={Boolean(errors.factura_hasta)}
              helperText={errors.factura_hasta}
              sx={{ mt: 2 }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Última Factura Generada"
              name="ultima_factura_generada"
              type="number"
              value={formData.ultima_factura_generada}
              onChange={handleChange}
              fullWidth
              error={Boolean(errors.ultima_factura_generada)}
              helperText={errors.ultima_factura_generada}
              sx={{ mt: 2 }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Fecha Vigencia"
              name="fecha_vigencia"
              value={formData.fecha_vigencia}
              onChange={handleChange}
              fullWidth
              error={Boolean(errors.fecha_vigencia)}
              helperText={errors.fecha_vigencia}
              sx={{ mt: 2 }}
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ mt: 2 }}>
              <Switch
                checked={formData.estado}
                onChange={handleSwitchChange}
                name="estado"
                color="primary"
              />
              Estado
            </Box>
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

export default ModalCAIHistorico;
