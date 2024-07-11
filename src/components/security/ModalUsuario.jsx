import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Divider, Switch, FormControlLabel } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import api from '../../components/axiosConfig';
import GlobalAlert from '../../components/GlobalAlert';

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

const ModalUsuario = ({ open, handleClose, usuario, usuarios, setUsuarios }) => {
  const [usuario_id, setUsuario_id] = useState('');
  const [nombre, setNombre] = useState('');
  const [identidad, setIdentidad] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [estado, setEstado] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (usuario !== null) {
      setUsuario_id(usuario.usuario_id);
      setNombre(usuario.nombre);
      setIdentidad(usuario.identidad);
      setTelefono(usuario.telefono);
      setCorreo(usuario.correo);
      setEstado(!!parseInt(usuario.estado, 10))
    } else {
        setUsuario_id('');
        setNombre('');
        setIdentidad('');
        setTelefono('');
        setCorreo('');
        setPassword('');
    }
  }, [usuario]);

  const handleSubmit = async () => {
    const validationErrors = {};

    if (!usuario_id) {
      validationErrors.usuario_id = 'El ID del usuario es obligatorio';
    }
    if (!nombre) {
      validationErrors.nombre = 'El nombre es obligatorio';
    }
    if (!identidad) {
      validationErrors.identidad = 'La identidad es obligatoria';
    }
    if (!telefono) {
      validationErrors.telefono = 'El teléfono es obligatorio';
    }
    if (!correo) {
      validationErrors.correo = 'El correo es obligatorio';
    }
    if (!usuario) {
      if (!password) {
        validationErrors.password = 'La contraseña es obligatoria';
      }
    }

    if (Object.keys(validationErrors).length === 0) {
      try {
        setLoading(true);
        let path = usuario ? '/security/updateUsuario' : '/security/createUsuario';
        const payload = {
          usuario_id,
          nombre,
          identidad,
          telefono,
          correo,
          estado: estado === true ? '1' : '2'
        };

        if (usuario == null) {
          payload.password = password;
        }
        console.log(payload)
        const response = await api.post(path, payload);

        if (response.data.status) {
          handleClose();
          if (usuario !== null) {
            const updatedUsuarios = usuarios.map(item =>
              item.usuario_id === usuario_id ? { ...item, nombre, identidad, telefono, correo } : item
            );
            setUsuarios(updatedUsuarios);
          } else {
            setUsuarios([...usuarios, { usuario_id, nombre, identidad, telefono, correo }]);
          }

          GlobalAlert.showSuccess('Registro creado correctamente');
        } else {
          GlobalAlert.showErrorModal('Error: ', response.data.message);
        }
      } catch (error) {
        console.log(error)
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
        <h3>{usuario ? "Editar Usuario" : "Nuevo Usuario"}</h3>
        <Divider />

        <TextField
          disabled={Boolean(usuario)}
          label="Usuario ID"
          value={usuario_id}
          onChange={(e) => setUsuario_id(e.target.value)}
          fullWidth
          error={Boolean(errors.usuario_id)}
          helperText={errors.usuario_id}
          sx={{ mt: 2 }}
        />

        <TextField
          label="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          fullWidth
          error={Boolean(errors.nombre)}
          helperText={errors.nombre}
          sx={{ mt: 2 }}
        />

        <TextField
          label="Identidad"
          value={identidad}
          onChange={(e) => setIdentidad(e.target.value)}
          fullWidth
          error={Boolean(errors.identidad)}
          helperText={errors.identidad}
          sx={{ mt: 2 }}
        />

        <TextField
          label="Teléfono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          fullWidth
          error={Boolean(errors.telefono)}
          helperText={errors.telefono}
          sx={{ mt: 2 }}
        />

        <TextField
          label="Correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          fullWidth
          error={Boolean(errors.correo)}
          helperText={errors.correo}
          sx={{ mt: 2 }}
        />

        {!usuario && (
          <TextField
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            error={Boolean(errors.password)}
            helperText={errors.password}
            sx={{ mt: 2 }}
          />
        )}

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
        <LoadingButton
          onClick={handleSubmit}
          loading={loading}
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Guardar
        </LoadingButton>
      </Box>
    </Modal>
  );
};

export default ModalUsuario;
