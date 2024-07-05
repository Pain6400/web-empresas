import React, { useState, useEffect, useContext } from 'react';
import api from '../../components/axiosConfig';
import { Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import GlobalAlert from '../../components/GlobalAlert';
import ModalPermiso from '../../components/security/ModalPermiso'; // Assume you will create this modal similar to ModalPerfil
import ModalPerfilPermiso from '../../components/security/ModalPerfilPermiso'; // Assume you will create this modal similar to ModalUsuarioPerfil
import { LoadingContext } from '../../context/LoadingContext';

const Permisos = () => {
  const [permisos, setPermisos] = useState([]);
  const [perfilPermisos, setPerfilPermisos] = useState([]);
  const [selectedPermiso, setSelectedPermiso] = useState(null);
  const [selectedPerfilPermiso, setSelectedPerfilPermiso] = useState(null);
  const [openPermisoModal, setOpenPermisoModal] = useState(false);
  const [openPerfilPermisoModal, setOpenPerfilPermisoModal] = useState(false);
  const { setIsLoading } = useContext(LoadingContext);

  useEffect(() => {
    fetchPermisos();
    fetchPerfilPermisos();
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

  const fetchPerfilPermisos = async () => {
    try {
      const response = await api.get('/security/getPefilesPermisos');
      if (Array.isArray(response.data.perfilesPermisos)) {
        setPerfilPermisos(response.data.perfilesPermisos);
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

  const handleDeletePerfilPermiso = async (perfilId, permisoId) => {
    GlobalAlert.showWarning(
      'Eliminar registro', 
      'Esta seguro en eliminar el registro?',
      async () => {
        try {
          setIsLoading(true);
          await api.post(`/security/DeletePerfilPermiso/${perfilId}/${permisoId}`);
          setPerfilPermisos(perfilPermisos.filter(perfilPermiso => !(perfilPermiso.perfil_id === perfilId && perfilPermiso.permiso_id === permisoId)));
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
        <Typography variant="h5">Perfiles Permisos</Typography>
        <Button variant="contained" color="primary" onClick={() => { setSelectedPerfilPermiso(null); setOpenPerfilPermisoModal(true); }}>
          Crear
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Perfil ID</TableCell>
              <TableCell>Permiso ID</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(perfilPermisos) && perfilPermisos.map((perfilPermiso) => (
              <TableRow key={`${perfilPermiso.perfil_id}-${perfilPermiso.permiso_id}`}>
                <TableCell>{perfilPermiso.perfil_id}</TableCell>
                <TableCell>{perfilPermiso.permiso_id}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDeletePerfilPermiso(perfilPermiso.perfil_id, perfilPermiso.permiso_id)}>
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
      <ModalPerfilPermiso
        open={openPerfilPermisoModal}
        handleClose={() => setOpenPerfilPermisoModal(false)}
        perfilPermiso={selectedPerfilPermiso}
        perfilPermisos={perfilPermisos}
        setPerfilPermisos={setPerfilPermisos}
      />
    </div>
  );
};

export default Permisos;
