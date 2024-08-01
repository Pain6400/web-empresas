import React, { useState, useEffect, useContext } from 'react';
import { Modal, Box, Button, Divider, FormControlLabel, Checkbox, FormGroup, FormControl, InputLabel, Select, MenuItem  } from '@mui/material';
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

const ModalUsuarioPermiso = ({ open, handleClose, usuarioPermiso, usuariosPermisos, setUsuariosPermisos }) => {
  const [usuarioId, setUsuarioId] = useState('');
  const [selectedPermisos, setSelectedPermisos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [permisos, setPermisos] = useState([]);
  const [errors, setErrors] = useState({});
  const { setIsLoading } = useContext(LoadingContext);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await api.get('/security/getUsuarios');
        setUsuarios(response.data.users);
      } catch (error) {
        GlobalAlert.showError('Error fetching usuarios', error.message);
      }
    };

    const fetchPermisos = async () => {
      try {
        const response = await api.get('/security/getPermisos');
        setPermisos(response.data.permisos);
      } catch (error) {
        GlobalAlert.showError('Error fetching permisos', error.message);
      }
    };

    fetchUsuarios();
    fetchPermisos();
    setUsuarioId('');
    setSelectedPermisos([]);
  }, []);

  const handlePermisoChange = (permisoId) => {
    setSelectedPermisos((prevSelected) => 
      prevSelected.includes(permisoId) 
        ? prevSelected.filter((id) => id !== permisoId) 
        : [...prevSelected, permisoId]
    );
  };

  const handleSubmit = async () => {
    const validationErrors = {};

    if (!usuarioId) {
      validationErrors.usuarioId = 'El usuario es obligatorio';
    }
    if (selectedPermisos.length === 0) {
      validationErrors.permisoId = 'Al menos un permiso es obligatorio';
    }

    if (Object.keys(validationErrors).length === 0) {
      try {
        setIsLoading(true);
        for (const permisoId of selectedPermisos) {
          let path = '/security/createUsuarioPermiso';
          const response = await api.post(path, {
            usuarioId,
            permisoId
          });

          if (response.data.status) {
            let permiso = permisos.find(p => p.permiso_id === permisoId);
            let usuario = usuarios.find(u => u.usuario_id === usuarioId);
            setUsuariosPermisos(prevState => [
              ...prevState, 
              { 
                usuario_id: usuarioId, 
                permiso_id: permisoId, 
                nombre: usuario.nombre, 
                descripcion: permiso.descripcion 
              }
            ]);
          } else {
            GlobalAlert.showError('Error: ', response.data.message);
          }
        }
        GlobalAlert.showSuccess('Registro(s) creado(s) correctamente');
        handleClose();
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
        <h2>{usuarioPermiso ? 'Editar Usuario Permiso' : 'Nuevo Usuario Permiso'}</h2>
        <Divider />
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Usuario ID</InputLabel>
          <Select
            value={usuarioId}
            onChange={(e) => setUsuarioId(e.target.value)}
            error={Boolean(errors.usuarioId)}
          >
            {usuarios.map((usuario) => (
              <MenuItem key={usuario.usuario_id} value={usuario.usuario_id}>
                {usuario.nombre}
              </MenuItem>
            ))}
          </Select>
          {errors.usuarioId && <p style={{ color: 'red' }}>{errors.usuarioId}</p>}
        </FormControl>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <FormGroup>
            {permisos.map((permiso) => (
              <FormControlLabel
                key={permiso.permiso_id}
                control={
                  <Checkbox
                    checked={selectedPermisos.includes(permiso.permiso_id)}
                    onChange={() => handlePermisoChange(permiso.permiso_id)}
                  />
                }
                label={permiso.descripcion}
              />
            ))}
          </FormGroup>
          {errors.permisoId && <p style={{ color: 'red' }}>{errors.permisoId}</p>}
        </FormControl>
        <Button onClick={handleSubmit} variant="contained" color="primary" sx={{ mt: 2 }}>
          Guardar
        </Button>
      </Box>
    </Modal>
  );
};

export default ModalUsuarioPermiso;
