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

const ModalProveedor = ({ open, handleClose, proveedor, setReload }) => {
  const [codigoInterno, setCodigoInterno] = useState("");
  const [nombre, setNombre] = useState("");
  const [proveedorTipo, setProveedorTipo] = useState("");
  const [rtn, setRtn] = useState("");
  const [numeroIdentidad, setNumeroIdentidad] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [correoElectronico, setCorreoElectronico] = useState("");
  const [nombreContacto, setNombreContacto] = useState("");
  const [formaPago, setFormaPago] = useState("");
  const [saldo, setSaldo] = useState("");
  const [limiteCredito, setLimiteCredito] = useState("");
  const [estado, setEstado] = useState(false);
  const [comentarios, setComentarios] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (proveedor) {
      setCodigoInterno(proveedor.codigo_interno);
      setNombre(proveedor.nombre);
      setProveedorTipo(proveedor.proveedor_tipo);
      setRtn(proveedor.rtn);
      setNumeroIdentidad(proveedor.numero_identidad);
      setTelefono(proveedor.telefono);
      setDireccion(proveedor.direccion);
      setCorreoElectronico(proveedor.correo_electronico);
      setNombreContacto(proveedor.nombre_contacto);
      setFormaPago(proveedor.forma_pago);
      setSaldo(proveedor.saldo);
      setLimiteCredito(proveedor.limite_credito);
      setEstado(proveedor.estado);
      setComentarios(proveedor.comentarios);
    } else {
      setCodigoInterno("");
      setNombre("");
      setProveedorTipo("");
      setRtn("");
      setNumeroIdentidad("");
      setTelefono("");
      setDireccion("");
      setCorreoElectronico("");
      setNombreContacto("");
      setFormaPago("");
      setSaldo("");
      setLimiteCredito("");
      setEstado(false);
      setComentarios("");
    }
  }, [proveedor]);

  const handleSubmit = async () => {
    const validationErrors = {};
    if (!codigoInterno)
      validationErrors.codigoInterno = "El código interno es obligatorio";
    if (!nombre) validationErrors.nombre = "El nombre es obligatorio";
    if (!proveedorTipo)
      validationErrors.proveedorTipo = "El tipo de proveedor es obligatorio";
    if (!rtn) validationErrors.rtn = "El RTN es obligatorio";
    if (!numeroIdentidad)
      validationErrors.numeroIdentidad =
        "El número de identidad es obligatorio";
    if (!telefono) validationErrors.telefono = "El teléfono es obligatorio";
    if (!direccion) validationErrors.direccion = "La dirección es obligatoria";
    if (!correoElectronico)
      validationErrors.correoElectronico =
        "El correo electrónico es obligatorio";
    if (!nombreContacto)
      validationErrors.nombreContacto = "El nombre de contacto es obligatorio";

    if (Object.keys(validationErrors).length === 0) {
      try {
        setLoading(true);
        let path = proveedor
          ? "/maintenance/updateProveedor"
          : "/maintenance/createProveedor";
        const payload = {
          proveedor_id: proveedor?.proveedor_id,
          codigo_interno: codigoInterno,
          nombre,
          proveedor_tipo: proveedorTipo,
          rtn,
          numero_identidad: numeroIdentidad,
          telefono,
          direccion,
          correo_electronico: correoElectronico,
          nombre_contacto: nombreContacto,
          forma_pago:  formaPago !== '' ? parseFloat(formaPago) : null,
          saldo: saldo !== '' ? parseFloat(saldo) : null,
          limite_credito: limiteCredito !== '' ? parseFloat(limiteCredito) : null,
          estado: estado === true ? '1' : '0',
          comentarios: comentarios || null,
        };
        console.log(payload)
        const response = await api.post(path, payload);
        if (response.data.status) {
          handleClose();
          setReload(true);
          if (!proveedor) {
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
        {proveedor ? "Editar Proveedor" : "Nuevo Proveedor"}
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Código Interno"
              value={codigoInterno}
              onChange={(e) => setCodigoInterno(e.target.value)}
              fullWidth
              error={Boolean(errors.codigoInterno)}
              helperText={errors.codigoInterno}
              sx={{ mt: 2 }}
            />
          </Grid>
          <Grid item xs={6}>
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
          <Grid item xs={6}>
            <TextField
              label="Tipo de Proveedor"
              value={proveedorTipo}
              onChange={(e) => setProveedorTipo(e.target.value)}
              fullWidth
              error={Boolean(errors.proveedorTipo)}
              helperText={errors.proveedorTipo}
              sx={{ mt: 2 }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="RTN"
              value={rtn}
              onChange={(e) => setRtn(e.target.value)}
              fullWidth
              error={Boolean(errors.rtn)}
              helperText={errors.rtn}
              sx={{ mt: 2 }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Número de Identidad"
              value={numeroIdentidad}
              onChange={(e) => setNumeroIdentidad(e.target.value)}
              fullWidth
              error={Boolean(errors.numeroIdentidad)}
              helperText={errors.numeroIdentidad}
              sx={{ mt: 2 }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Teléfono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              fullWidth
              error={Boolean(errors.telefono)}
              helperText={errors.telefono}
              sx={{ mt: 2 }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Dirección"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              fullWidth
              error={Boolean(errors.direccion)}
              helperText={errors.direccion}
              sx={{ mt: 2 }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Correo Electrónico"
              value={correoElectronico}
              onChange={(e) => setCorreoElectronico(e.target.value)}
              fullWidth
              error={Boolean(errors.correoElectronico)}
              helperText={errors.correoElectronico}
              sx={{ mt: 2 }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Nombre de Contacto"
              value={nombreContacto}
              onChange={(e) => setNombreContacto(e.target.value)}
              fullWidth
              error={Boolean(errors.nombreContacto)}
              helperText={errors.nombreContacto}
              sx={{ mt: 2 }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Forma de Pago"
              value={formaPago}
              onChange={(e) => setFormaPago(e.target.value)}
              fullWidth
              sx={{ mt: 2 }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Saldo"
              value={saldo}
              onChange={(e) => setSaldo(e.target.value)}
              fullWidth
              sx={{ mt: 2 }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Límite de Crédito"
              value={limiteCredito}
              onChange={(e) => setLimiteCredito(e.target.value)}
              fullWidth
              sx={{ mt: 2 }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Comentarios"
              value={comentarios}
              onChange={(e) => setComentarios(e.target.value)}
              fullWidth
              sx={{ mt: 2 }}
            />
          </Grid>
          {proveedor && (
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
        <LoadingButton onClick={handleSubmit} loading={loading} color="primary">
          Guardar
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default ModalProveedor;
