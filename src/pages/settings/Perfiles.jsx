import {
    Container, Typography, Button, Table, TableBody, TableCell, TableHead,
    TableRow, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    TextField, IconButton, Select, MenuItem, InputLabel, FormControl
  } from '@mui/material';
  import { Edit, Delete } from '@mui/icons-material';
  import axios from 'axios';
  import GlobalAlert from '../components/GlobalAlert';  // Importa tu componente GlobalAlert
  
  const Perfiles = () => {
    const [perfiles, setPerfiles] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [open, setOpen] = useState(false);
    const [openAssociations, setOpenAssociations] = useState(false);
    const [editingPerfil, setEditingPerfil] = useState(null);
    const [newPerfil, setNewPerfil] = useState({ perfil_id: '', descripcion: '' });
    const [selectedPerfil, setSelectedPerfil] = useState(null);
    const [userProfile, setUserProfile] = useState({ usuario_id: '', perfil_id: '' });
  
    useEffect(() => {
      fetchPerfiles();
      fetchUsuarios();
    }, []);
  
    const fetchPerfiles = async () => {
      try {
        const response = await axios.get('/api/perfiles');
        setPerfiles(response.data);
      } catch (error) {
        GlobalAlert.showError('Error fetching profiles:', error.message);
      }
    };
  
    const fetchUsuarios = async () => {
      try {
        const response = await axios.get('/api/usuarios');
        setUsuarios(response.data);
      } catch (error) {
        GlobalAlert.showError('Error fetching users:', error.message);
      }
    };
  
    const fetchUsuarioPerfiles = async (perfil_id) => {
      try {
        const response = await axios.get(`/api/usuarios_perfiles/${perfil_id}`);
        setUserProfile(response.data);
      } catch (error) {
        GlobalAlert.showError('Error fetching user profiles:', error.message);
      }
    };
  
    const handleClickOpen = (perfil = null) => {
      setEditingPerfil(perfil);
      setNewPerfil(perfil ? { ...perfil } : { perfil_id: '', descripcion: '' });
      setOpen(true);
    };
  
    const handleOpenAssociations = (perfil) => {
      setSelectedPerfil(perfil);
      fetchUsuarioPerfiles(perfil.perfil_id);
      setOpenAssociations(true);
    };
  
    const handleClose = () => {
      setOpen(false);
      setOpenAssociations(false);
    };
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setNewPerfil(prevState => ({
        ...prevState,
        [name]: value
      }));
      setUserProfile(prevState => ({
        ...prevState,
        [name]: value
      }));
    };
  
    const handleSave = async () => {
      try {
        if (editingPerfil) {
          await axios.put(`/api/perfiles/${newPerfil.perfil_id}`, newPerfil);
          GlobalAlert.showSuccess('Perfil actualizado exitosamente');
        } else {
          await axios.post('/api/perfiles', newPerfil);
          GlobalAlert.showSuccess('Perfil creado exitosamente');
        }
        fetchPerfiles();
        handleClose();
      } catch (error) {
        GlobalAlert.showError('Error saving profile:', error.message);
      }
    };
  
    const handleSaveAssociation = async () => {
      try {
        await axios.post(`/api/usuarios_perfiles`, userProfile);
        GlobalAlert.showSuccess('Usuario asociado exitosamente');
        fetchUsuarioPerfiles(selectedPerfil.perfil_id);
      } catch (error) {
        GlobalAlert.showError('Error saving user profile association:', error.message);
      }
    };
  
    const handleDelete = async (perfil_id) => {
      try {
        await axios.delete(`/api/perfiles/${perfil_id}`);
        GlobalAlert.showSuccess('Perfil eliminado exitosamente');
        fetchPerfiles();
      } catch (error) {
        GlobalAlert.showError('Error deleting profile:', error.message);
      }
    };
  
    const handleDeleteAssociation = async (usuario_id, perfil_id) => {
      try {
        await axios.delete(`/api/usuarios_perfiles/${usuario_id}/${perfil_id}`);
        GlobalAlert.showSuccess('Asociación eliminada exitosamente');
        fetchUsuarioPerfiles(perfil_id);
      } catch (error) {
        GlobalAlert.showError('Error deleting user profile association:', error.message);
      }
    };
  
    return (
      <Container>
        <Typography variant="h4" gutterBottom>Gestión de Perfiles</Typography>
        <Button variant="contained" color="primary" onClick={() => handleClickOpen()}>
          Crear Perfil
        </Button>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID del Perfil</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {perfiles.map((perfil) => (
              <TableRow key={perfil.perfil_id}>
                <TableCell>{perfil.perfil_id}</TableCell>
                <TableCell>{perfil.descripcion}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleClickOpen(perfil)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleDelete(perfil.perfil_id)}>
                    <Delete />
                  </IconButton>
                  <Button variant="contained" color="default" onClick={() => handleOpenAssociations(perfil)}>
                    Asociar Usuarios
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{editingPerfil ? 'Editar Perfil' : 'Crear Perfil'}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {editingPerfil ? 'Actualiza la información del perfil.' : 'Ingrese la información del nuevo perfil.'}
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              name="perfil_id"
              label="ID del Perfil"
              type="text"
              fullWidth
              value={newPerfil.perfil_id}
              onChange={handleChange}
              disabled={editingPerfil !== null}
            />
            <TextField
              margin="dense"
              name="descripcion"
              label="Descripción"
              type="text"
              fullWidth
              value={newPerfil.descripcion}
              onChange={handleChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">Cancelar</Button>
            <Button onClick={handleSave} color="primary">{editingPerfil ? 'Guardar Cambios' : 'Crear'}</Button>
          </DialogActions>
        </Dialog>
        <Dialog open={openAssociations} onClose={handleClose}>
          <DialogTitle>Asociar Usuarios a {selectedPerfil?.descripcion}</DialogTitle>
          <DialogContent>
            <FormControl fullWidth margin="dense">
              <InputLabel id="usuario-label">Usuario</InputLabel>
              <Select
                labelId="usuario-label"
                name="usuario_id"
                value={userProfile.usuario_id}
                onChange={handleChange}
              >
                {usuarios.map((usuario) => (
                  <MenuItem key={usuario.usuario_id} value={usuario.usuario_id}>
                    {usuario.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              name="perfil_id"
              label="ID del Perfil"
              type="text"
              fullWidth
              value={selectedPerfil?.perfil_id || ''}
              disabled
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">Cancelar</Button>
            <Button onClick={handleSaveAssociation} color="primary">Asociar</Button>
          </DialogActions>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID del Usuario</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userProfile.map((association) => (
                <TableRow key={association.usuario_id}>
                  <TableCell>{association.usuario_id}</TableCell>
                  <TableCell>{association.nombre}</TableCell>
                  <TableCell>
                    <IconButton color="secondary" onClick={() => handleDeleteAssociation(association.usuario_id, selectedPerfil.perfil_id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Dialog>
      </Container>
    );
  };
  
  export default Perfiles;
  