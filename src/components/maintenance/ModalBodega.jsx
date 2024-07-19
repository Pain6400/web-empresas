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
    const [bodega_id, setBodega_id] = useState('');
    const [nombre, setNombre] = useState('');
    const [estado, setEstado] = useState(false);
    const [principal, setPrincipal] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (bodega !== null && bodega !== undefined) {
            setBodega_id(bodega.bodega_id)
            setNombre(bodega.nombre);
            setEstado(!!parseInt(bodega.estado, 10));
            setPrincipal(!!parseInt(bodega.principal, 10));
        } else {
            setNombre('');
            setEstado(false);
            setPrincipal(false);
        }
    }, [bodega]);

    const handleSubmit = async () => {
        const validationErrors = {};

        if (!nombre) {
            validationErrors.nombre = 'El nombre es obligatorio';
        }

        if (Object.keys(validationErrors).length === 0) {
            try {
                setLoading(true);
                let path = bodega ? '/maintenance/updateBodega' : '/maintenance/createBodega';
                const payload = {
                    bodega_id,
                    nombre,
                    estado: estado === true ? '1' : '0',
                    principal: principal === true ? '1' : '0'
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
