import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Divider, FormControl, Switch, Grid, FormControlLabel } from '@mui/material';
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

const ModalBodega = ({ open, handleClose, bodega, setReload }) => {
    const [bodega_id, setBodega_id] = useState(0);
    const [empresa_id, setEmpresa_id] = useState('');
    const [nombre, setNombre] = useState('');
    const [estado, setEstado] = useState(false);
    const [principal, setPrincipal] = useState(false);
    const [fecha_creo, setFecha_creo] = useState('');
    const [usuario_creo, setUsuario_creo] = useState('');
    const [fecha_modifico, setFecha_modifico] = useState('');
    const [usuario_modifico, setUsuario_modifico] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (bodega !== null && bodega !== undefined) {
            setBodega_id(bodega.bodega_id);
            setEmpresa_id(bodega.empresa_id);
            setNombre(bodega.nombre);
            setEstado(!!parseInt(bodega.estado, 10));
            setPrincipal(!!parseInt(bodega.principal, 10));
            setFecha_creo(bodega.fecha_creo);
            setUsuario_creo(bodega.usuario_creo);
            setFecha_modifico(bodega.fecha_modifico);
            setUsuario_modifico(bodega.usuario_modifico);
        } else {
            setBodega_id(0);
            setEmpresa_id('');
            setNombre('');
            setEstado(false);
            setPrincipal(false);
            setFecha_creo('');
            setUsuario_creo('');
            setFecha_modifico('');
            setUsuario_modifico('');
        }
    }, [bodega]);

    const handleSubmit = async () => {
        const validationErrors = {};

        if (!empresa_id) {
            validationErrors.empresa_id = 'El ID de la empresa es obligatorio';
        }
        if (!nombre) {
            validationErrors.nombre = 'El nombre es obligatorio';
        }

        if (Object.keys(validationErrors).length === 0) {
            try {
                setLoading(true);
                let path = bodega ? '/maintenance/updateBodega' : '/maintenance/createBodega';
                const payload = {
                    bodega_id,
                    empresa_id,
                    nombre,
                    estado: estado === true ? '1' : '0',
                    principal: principal === true ? '1' : '0',
                    fecha_creo,
                    usuario_creo,
                    fecha_modifico,
                    usuario_modifico
                };

                const response = await api.post(path, payload);
                if (response.data.status) {
                    handleClose();
                    setReload(true);
                    if (bodega == null || bodega == undefined) {
                        GlobalAlert.showSuccess('Registro creado correctamente');
                    } else {
                        GlobalAlert.showSuccess('Registro actualizado correctamente');
                    }
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
                <h3>{bodega ? "Editar Bodega" : "Nueva Bodega"}</h3>
                <Divider />

                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                            label="ID Empresa"
                            value={empresa_id}
                            onChange={(e) => setEmpresa_id(e.target.value)}
                            fullWidth
                            error={Boolean(errors.empresa_id)}
                            helperText={errors.empresa_id}
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
                    <Grid item xs={6}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={principal}
                                    onChange={(e) => setPrincipal(e.target.checked)}
                                    name="principal"
                                    color="primary"
                                />
                            }
                            label={principal ? "Principal" : "No Principal"}
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

export default ModalBodega;
