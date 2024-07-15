import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Divider, FormControl, Switch, Grid, InputLabel, Select, MenuItem } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import api from '../../components/axiosConfig';
import GlobalAlert from '../../components/GlobalAlert';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '60%',
    maxHeight: '90%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 3,
    overflow: 'auto',
  };

const ModalCliente = ({ open, handleClose, cliente, setReload }) => {
    const [codigo_interno, setCodigo_interno] = useState('');
    const [tipo_cliente, setTipo_cliente] = useState('');
    const [forma_pago, setForma_pago] = useState('');
    const [numero_identidad, setNumero_identidad] = useState('');
    const [rtn, setRtn] = useState('');
    const [primer_nombre, setPrimer_nombre] = useState('');
    const [segundo_nombre, setSegundo_nombre] = useState('');
    const [primer_apellido, setPrimer_apellido] = useState('');
    const [segundo_apellido, setSegundo_apellido] = useState('');
    const [pais_id, setPais_id] = useState('');
    const [departamento_id, setDepartamento_id] = useState('');
    const [municipio_id, setMunicipio_id] = useState('');
    const [direccion, setDireccion] = useState('');
    const [telefono, setTelefono] = useState('');
    const [correo, setCorreo] = useState('');
    const [saldo, setSaldo] = useState('');
    const [limite_credito, setLimite_credito] = useState('');
    const [estado, setEstado] = useState(false);
    const [comentario, setComentario] = useState('');
    const [fecha_creo, setFecha_creo] = useState('');
    const [usuario_creo, setUsuario_creo] = useState('');
    const [fecha_modifico, setFecha_modifico] = useState('');
    const [usuario_modifico, setUsuario_modifico] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const [paises, setPaises] = useState([]);
    const [departamentos, setDepartamentos] = useState([]);
    const [municipios, setMunicipios] = useState([]);

    const tipos = [
      {
        tipo_cliente: 'N',
        nombre: 'Natural'
      },
      {
        tipo_cliente: 'J',
        nombre: 'Judicial'
      }
    ];
  
    useEffect(() => {
        if (cliente !== null && cliente !== undefined) {
            console.log(cliente, 'test')
            setCodigo_interno(cliente.codigo_interno);
            setTipo_cliente(cliente.tipo_cliente);
            setForma_pago(cliente.forma_pago);
            setNumero_identidad(cliente.numero_identidad);
            setRtn(cliente.rtn);
            setPrimer_nombre(cliente.primer_nombre);
            setSegundo_nombre(cliente.segundo_nombre);
            setPrimer_apellido(cliente.primer_apellido);
            setSegundo_apellido(cliente.segundo_apellido);
            setPais_id(cliente.pais_id);
            setDepartamento_id(cliente.departamento_id);
            setMunicipio_id(cliente.municipio_id);
            setDireccion(cliente.direccion);
            setTelefono(cliente.telefono);
            setCorreo(cliente.correo);
            setSaldo(cliente.saldo);
            setLimite_credito(cliente.limite_credito);
            setEstado(!!parseInt(cliente.estado, 10));
            setComentario(cliente.comentario);
            setFecha_creo(cliente.fecha_creo);
            setUsuario_creo(cliente.usuario_creo);
            setFecha_modifico(cliente.fecha_modifico);
            setUsuario_modifico(cliente.usuario_modifico);
        } else {
            setCodigo_interno('');
            setTipo_cliente('');
            setForma_pago('');
            setNumero_identidad('');
            setRtn('');
            setPrimer_nombre('');
            setSegundo_nombre('');
            setPrimer_apellido('');
            setSegundo_apellido('');
            setPais_id('');
            setDepartamento_id('');
            setMunicipio_id('');
            setDireccion('');
            setTelefono('');
            setCorreo('');
            setSaldo('');
            setLimite_credito('');
            setEstado(false);
            setComentario('');
            setFecha_creo('');
            setUsuario_creo('');
            setFecha_modifico('');
            setUsuario_modifico('');
        }
    }, [cliente]);

    useEffect(() => {
      const fetchPaises = async () => {
        try {
          const response = await api.get('/maintenance/getPaises');
          setPaises(response.data.paises);
        } catch (error) {
          console.error("Error fetching paises: ", error);
        }
      };
  
      fetchPaises();
    }, []);
  
    useEffect(() => {
      const fetchDepartamentos = async () => {
        try {
          if (pais_id) {
            const response = await api.get(`maintenance/getDepartamentos/${pais_id}`);
            setDepartamentos(response.data.departamentos);
            setMunicipios([]);
          }
        } catch (error) {
          console.error("Error fetching departamentos: ", error);
        }
      };
  
      fetchDepartamentos();
    }, [pais_id]);
  
    useEffect(() => {
      const fetchMunicipios = async () => {
        try {
          if (departamento_id) {
            const response = await api.get(`maintenance/getMunicipios/${pais_id}/${departamento_id}`);
            setMunicipios(response.data.municipios);
          }
        } catch (error) {
          console.error("Error fetching municipios: ", error);
        }
      };
  
      fetchMunicipios();
    }, [departamento_id]);

    const handleSubmit = async () => {
        const validationErrors = {};

        if (!codigo_interno) {
            validationErrors.codigo_interno = 'El código interno es obligatorio';
        }
        if (!tipo_cliente) {
            validationErrors.tipo_cliente = 'El tipo de cliente es obligatorio';
        }
        if (!forma_pago) {
            validationErrors.forma_pago = 'La forma de pago es obligatoria';
        }
        if (!numero_identidad) {
            validationErrors.numero_identidad = 'El número de identidad es obligatorio';
        }
        if (!rtn) {
            validationErrors.rtn = 'El RTN es obligatorio';
        }
        if (!primer_nombre) {
            validationErrors.primer_nombre = 'El primer nombre es obligatorio';
        }
        if (!primer_apellido) {
            validationErrors.primer_apellido = 'El primer apellido es obligatorio';
        }
        if (!pais_id) {
            validationErrors.pais_id = 'El ID del país es obligatorio';
        }
        if (!departamento_id) {
            validationErrors.departamento_id = 'El ID del departamento es obligatorio';
        }
        if (!municipio_id) {
            validationErrors.municipio_id = 'El ID del municipio es obligatorio';
        }
        if (!direccion) {
            validationErrors.direccion = 'La dirección es obligatoria';
        }
        if (!telefono) {
            validationErrors.telefono = 'El teléfono es obligatorio';
        }
        if (!correo) {
            validationErrors.correo = 'El correo es obligatorio';
        }
        if (!saldo) {
            validationErrors.saldo = 'El saldo es obligatorio';
        }
        if (!limite_credito) {
            validationErrors.limite_credito = 'El límite de crédito es obligatorio';
        }

        if (Object.keys(validationErrors).length === 0) {
            try {
                setLoading(true);
                let path = cliente ? '/maintenance/updateCliente' : '/maintenance/createCliente';
                const payload = {
                    codigo_interno,
                    tipo_cliente,
                    forma_pago,
                    numero_identidad,
                    rtn,
                    primer_nombre,
                    segundo_nombre,
                    primer_apellido,
                    segundo_apellido,
                    pais_id,
                    departamento_id,
                    municipio_id,
                    direccion,
                    telefono,
                    correo,
                    saldo,
                    limite_credito,
                    estado: estado === true ? '1' : '2',
                    comentario,
                    fecha_creo,
                    usuario_creo,
                    fecha_modifico,
                    usuario_modifico
                };

                const response = await api.post(path, payload);
                console.log(response)
                if (response.data.status) {
                    handleClose();
                    setReload(true)
                    GlobalAlert.showSuccess('Registro creado correctamente');
                } else {
                    GlobalAlert.showErrorModal('Error: ', response.data.message);
                }
            } catch (error) {
                let response = error.response?.data ?? null;
                if (response) {
                    GlobalAlert.showErrorModal('Error: ', response.message);
                } else {
                    GlobalAlert.showErrorModal('Error: ', error);
                }
            } finally {
                setLoading(false);
            }
        } else {
            setErrors(validationErrors);
        }
    };

    return (
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <h3>{cliente ? "Editar Cliente" : "Nuevo Cliente"}</h3>
          <Divider />

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Código Interno"
                value={codigo_interno}
                onChange={(e) => setCodigo_interno(e.target.value)}
                fullWidth
                error={Boolean(errors.codigo_interno)}
                helperText={errors.codigo_interno}
                sx={{ mt: 2 }}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Tipo Cliente</InputLabel>
                <Select
                  value={tipo_cliente}
                  onChange={(e) => setTipo_cliente(e.target.value)}
                  error={Boolean(errors.tipo_cliente)}
                >
                  {tipos.map((tipo) => (
                    <MenuItem key={tipo.tipo_cliente} value={tipo.tipo_cliente}>
                      {tipo.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Forma Pago"
                value={forma_pago}
                onChange={(e) => setForma_pago(e.target.value)}
                fullWidth
                error={Boolean(errors.forma_pago)}
                helperText={errors.forma_pago}
                sx={{ mt: 2 }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Número Identidad"
                value={numero_identidad}
                onChange={(e) => setNumero_identidad(e.target.value)}
                fullWidth
                error={Boolean(errors.numero_identidad)}
                helperText={errors.numero_identidad}
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
                label="Primer Nombre"
                value={primer_nombre}
                onChange={(e) => setPrimer_nombre(e.target.value)}
                fullWidth
                error={Boolean(errors.primer_nombre)}
                helperText={errors.primer_nombre}
                sx={{ mt: 2 }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Segundo Nombre"
                value={segundo_nombre}
                onChange={(e) => setSegundo_nombre(e.target.value)}
                fullWidth
                error={Boolean(errors.segundo_nombre)}
                helperText={errors.segundo_nombre}
                sx={{ mt: 2 }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Primer Apellido"
                value={primer_apellido}
                onChange={(e) => setPrimer_apellido(e.target.value)}
                fullWidth
                error={Boolean(errors.primer_apellido)}
                helperText={errors.primer_apellido}
                sx={{ mt: 2 }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Segundo Apellido"
                value={segundo_apellido}
                onChange={(e) => setSegundo_apellido(e.target.value)}
                fullWidth
                error={Boolean(errors.segundo_apellido)}
                helperText={errors.segundo_apellido}
                sx={{ mt: 2 }}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>País</InputLabel>
                <Select
                  value={pais_id}
                  onChange={(e) => setPais_id(e.target.value)}
                  error={Boolean(errors.pais_id)}
                >
                  {paises.map((pais) => (
                    <MenuItem key={pais.pais_id} value={pais.pais_id}>
                      {pais.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Departamento</InputLabel>
                <Select
                  value={departamento_id}
                  onChange={(e) => setDepartamento_id(e.target.value)}
                  error={Boolean(errors.departamento_id)}
                  disabled={!pais_id}
                >
                  {departamentos.map((departamento) => (
                    <MenuItem
                      key={departamento.departamento_id}
                      value={departamento.departamento_id}
                    >
                      {departamento.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Municipio</InputLabel>
                <Select
                  value={municipio_id}
                  onChange={(e) => setMunicipio_id(e.target.value)}
                  error={Boolean(errors.municipio_id)}
                  disabled={!departamento_id}
                >
                  {municipios.map((municipio) => (
                    <MenuItem
                      key={municipio.municipio_id}
                      value={municipio.municipio_id}
                    >
                      {municipio.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
                label="Correo"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                fullWidth
                error={Boolean(errors.correo)}
                helperText={errors.correo}
                sx={{ mt: 2 }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Saldo"
                value={saldo}
                onChange={(e) => setSaldo(e.target.value)}
                fullWidth
                error={Boolean(errors.saldo)}
                helperText={errors.saldo}
                sx={{ mt: 2 }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Límite Crédito"
                value={limite_credito}
                onChange={(e) => setLimite_credito(e.target.value)}
                fullWidth
                error={Boolean(errors.limite_credito)}
                helperText={errors.limite_credito}
                sx={{ mt: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Comentario"
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                fullWidth
                sx={{ mt: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <LoadingButton
                onClick={handleSubmit}
                loading={loading}
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
              >
                Guardar
              </LoadingButton>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    );
};

export default ModalCliente;
