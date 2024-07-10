import React, { useState, useEffect, useContext } from 'react';
import api from '../../components/axiosConfig';
import { Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import GlobalAlert from '../../components/GlobalAlert';
import ModalPermiso from '../../components/security/ModalPermiso'; // Assume you will create this modal similar to ModalPerfil
import ModalUsuarioPermiso from '../../components/security/ModalUsuarioPermiso'; // Assume you will create this modal similar to ModalUsuarioPerfil
import { LoadingContext } from '../../context/LoadingContext';

const Permisos = () => {
  const [permisos, setPermisos] = useState([]);
  const [selectedPermiso, setSelectedPermiso] = useState(null);
  const [openPermisoModal, setOpenPermisoModal] = useState(false);;
  const [usuariosPermisos, setUsuariosPermisos] = useState([]);
  const [selectedUsuarioPermiso, setSelectedUsuarioPermiso] = useState(null);
  const [openUsuarioPermisoModal, setOpenUsuarioPermisoModal] = useState(false);
  const { setIsLoading } = useContext(LoadingContext);

  useEffect(() => {
    fetchPermisos();
    fetchUsuariosPermisos();
  }, []);

  const fetchPermisos = async () => {
    setIsLoading(true)
    try {
      const response = await api.get('/security/getPermisos');
      if (Array.isArray(response.data.permisos)) {
        setPermisos(response.data.permisos);
      } else {
        GlobalAlert.showError('Error fetching permisos: Data is not an array');
      }
    } catch (error) {
      let response = error.response?.data ?? null;
      if(response) {
        GlobalAlert.showError('Error fetching permisos', response.message);
      } else {
        GlobalAlert.showError('Error logging in', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsuariosPermisos = async () => {
    try {
      const response = await api.get('/security/getUsuariosPermisos');
      if (Array.isArray(response.data.usuariosPermisos)) {
        setUsuariosPermisos(response.data.usuariosPermisos);
      } else {
        GlobalAlert.showError('Error fetching perfil permisos: Data is not an array');
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
  };

  const handleDeletePermiso = async (permiso_id) => {
    GlobalAlert.showWarning(
      'Eliminar registro', 
      'Esta seguro en eliminar el registro?',
      async () => {
        try {
          setIsLoading(true);
          await api.post(`/security/DeletePermiso/${permiso_id}`);
          setPermisos(permisos.filter(permiso => permiso.permiso_id !== permiso_id));
          GlobalAlert.showSuccess('Registro eliminado correctamente');
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
      }  
    )
  };

  const handleDeleteUsuarioPermiso = async (usuarioId, permisoId) => {
    GlobalAlert.showWarning(
      'Eliminar registro', 
      'Esta seguro en eliminar el registro?',
      async () => {
        try {
          setIsLoading(true);
          await api.post(`/security/DeleteUsuarioPermiso/${permisoId}/${usuarioId}`);
          setUsuariosPermisos(usuariosPermisos.filter(usuarioPermiso => !(usuarioPermiso.usuario_id === usuarioId && usuarioPermiso.permiso_id === permisoId)));
          GlobalAlert.showSuccess('Registro eliminado correctamente');
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
      }  
    )
  };
  return (
    <div>
      <Box sx={{ backgroundColor: '#6A1B9A', color: 'white', padding: '16px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">Permisos</Typography>
        <Button variant="contained" color="primary" onClick={() => { setSelectedPermiso(null); setOpenPermisoModal(true); }}>
          Crear
        </Button>
      </Box>
      <TableContainer component={Paper} style={{ marginBottom: '2rem' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Permiso ID</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(permisos) && permisos.map((permiso) => (
              <TableRow key={permiso.permiso_id}>
                <TableCell>{permiso.permiso_id}</TableCell>
                <TableCell>{permiso.descripcion}</TableCell>
                <TableCell>
                  <IconButton onClick={() => { setSelectedPermiso(permiso); setOpenPermisoModal(true); }}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDeletePermiso(permiso.permiso_id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ backgroundColor: '#6A1B9A', color: 'white', padding: '16px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">Usuarios Permisos</Typography>
        <Button variant="contained" color="primary" onClick={() => { setSelectedUsuarioPermiso(null); setOpenUsuarioPermisoModal(true); }}>
          Crear
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Usuario</TableCell>
              <TableCell>Permiso</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(usuariosPermisos) && usuariosPermisos.map((usuarioPermiso) => (
              <TableRow key={`${usuarioPermiso.usuario_id}-${usuarioPermiso.permiso_id}`}>
                <TableCell>{usuarioPermiso.nombre}</TableCell>
                <TableCell>{usuarioPermiso.descripcion}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDeleteUsuarioPermiso(usuarioPermiso.usuario_id, usuarioPermiso.permiso_id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <ModalPermiso
        open={openPermisoModal}
        handleClose={() => setOpenPermisoModal(false)}
        permiso={selectedPermiso}
        permisos={permisos}
        setPermisos={setPermisos}
      />
      <ModalUsuarioPermiso
        open={openUsuarioPermisoModal}
        handleClose={() => setOpenUsuarioPermisoModal(false)}
        usuarioPermiso={selectedUsuarioPermiso}
        usuariosPermisos={usuariosPermisos}
        setUsuariosPermisos={setUsuariosPermisos}
      /> 
    </div>
  );
};

export default Permisos;
