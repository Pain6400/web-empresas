import React, { useState, useEffect, useContext } from 'react';
import api from '../../components/axiosConfig';
import { Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import GlobalAlert from '../../components/GlobalAlert';
import ModalPerfil from '../../components/security/ModalPerfil';
import ModalUsuarioPerfil from '../../components/security/ModalUsuarioPerfil';
import { LoadingContext } from '../../context/LoadingContext';
import { UserContext } from '../../context/UserContext';

const Perfiles = () => {
  const [perfiles, setPerfiles] = useState([]);
  const [userProfiles, setUserProfiles] = useState([]);
  const [selectedPerfil, setSelectedPerfil] = useState(null);
  const [selectedUsuarioPerfil, setSelectedUsuarioPerfil] = useState(null);
  const [openPerfilModal, setOpenPerfilModal] = useState(false);
  const [openUsuarioPerfilModal, setOpenUsuarioPerfilModal] = useState(false);
  const { setIsLoading } = useContext(LoadingContext);
  const { user } = useContext(UserContext);
  
  const hasRoles = (requiredRoles) => {
    console.log(user.roles )
    if (!user || !user.roles || user.roles.length === 0) {
      return false;
    }
    return requiredRoles.some(rol => user.roles.includes(rol));
  };

  useEffect(() => {
    fetchPerfiles();
    fetchUserProfiles();
  }, []);

  const fetchPerfiles = async () => {
    setIsLoading(true)
    try {
      const response = await api.get('/security/getPefiles');
      if (Array.isArray(response.data.perfiles)) {
        setPerfiles(response.data.perfiles);
      } else {
        GlobalAlert.showError('Error fetching profiles: Data is not an array');
      }
    } catch (error) {
      let response = error.response?.data ?? null;
      if(response) {
        GlobalAlert.showError('Error fetching profiles', response.message);
      } else {
        GlobalAlert.showError('Error logging in', error);
      }
    }
  };

  const fetchUserProfiles = async () => {
    try {
      const response = await api.get('/security/getUsuariosPefiles');
      if (Array.isArray(response.data.usuariosPerfiles)) {
        setUserProfiles(response.data.usuariosPerfiles);
      } else {
        GlobalAlert.showError('Error fetching user profiles: Data is not an array');
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



  const handleDeletePerfil = async (perfil_id) => {
    GlobalAlert.showWarning(
      'Eliminar registro', 
      'Esta seguro en eliminar el registro?',
      async () => {
        try {
          setIsLoading(true);
          await api.post(`/security/DeletePefil/${perfil_id}`);
          setPerfiles(perfiles.filter(perfil => perfil.perfil_id !== perfil_id));
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

  const handleDeleteUsuarioPerfil = async (usuarioId, perfilId) => {
    GlobalAlert.showWarning(
      'Eliminar registro', 
      'Esta seguro en eliminar el registro?',
      async () => {
        try {
          setIsLoading(true);
          await api.post(`/security/DeleteUsuarioPefil/${perfilId}/${usuarioId}`);
          setUserProfiles(userProfiles.filter(perfil => !(perfil.perfil_id === perfilId && perfil.usuario_id === usuarioId)));
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
      {hasRoles(["SuperAdmin"]) && (
        <>
          <Box
            sx={{
              backgroundColor: "primary.main",
              color: "primary.contrastText",
              padding: "16px",
              marginBottom: "16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h5">Perfiles</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setSelectedPerfil(null);
                setOpenPerfilModal(true);
              }}
            >
              Crear
            </Button>
          </Box>

          <TableContainer component={Paper} style={{ marginBottom: "2rem" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Perfil ID</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(perfiles) &&
                  perfiles.map((perfil) => (
                    <TableRow key={perfil.perfil_id}>
                      <TableCell>{perfil.perfil_id}</TableCell>
                      <TableCell>{perfil.descripcion}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => {
                            setSelectedPerfil(perfil);
                            setOpenPerfilModal(true);
                          }}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeletePerfil(perfil.perfil_id)}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
      
      <Box
        sx={{
          backgroundColor: "primary.main",
          color: "primary.contrastText",
          padding: "16px",
          marginBottom: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h5">Usuarios Perfiles</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setSelectedUsuarioPerfil(null);
            setOpenUsuarioPerfilModal(true);
          }}
        >
          Crear
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Usuario</TableCell>
              <TableCell>Perfil</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(userProfiles) &&
              userProfiles.map((userProfile, index) => (
                <TableRow
                  key={`${userProfile.usuario_id}-${userProfile.perfil_id}-${index}`}
                >
                  <TableCell>{userProfile.nombre}</TableCell>
                  <TableCell>{userProfile.descripcion}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() =>
                        handleDeleteUsuarioPerfil(
                          userProfile.usuario_id,
                          userProfile.perfil_id
                        )
                      }
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <ModalPerfil
        open={openPerfilModal}
        handleClose={() => setOpenPerfilModal(false)}
        perfil={selectedPerfil}
        perfiles={perfiles}
        setPerfiles={setPerfiles}
      />
      <ModalUsuarioPerfil
        open={openUsuarioPerfilModal}
        handleClose={() => setOpenUsuarioPerfilModal(false)}
        usuarioPerfil={selectedUsuarioPerfil}
        userProfiles={userProfiles}
        setUserProfiles={setUserProfiles}
      />
    </div>
  );
};

export default Perfiles;
