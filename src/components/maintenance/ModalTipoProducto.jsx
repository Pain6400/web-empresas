import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Divider, Grid } from '@mui/material';
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

const ModalTipoProducto = ({ open, handleClose, tipoProducto, setReload }) => {
    const [nombre, setNombre] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (tipoProducto !== null && tipoProducto !== undefined) {
            setNombre(tipoProducto.nombre);
        } else {
            setNombre('');
        }
    }, [tipoProducto]);

    const handleSubmit = async () => {
        const validationErrors = {};

        if (!nombre) {
            validationErrors.nombre = 'El nombre es obligatorio';
        }

        if (Object.keys(validationErrors).length === 0) {
            try {
                setLoading(true);
                let path = tipoProducto ? '/maintenance/updateTipoProducto' : '/maintenance/createTipoProducto';
                const payload = {
                    tipo_producto_id: tipoProducto?.tipo_producto_id,
                    nombre
                };

                const response = await api.post(path, payload);
                if (response.data.status) {
                    handleClose();
                    setReload(true);
                    if (!tipoProducto) {
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
                <h3>{tipoProducto ? "Editar Tipo de Producto" : "Nuevo Tipo de Producto"}</h3>
                <Divider />

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

export default ModalTipoProducto;
