import React, { useState, useEffect, useContext } from 'react';
import { Modal, Box, Button, Divider, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import api from '../../components/axiosConfig';
import GlobalAlert from '../../components/GlobalAlert';
import { LoadingContext } from '../../context/LoadingContext';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const ModalPerfilPermiso = ({ open, handleClose, perfilPermiso, perfilPermisos, setPerfilPermisos }) => {
  const [perfilId, setPerfilId] = useState('');
  const [permisoId, setPermisoId] = useState('');
  const [perfiles, setPerfiles] = useState([]);
  const [permisos, setPermisos] = useState([]);
  const [errors, setErrors] = useState({});
  const { setIsLoading } = useContext(LoadingContext);

  useEffect(() => {
    const fetchPerfiles = async () => {
      try {
        const response = await api.get('/security/getPefiles');
        setPerfiles(response.data.perfiles);
      } catch (error) {
        if(response) {
            GlobalAlert.showError('Error: ', response.message);
          } else {
            GlobalAlert.showError('Error: ', error);
          }
      }
    };

    const fetchPermisos = async () => {
      try {
        const response = await api.get('/security/getPermisos');
        setPermisos(response.data.permisos);
      } catch (error) {
        if(response) {
            GlobalAlert.showError('Error: ', response.message);
          } else {
            GlobalAlert.showError('Error: ', error);
          }
      }
    };

    fetchPerfiles();
    fetchPermisos();
    setPerfilId('');
    setPermisoId('');
  }, []);

  const handleSubmit = async () => {
    const validationErrors = {};

    if (!perfilId) {
      validationErrors.perfilId = 'El perfil es obligatorio';
    }
    if (!permisoId) {
      validationErrors.permisoId = 'El permiso es obligatorio';
    }

    if (Object.keys(validationErrors).length === 0) {
      try {
        setIsLoading(true);
        let path = '/security/createPerfilPermiso';
        const response = await api.post(path, {
          perfilId,
          permisoId
        });

        if (response.data.status) {
          handleClose();
          let perfil = perfiles.find(p => p.perfil_id === perfilId);
          let permiso = permisos.find(p => p.permiso_id === permisoId);
          setPerfilPermisos([...perfilPermisos, { perfil_id: perfilId, permiso_id: permisoId, descripcionPerfil: perfil.descripcion, descripcionPermiso: permiso.descripcion }]);
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
        <h2>{perfilPermiso ? 'Editar Perfil Permiso' : 'Nuevo Perfil Permiso'}</h2>
        <Divider />
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Perfil ID</InputLabel>
          <Select
            value={perfilId}
            onChange={(e) => setPerfilId(e.target.value)}
            error={Boolean(errors.perfilId)}
          >
            {perfiles.map((perfil) => (
              <MenuItem key={perfil.perfil_id} value={perfil.perfil_id}>
                {perfil.descripcion}
              </MenuItem>
            ))}
          </Select>
          {errors.perfilId && <p style={{ color: 'red' }}>{errors.perfilId}</p>}
        </FormControl>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Permiso ID</InputLabel>
          <Select
            value={permisoId}
            onChange={(e) => setPermisoId(e.target.value)}
            error={Boolean(errors.permisoId)}
          >
            {permisos.map((permiso) => (
              <MenuItem key={permiso.permiso_id} value={permiso.permiso_id}>
                {permiso.descripcion}
              </MenuItem>
            ))}
          </Select>
          {errors.permisoId && <p style={{ color: 'red' }}>{errors.permisoId}</p>}
        </FormControl>
        <Button onClick={handleSubmit} variant="contained" color="primary" sx={{ mt: 2 }}>
          Guardar
        </Button>
      </Box>
    </Modal>
  );
};

export default ModalPerfilPermiso;
