import React, { useState, useEffect, useContext } from 'react';
import { Modal, Box, TextField, Button, Divider } from '@mui/material';
import api from '../../components/axiosConfig';
import GlobalAlert from '../../components/GlobalAlert';
import { LoadingContext } from '../../context/LoadingContext';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 3,
};

const ModalPermiso = ({ open, handleClose, permiso, permisos, setPermisos }) => {
  const [permiso_id, setPermiso_id] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [errors, setErrors] = useState({});
  const { setIsLoading } = useContext(LoadingContext);

  useEffect(() => {
    if (permiso) {
      setPermiso_id(permiso.permiso_id);
      setDescripcion(permiso.descripcion);
    } else {
      setPermiso_id('');
      setDescripcion('');
    }
  }, [permiso]);

  const handleSubmit = async () => {
    const validationErrors = {};

    if (!permiso_id) {
      validationErrors.permiso_id = 'El ID del permiso es obligatorio';
    }
    if (!descripcion) {
      validationErrors.descripcion = 'La descripción es obligatoria';
    }

    if (Object.keys(validationErrors).length === 0) {
      try {
        setIsLoading(true);
        let path = permiso ? '/security/updatePermiso' : '/security/createPermiso';
        const response = await api.post(path, {
          permiso_id,
          descripcion
        });

        if (response.data.status) {
          handleClose();
          if (permiso !== null) {
            const updatedPermisos = permisos.map(item =>
              item.permiso_id === permiso_id ? { ...item, descripcion } : item
            );
            setPermisos(updatedPermisos);
          } else {
            setPermisos([...permisos, { permiso_id, descripcion }]);
          }

          GlobalAlert.showSuccess('Registro creado correctamente');
        } else {
          GlobalAlert.showError('Error: ', response.data.message);
        }
      } catch (error) {
        let response = error.response?.data ?? null;
        if (response) {
          GlobalAlert.showError('Error: ', response.message);
        } else {
          GlobalAlert.showError('Error: ', error);
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <h3>{permiso ? 'Editar Permiso' : 'Nuevo Permiso'}</h3>
        <Divider />

        <TextField
          disabled={Boolean(permiso)}
          label="Permiso ID"
          value={permiso_id}
          onChange={(e) => setPermiso_id(e.target.value)}
          fullWidth
          error={Boolean(errors.permiso_id)}
          helperText={errors.permiso_id}
          sx={{ mt: 2 }}
        />

        <TextField
          label="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          fullWidth
          error={Boolean(errors.descripcion)}
          helperText={errors.descripcion}
          sx={{ mt: 2 }}
        />
        <Button onClick={handleSubmit} variant="contained" color="primary" sx={{ mt: 2 }}>
          Guardar
        </Button>
      </Box>
    </Modal>
  );
};

export default ModalPermiso;
