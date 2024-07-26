import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  FormControl,
  Divider,
  Grid,
  FormControlLabel,
  Switch,
  Paper,
  Typography,
  CircularProgress,
  Select,
  InputLabel,
  MenuItem
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import api from "../../components/axiosConfig";
import GlobalAlert from "../../components/GlobalAlert";
import { useDropzone } from 'react-dropzone';
import { styled } from '@mui/system';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const DropzoneContainer = styled(Paper)(({ theme }) => ({
  border: '2px dashed #ccc',
  padding: theme.spacing(3),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  }
}));

const ImagePreview = styled('img')(({ theme }) => ({
  maxWidth: '100%',
  maxHeight: '200px',
  marginTop: theme.spacing(2),
}));

const ModalProducto = ({ open, handleClose, producto, setReload }) => {
  const [codigoInterno, setCodigoInterno] = useState("");
  const [tipoProductoId, setTipoProductoId] = useState("");
  const [unidadMedidaId, setUnidadMedidaId] = useState("");
  const [isvId, setIsvId] = useState("");
  const [especificaciones, setEspecificaciones] = useState("");
  const [nombre, setNombre] = useState("");
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
  const [unidadesMedidas, setUnidadesMedidas] = useState([]);
  const [tipoProductos, setTipoProductos] = useState([]);
  const [ISVs, setISVs] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const base64ToBlob = (base64, mimeType) => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  };

  const fetchProducto = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/maintenance/getFotoProducto/${producto.producto_id}`);
      const base64String = response.data.foto;

      if (base64String) {
        const blob = base64ToBlob(base64String, 'image/jpeg');
        const previewUrl = URL.createObjectURL(blob);
        const file = new File([blob], "image.jpg", { type: "image/jpeg" });
        setFoto(Object.assign(file, { preview: previewUrl }));
      } else {
        setFoto(null);
      }
    } catch (error) {
      console.error('Error al cargar el producto:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (producto !== null && producto !== undefined) {
      setCodigoInterno(producto.codigo_interno);
      setTipoProductoId(producto.tipo_producto_id);
      setUnidadMedidaId(producto.unidad_medida_id);
      setIsvId(producto.isv_id);
      setEspecificaciones(producto.especificaciones);
      setNombre(producto.nombre);
      setFoto(producto.foto);
      setExento(!!parseInt(producto.exento, 10));
      setCostoPromedio(producto.costo_promedio);
      setPrecioSinImpuesto(producto.precio_sin_impuesto);
      setPrecioConImpuesto(producto.precio_con_impuesto);
      setAplicaDescuento(!!parseInt(producto.aplica_descuento, 10));
      setPorcentajeComision(producto.porcentaje_comision);
      setExistenciaGlobal(producto.existencia_global);
      setStockMinimo(producto.stock_minimo);
      setEstado(!!parseInt(producto.estado, 10));
      fetchProducto();
    } else {
      setCodigoInterno("");
      setTipoProductoId("");
      setNombre("");
      setUnidadMedidaId("");
      setIsvId("");
      setEspecificaciones("");
      setFoto(null);
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

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: acceptedFiles => {
      setFoto(Object.assign(acceptedFiles[0], {
        preview: URL.createObjectURL(acceptedFiles[0])
      }));
    },
  });

  useEffect(() => {
    const fetchUnidadesMedidas = async () => {
      try {
        const response = await api.get(`maintenance/getUnidadesMedidas`);
        setUnidadesMedidas(response.data.unidadesMedida);
      } catch (error) {
        console.error("Error fetching departamentos: ", error);
      }
    };

    const fetchTiposProductos = async () => {
      try {
        const response = await api.get(`maintenance/getTipoProductos`);
        setTipoProductos(response.data.tipoProducto);
      } catch (error) {
        console.error("Error fetching departamentos: ", error);
      }
    };

    const fetchIsvs = async () => {
      try {
        const response = await api.get(`maintenance/getISVs`);
        setISVs(response.data.isvs);
      } catch (error) {
        console.error("Error fetching departamentos: ", error);
      }
    };

    fetchUnidadesMedidas();
    fetchTiposProductos();
    fetchIsvs();
  }, []);


  const handleSubmit = async () => {
    const validationErrors = {};

    if (!codigoInterno) {
      validationErrors.codigo_interno = "El código interno es obligatorio";
    }
    if (!tipoProductoId) {
      validationErrors.tipo_producto_id = "El tipo de producto es obligatorio";
    }
    if (!nombre) {
      validationErrors.nombre = "El nombre   de producto es obligatorio";
    }
    if (!unidadMedidaId) {
      validationErrors.unidad_medida_id = "La unidad de medida es obligatoria";
    }
    if (!isvId) {
      validationErrors.isv_id = "El ISV es obligatorio";
    }
    if (!foto) {
      validationErrors.foto  = "Foto es obligatorio";
    }
    if (!especificaciones) {
      validationErrors.especificaciones =
        "Las especificaciones son obligatorias";
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
        const formData = new FormData();
        console.log(foto)
        formData.append("producto_id", producto?.producto_id);
        formData.append("codigo_interno", codigoInterno);
        formData.append("tipo_producto_id", tipoProductoId);
        formData.append("nombre", nombre);
        formData.append("unidad_medida_id", unidadMedidaId);
        formData.append("isv_id", isvId);
        formData.append("especificaciones", especificaciones);
        formData.append("foto", foto);
        formData.append("exento", exento);
        formData.append("costo_promedio", costoPromedio);
        formData.append("precio_sin_impuesto", precioSinImpuesto);
        formData.append("precio_con_impuesto", precioConImpuesto);
        formData.append("aplica_descuento", aplicaDescuento);
        formData.append("porcentaje_comision", porcentajeComision);
        formData.append("existencia_global", existenciaGlobal);
        formData.append("stock_minimo", stockMinimo);
        formData.append("estado", estado);

        const response = await api.post(producto ? "/maintenance/updateProducto" : "/maintenance/createProducto", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.data.status) {
          handleClose();
          setReload(true);
          GlobalAlert.showSuccess(producto ? "Registro actualizado correctamente" : "Registro creado correctamente");
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
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Código Interno"
              value={codigoInterno}
              onChange={(e) => setCodigoInterno(e.target.value)}
              error={Boolean(errors.codigo_interno)}
              helperText={errors.codigo_interno}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={Boolean(errors.tipo_producto_id)}>
                <InputLabel id="tipoProductoId-label">Tipo de Producto</InputLabel>
                <Select
                  labelId="tipoProductoId-label"
                  value={tipoProductoId}
                  onChange={(e) => setTipoProductoId(e.target.value)}
                  label="Tipo de Producto"
                >
                  {tipoProductos.map((tipoProducto) => (
                    <MenuItem key={tipoProducto.tipo_producto_id} value={tipoProducto.tipo_producto_id}>
                      {tipoProducto.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={Boolean(errors.unidad_medida_id)}>
                <InputLabel id="unidadMedidaId-label">Unidad de Medida</InputLabel>
                <Select
                  labelId="unidadMedidaId-label"
                  value={unidadMedidaId}
                  onChange={(e) => setUnidadMedidaId(e.target.value)}
                  label="Unidad de Medida"
                >
                  {unidadesMedidas.map((unidadMedida) => (
                    <MenuItem key={unidadMedida.unidad_medida_id} value={unidadMedida.unidad_medida_id}>
                      {unidadMedida.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={Boolean(errors.isv_id)}>
                <InputLabel id="isvId-label">ISV</InputLabel>
                <Select
                  labelId="isvId-label"
                  value={isvId}
                  onChange={(e) => setIsvId(e.target.value)}
                  label="ISV"
                >
                  {ISVs.map((isv) => (
                    <MenuItem key={isv.isv_id} value={isv.isv_id}>
                      {isv.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Especificaciones"
              value={especificaciones}
              onChange={(e) => setEspecificaciones(e.target.value)}
              error={Boolean(errors.especificaciones)}
              helperText={errors.especificaciones}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              error={Boolean(errors.nombre)}
              helperText={errors.nombre}
            />
          </Grid>
          <Grid item xs={12}>
          <DropzoneContainer {...getRootProps()}>
              <input {...getInputProps()} />
              {isLoading ? (
                <CircularProgress />
              ) : (
                <>
                  <CloudUploadIcon fontSize="large" />
                  <Typography variant="body1">
                    {foto ? foto.name : "Arrastra y suelta una imagen aquí, o haz clic para seleccionar una"}
                  </Typography>
                  {foto && <ImagePreview src={foto.preview} alt="Vista previa de la imagen" />}
                </>
              )}
            </DropzoneContainer>
            {errors.foto && (
              <Typography color="error" variant="body2">
                {errors.foto}
              </Typography>
            )}
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
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Costo Promedio"
              value={costoPromedio}
              onChange={(e) => setCostoPromedio(e.target.value)}
              error={Boolean(errors.costo_promedio)}
              helperText={errors.costo_promedio}
              type="number"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Precio Sin Impuesto"
              value={precioSinImpuesto}
              onChange={(e) => setPrecioSinImpuesto(e.target.value)}
              error={Boolean(errors.precio_sin_impuesto)}
              helperText={errors.precio_sin_impuesto}
              type="number"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Precio Con Impuesto"
              value={precioConImpuesto}
              onChange={(e) => setPrecioConImpuesto(e.target.value)}
              error={Boolean(errors.precio_con_impuesto)}
              helperText={errors.precio_con_impuesto}
              type="number"
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
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Porcentaje Comision"
              value={porcentajeComision}
              onChange={(e) => setPorcentajeComision(e.target.value)}
              error={Boolean(errors.porcentaje_comision)}
              helperText={errors.porcentaje_comision}
              type="number"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Existencia Global"
              value={existenciaGlobal}
              onChange={(e) => setExistenciaGlobal(e.target.value)}
              error={Boolean(errors.existencia_global)}
              helperText={errors.existencia_global}
              type="number"
            />
          </Grid>
          <Grid item xs={6}>
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
