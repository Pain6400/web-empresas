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

const ModalPerfil = ({ open, handleClose, perfil, perfiles, setPerfiles }) => {
  const [perfil_id, setPerfil_id] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [errors, setErrors] = useState({});
  const { setIsLoading } = useContext(LoadingContext);

  useEffect(() => {
    setPerfil_id('');
    setDescripcion('');
    if (perfil) {
      setPerfil_id(perfil.perfil_id)
      setDescripcion(perfil.descripcion);
    } else {
      setPerfil_id('');
      setDescripcion('');
    }
  }, [perfil]);

  const handleSubmit = async () => {
    const validationErrors = {};

    if (!perfil_id) {
      validationErrors.perfil_id = 'El usuario es obligatorio';
    }
    if (!descripcion) {
      validationErrors.descripcion = 'La contraseña es obligatoria';
    }

    if (Object.keys(validationErrors).length === 0) {
      try {
        setIsLoading(true);
        let path = perfil ? '/security/UpdatePefil' : '/security/createPefil'
        const response = await api.post(path, {
          perfil_id,
          descripcion
        });

        if(response.data.status) {
          handleClose();
          if (perfil !== null) {
            const udatePerfiles = perfiles.map(item => 
              item.perfil_id === perfil_id ? { ...item, descripcion, descripcion: descripcion } : item
            );
            setPerfiles(udatePerfiles);
          } else  {
            setPerfiles([...perfiles, { perfil_id, descripcion}])
          }

          GlobalAlert.showSuccess('Registro creado correctamente');
        } else {
          GlobalAlert.showError('Error: ', response.data.message);
        }
      } catch (error) {
        let response = error.response?.data ?? null;
        if(response) {
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
        <h3>{perfil ? 'Editar Perfil' : 'Nuevo Perfil'}</h3>
        <Divider  />

        <TextField
          disabled={Boolean(perfil)}
          label="Perfil Id"
          value={perfil_id}
          onChange={(e) => setPerfil_id(e.target.value)}
          fullWidth
          error={Boolean(errors.perfil_id)}
          helperText={errors.perfil_id}
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

export default ModalPerfil;
