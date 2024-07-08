import React, { useState, useEffect, useContext } from 'react';
import api from '../../components/axiosConfig';
import { Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import GlobalAlert from '../../components/GlobalAlert';
//import ModalUsuario from '../../components/security/ModalUsuario';
//import ModalUsuarioEmpresa from '../../components/security/ModalUsuarioEmpresa';
import { LoadingContext } from '../../context/LoadingContext';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [userEmpresas, setUserEmpresas] = useState([]);
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [selectedUsuarioPermiso, setSelectedUsuarioPermiso] = useState(null);
  const [openUsuarioModal, setOpenUsuarioModal] = useState(false);
  const [openUsuarioPermisoModal, setOpenUsuarioPermisoModal] = useState(false);
  const { setIsLoading } = useContext(LoadingContext);
  
  useEffect(() => {
    fetchUsuarios();
    fetchUserEmpresas();
  }, []);

  const fetchUsuarios = async () => {
    setIsLoading(true)
    try {
      const response = await api.get('/security/getUsuarios');
      if (Array.isArray(response.data.users)) {
        setUsuarios(response.data.users);
      } else {
        GlobalAlert.showError('Error fetching users: Data is not an array');
      }
    } catch (error) {
      let response = error.response?.data ?? null;
      if(response) {
        GlobalAlert.showError('Error fetching users', response.message);
      } else {
        GlobalAlert.showError('Error logging in', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserEmpresas = async () => {
    try {
      const response = await api.get('/security/getUsuariosEmpresas');
      if (Array.isArray(response.data.usuariosEmpresas)) {
        setUserEmpresas(response.data.usuariosEmpresas);
      } else {
        GlobalAlert.showError('Error fetching user companies: Data is not an array');
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

  const handleDeleteUsuario = async (usuario_id) => {
    GlobalAlert.showWarning(
      'Eliminar registro', 
      'Esta seguro en eliminar el registro?',
      async () => {
        try {
          setIsLoading(true);
          await api.post(`/user/DeleteUser/${usuario_id}`);
          setUsuarios(usuarios.filter(usuario => usuario.usuario_id !== usuario_id));
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

  const handleDeleteUsuarioPermiso = async (usuarioId, empresaId) => {
    GlobalAlert.showWarning(
      'Eliminar registro', 
      'Esta seguro en eliminar el registro?',
      async () => {
        try {
          setIsLoading(true);
          await api.post(`/user/DeleteUsuarioEmpresa/${empresaId}/${usuarioId}`);
          setUserEmpresas(userEmpresas.filter(emp => !(emp.empresa_id === empresaId && emp.usuario_id === usuarioId)));
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
        <Typography variant="h5">Usuarios</Typography>
        <Button variant="contained" color="primary" onClick={() => { setSelectedUsuario(null); setOpenUsuarioModal(true); }}>
          Crear
        </Button>
      </Box>
      <TableContainer component={Paper} style={{ marginBottom: '2rem' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Identidad</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Correo</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(usuarios) && usuarios.map((usuario) => (
              <TableRow key={usuario.usuario_id}>
                <TableCell>{usuario.usuario_id}</TableCell>
                <TableCell>{usuario.nombre}</TableCell>
                <TableCell>{usuario.identidad}</TableCell>
                <TableCell>{usuario.telefono}</TableCell>
                <TableCell>{usuario.correo}</TableCell>
                <TableCell>{usuario.estado}</TableCell>
                <TableCell>
                  <IconButton onClick={() => { setSelectedUsuario(usuario); setOpenUsuarioModal(true); }}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteUsuario(usuario.usuario_id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ backgroundColor: '#6A1B9A', color: 'white', padding: '16px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">Usuarios Empresas</Typography>
        <Button variant="contained" color="primary" onClick={() => { setSelectedUsuarioPermiso(null); setOpenUsuarioPermisoModal(true); }}>
          Crear
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Usuario</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(userEmpresas) && userEmpresas.map((userEmpresa) => (
              <TableRow key={`${userEmpresa.usuario_id}`}>
                <TableCell>{userEmpresa.usuario_id}</TableCell>
                <TableCell>{userEmpresa.nombre}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDeleteUsuarioPermiso(userEmpresa.usuario_id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* <ModalUsuario
        open={openUsuarioModal}
        handleClose={() => setOpenUsuarioModal(false)}
        usuario={selectedUsuario}
        usuarios={usuarios}
        setUsuarios={setUsuarios}
      />
      <ModalUsuarioPermiso
        open={openUsuarioPermisoModal}
        handleClose={() => setOpenUsuarioPermisoModal(false)}
        usuarioPermiso={selectedUsuarioPermiso}
        userEmpresas={userEmpresas}
        setUserEmpresas={setUserEmpresas}
      /> */}
    </div>
  );
};

export default Usuarios;
