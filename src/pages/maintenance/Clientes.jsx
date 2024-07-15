import React, { useState, useEffect, useContext } from 'react';
import api from '../../components/axiosConfig';
import { Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from '@mui/material';
import { Edit } from '@mui/icons-material';
import GlobalAlert from '../../components/GlobalAlert';
import ModalCliente from '../../components/maintenance/ModalCliente';
import { LoadingContext } from '../../context/LoadingContext';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [openClienteModal, setOpenClienteModal] = useState(false);
  const [reload, setReload] = useState(false);
  const { setIsLoading } = useContext(LoadingContext);

  useEffect(() => {
    fetchClientes();
    setReload(false)
  }, [reload]);

  const fetchClientes = async () => {
    setIsLoading(true)
    try {
      const response = await api.get('/maintenance/getClientes');
      if (Array.isArray(response.data.client)) {
        setClientes(response.data.client);
      } else {
        GlobalAlert.showError('Error fetching client: Data is not an array');
      }
    } catch (error) {
      let response = error.response?.data ?? null;
      if(response) {
        GlobalAlert.showError('Error fetching client', response.message);
      } else {
        GlobalAlert.showError('Error logging in', error);
      }
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div>
      <Box sx={{ backgroundColor: '#6A1B9A', color: 'white', padding: '16px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">Clientes</Typography>
        <Button variant="contained" color="primary" onClick={() => { setSelectedCliente(null); setOpenClienteModal(true); }}>
          Crear
        </Button>
      </Box>
      <TableContainer component={Paper} style={{ marginBottom: '2rem' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Codigo</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Identidad</TableCell>
              <TableCell>Rtn</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Correo</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
            <TableBody>
                {Array.isArray(clientes) && clientes.length > 0 ? (
                    clientes.map((Cliente ) => (
                        <TableRow key={Cliente.cliente_id}>
                            <TableCell>{Cliente.cliente_id}</TableCell>
                            <TableCell>{Cliente.codigo_interno}</TableCell>
                            <TableCell>{Cliente.primer_nombre || Cliente.segundo_nombre || Cliente.primer_apellido || Cliente.segundo_apellido}</TableCell>
                            <TableCell>{Cliente.numero_identidad}</TableCell>
                            <TableCell>{Cliente.rtn}</TableCell>
                            <TableCell>{Cliente.telefono}</TableCell>
                            <TableCell>{Cliente.correo}</TableCell>
                            <TableCell>{Cliente.estado == '1' ? 'Activo' : 'Inactivo'}</TableCell>
                            <TableCell>
                                <IconButton onClick={() => { setSelectedCliente(Cliente); setOpenClienteModal(true); }}>
                                    <Edit />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={9} align="center">No hay datos disponibles</TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
      </TableContainer>

      <ModalCliente
        open={openClienteModal}
        handleClose={() => setOpenClienteModal(false)}
        Cliente={selectedCliente}
        setReload={setReload}
      />
    </div>
  );
};

export default Clientes;
