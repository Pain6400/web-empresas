import React, { useState, useEffect, useContext } from 'react';
import api from '../../components/axiosConfig';
import { Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from '@mui/material';
import { Edit } from '@mui/icons-material';
import GlobalAlert from '../../components/GlobalAlert';
import ModalProveedor from '../../components/maintenance/ModalProveedor';
import { LoadingContext } from '../../context/LoadingContext';

const Proveedor = () => {
  const [proveedores, setProveedores] = useState([]);
  const [selectedProveedor, setSelectedProveedor] = useState(null);
  const [openProveedorModal, setOpenProveedorModal] = useState(false);
  const [reload, setReload] = useState(false);
  const { setIsLoading } = useContext(LoadingContext);

  useEffect(() => {
    fetchProveedores();
    setReload(false);
  }, [reload]);

  const fetchProveedores = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/maintenance/getProveedores');
      if (Array.isArray(response.data.proveedores)) {
        setProveedores(response.data.proveedores);
      } else {
        GlobalAlert.showError('Error fetching proveedores: Data is not an array');
      }
    } catch (error) {
      let response = error.response?.data ?? null;
      if (response) {
        GlobalAlert.showError('Error fetching proveedores', response.message);
      } else {
        GlobalAlert.showError('Error logging in', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Box sx={{ backgroundColor: 'primary.main', color: 'primary.contrastText', padding: '16px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">Proveedores</Typography>
        <Button variant="contained" color="primary" onClick={() => { setSelectedProveedor(null); setOpenProveedorModal(true); }}>
          Crear
        </Button>
      </Box>
      <TableContainer component={Paper} style={{ marginBottom: '2rem' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Código Interno</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>RTN</TableCell>
              <TableCell>Número de Identidad</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Dirección</TableCell>
              <TableCell>Correo Electrónico</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(proveedores) && proveedores.length > 0 ? (
              proveedores.map((proveedor) => (
                <TableRow key={proveedor.proveedor_id}>
                  <TableCell>{proveedor.proveedor_id}</TableCell>
                  <TableCell>{proveedor.codigo_interno}</TableCell>
                  <TableCell>{proveedor.nombre}</TableCell>
                  <TableCell>{proveedor.rtn}</TableCell>
                  <TableCell>{proveedor.numero_identidad}</TableCell>
                  <TableCell>{proveedor.telefono}</TableCell>
                  <TableCell>{proveedor.direccion}</TableCell>
                  <TableCell>{proveedor.correo_electronico}</TableCell>
                  <TableCell>{proveedor.estado ? 'Activo' : 'Inactivo'}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => { setSelectedProveedor(proveedor); setOpenProveedorModal(true); }}>
                      <Edit />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={14} align="center">No hay datos disponibles</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <ModalProveedor
        open={openProveedorModal}
        handleClose={() => setOpenProveedorModal(false)}
        proveedor={selectedProveedor}
        setReload={setReload}
      />
    </div>
  );
};

export default Proveedor;
