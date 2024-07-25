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
  FormControlLabel,
  Switch,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import api from "../../components/axiosConfig";
import GlobalAlert from "../../components/GlobalAlert";

const ModalProducto = ({ open, handleClose, producto, setReload }) => {
  const [codigoInterno, setCodigoInterno] = useState("");
  const [tipoProductoId, setTipoProductoId] = useState("");
  const [unidadMedidaId, setUnidadMedidaId] = useState("");
  const [isvId, setIsvId] = useState("");
  const [especificaciones, setEspecificaciones] = useState("");
  const [foto, setFoto] = useState("");
  const [exento, setExento] = useState(false);
  const [costoPromedio, setCostoPromedio] = useState("");
  const [precioSinImpuesto, setPrecioSinImpuesto] = useState("");
  const [precioConImpuesto, setPrecioConImpuesto] = useState("");
  const [aplicaDescuento, setAplicaDescuento] = useState(false);
  const [porcentajeComision, setPorcentajeComision] = useState("");
  const [existenciaGlobal, setExistenciaGlobal] = useState("");
  const [stockMinimo, setStockMinimo] = useState("");
  const [estado, setEstado] = useState(true);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (producto !== null && producto !== undefined) {
      setCodigoInterno(producto.codigo_interno);
      setTipoProductoId(producto.tipo_producto_id);
      setUnidadMedidaId(producto.unidad_medida_id);
      setIsvId(producto.isv_id);
      setEspecificaciones(producto.especificaciones);
      setFoto(producto.foto);
      setExento(producto.exento);
      setCostoPromedio(producto.costo_promedio);
      setPrecioSinImpuesto(producto.precio_sin_impuesto);
      setPrecioConImpuesto(producto.precio_con_impuesto);
      setAplicaDescuento(producto.aplica_descuento);
      setPorcentajeComision(producto.porcentaje_comision);
      setExistenciaGlobal(producto.existencia_global);
      setStockMinimo(producto.stock_minimo);
      setEstado(producto.estado);
    } else {
      setCodigoInterno("");
      setTipoProductoId("");
      setUnidadMedidaId("");
      setIsvId("");
      setEspecificaciones("");
      setFoto("");
      setExento(false);
      setCostoPromedio("");
      setPrecioSinImpuesto("");
      setPrecioConImpuesto("");
      setAplicaDescuento(false);
      setPorcentajeComision("");
      setExistenciaGlobal("");
      setStockMinimo("");
      setEstado(true);
    }
  }, [producto]);

  const handleSubmit = async () => {
    const validationErrors = {};

    if (!codigoInterno) {
      validationErrors.codigo_interno = "El código interno es obligatorio";
    }
    if (!tipoProductoId) {
      validationErrors.tipo_producto_id = "El tipo de producto es obligatorio";
    }
    if (!unidadMedidaId) {
      validationErrors.unidad_medida_id = "La unidad de medida es obligatoria";
    }
    if (!isvId) {
      validationErrors.isv_id = "El ISV es obligatorio";
    }
    if (!especificaciones) {
      validationErrors.especificaciones =
        "Las especificaciones son obligatorias";
    }
    if (!foto) {
      validationErrors.foto = "La foto es obligatoria";
    }
    if (!costoPromedio) {
      validationErrors.costo_promedio = "El costo promedio es obligatorio";
    }
    if (!precioSinImpuesto) {
      validationErrors.precio_sin_impuesto =
        "El precio sin impuesto es obligatorio";
    }
    if (!precioConImpuesto) {
      validationErrors.precio_con_impuesto =
        "El precio con impuesto es obligatorio";
    }
    if (!porcentajeComision) {
      validationErrors.porcentaje_comision =
        "El porcentaje de comisión es obligatorio";
    }
    if (!existenciaGlobal) {
      validationErrors.existencia_global =
        "La existencia global es obligatoria";
    }
    if (!stockMinimo) {
      validationErrors.stock_minimo = "El stock mínimo es obligatorio";
    }

    if (Object.keys(validationErrors).length === 0) {
      try {
        setLoading(true);
        let path = producto
          ? "/maintenance/updateProducto"
          : "/maintenance/createProducto";
        const payload = {
          producto_id: producto?.producto_id,
          codigo_interno: codigoInterno,
          tipo_producto_id: tipoProductoId,
          unidad_medida_id: unidadMedidaId,
          isv_id: isvId,
          especificaciones,
          foto,
          exento,
          costo_promedio: parseFloat(costoPromedio) || null,
          precio_sin_impuesto: parseFloat(precioSinImpuesto) || null,
          precio_con_impuesto: parseFloat(precioConImpuesto) || null,
          aplica_descuento,
          porcentaje_comision: parseFloat(porcentajeComision) || null,
          existencia_global: parseFloat(existenciaGlobal) || null,
          stock_minimo: parseFloat(stockMinimo) || null,
          estado,
        };

        const response = await api.post(path, payload);
        if (response.data.status) {
          handleClose();
          setReload(true);
          if (!producto) {
            GlobalAlert.showSuccess("Registro creado correctamente");
          } else {
            GlobalAlert.showSuccess("Registro actualizado correctamente");
          }
        } else {
          GlobalAlert.showError("Error", response.data.message);
        }
      } catch (error) {
        let response = error.response?.data ?? null;
        if (response) {
          GlobalAlert.showError("Error", response.message);
        } else {
          GlobalAlert.showError("Error", error.message);
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
        {producto ? "Editar Producto" : "Crear Producto"}
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Código Interno"
              value={codigoInterno}
              onChange={(e) => setCodigoInterno(e.target.value)}
              error={Boolean(errors.codigo_interno)}
              helperText={errors.codigo_interno}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Tipo Producto ID"
              value={tipoProductoId}
              onChange={(e) => setTipoProductoId(e.target.value)}
              error={Boolean(errors.tipo_producto_id)}
              helperText={errors.tipo_producto_id}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Unidad Medida ID"
              value={unidadMedidaId}
              onChange={(e) => setUnidadMedidaId(e.target.value)}
              error={Boolean(errors.unidad_medida_id)}
              helperText={errors.unidad_medida_id}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="ISV ID"
              value={isvId}
              onChange={(e) => setIsvId(e.target.value)}
              error={Boolean(errors.isv_id)}
              helperText={errors.isv_id}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Especificaciones"
              value={especificaciones}
              onChange={(e) => setEspecificaciones(e.target.value)}
              error={Boolean(errors.especificaciones)}
              helperText={errors.especificaciones}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Foto"
              value={foto}
              onChange={(e) => setFoto(e.target.value)}
              error={Boolean(errors.foto)}
              helperText={errors.foto}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={exento}
                  onChange={(e) => setExento(e.target.checked)}
                  name="exento"
                  color="primary"
                />
              }
              label="Exento"
              sx={{ mt: 2 }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Costo Promedio"
              value={costoPromedio}
              onChange={(e) => setCostoPromedio(e.target.value)}
              error={Boolean(errors.costo_promedio)}
              helperText={errors.costo_promedio}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Precio Sin Impuesto"
              value={precioSinImpuesto}
              onChange={(e) => setPrecioSinImpuesto(e.target.value)}
              error={Boolean(errors.precio_sin_impuesto)}
              helperText={errors.precio_sin_impuesto}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Precio Con Impuesto"
              value={precioConImpuesto}
              onChange={(e) => setPrecioConImpuesto(e.target.value)}
              error={Boolean(errors.precio_con_impuesto)}
              helperText={errors.precio_con_impuesto}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={aplicaDescuento}
                  onChange={(e) => setAplicaDescuento(e.target.checked)}
                  name="aplica_descuento"
                  color="primary"
                />
              }
              label="Aplica Descuento"
              sx={{ mt: 2 }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Porcentaje Comision"
              value={porcentajeComision}
              onChange={(e) => setPorcentajeComision(e.target.value)}
              error={Boolean(errors.porcentaje_comision)}
              helperText={errors.porcentaje_comision}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Existencia Global"
              value={existenciaGlobal}
              onChange={(e) => setExistenciaGlobal(e.target.value)}
              error={Boolean(errors.existencia_global)}
              helperText={errors.existencia_global}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Stock Mínimo"
              value={stockMinimo}
              onChange={(e) => setStockMinimo(e.target.value)}
              error={Boolean(errors.stock_minimo)}
              helperText={errors.stock_minimo}
            />
          </Grid>
          {producto && (
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={estado}
                    onChange={(e) => setEstado(e.target.checked)}
                    name="estado"
                    color="primary"
                  />
                }
                label={estado ? "Activo" : "Inactivo"}
                sx={{ mt: 2 }}
              />
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancelar
        </Button>
        <LoadingButton onClick={handleSubmit} color="primary" loading={loading}>
          {producto ? "Actualizar" : "Crear"}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default ModalProducto;
