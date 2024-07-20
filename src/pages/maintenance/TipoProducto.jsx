import React, { useState, useEffect, useContext } from 'react';
import api from '../../components/axiosConfig';
import { Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from '@mui/material';
import { Edit } from '@mui/icons-material';
import GlobalAlert from '../../components/GlobalAlert';
import ModalTipoProducto from '../../components/maintenance/ModalTipoProducto';
import { LoadingContext } from '../../context/LoadingContext';

const TipoProducto = () => {
  const [tipoProductos, setTipoProductos] = useState([]);
  const [selectedTipoProducto, setSelectedTipoProducto] = useState(null);
  const [openTipoProductoModal, setOpenTipoProductoModal] = useState(false);
  const [reload, setReload] = useState(false);
  const { setIsLoading } = useContext(LoadingContext);

  useEffect(() => {
    fetchTipoProductos();
    setReload(false);
  }, [reload]);

  const fetchTipoProductos = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/maintenance/getTipoProductos');
      if (Array.isArray(response.data.tipoProducto)) {
        setTipoProductos(response.data.tipoProducto);
      } else {
        GlobalAlert.showError('Error fetching tipoProducto: Data is not an array');
      }
    } catch (error) {
      let response = error.response?.data ?? null;
      if (response) {
        GlobalAlert.showError('Error fetching tipoProducto', response.message);
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
        <Typography variant="h5">Tipos de Producto</Typography>
        <Button variant="contained" color="primary" onClick={() => { setSelectedTipoProducto(null); setOpenTipoProductoModal(true); }}>
          Crear
        </Button>
      </Box>
      <TableContainer component={Paper} style={{ marginBottom: '2rem' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(tipoProductos) && tipoProductos.length > 0 ? (
              tipoProductos.map((tipoProducto) => (
                <TableRow key={tipoProducto.tipo_producto_id}>
                  <TableCell>{tipoProducto.tipo_producto_id}</TableCell>
                  <TableCell>{tipoProducto.nombre}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => { setSelectedTipoProducto(tipoProducto); setOpenTipoProductoModal(true); }}>
                      <Edit />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">No hay datos disponibles</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <ModalTipoProducto
        open={openTipoProductoModal}
        handleClose={() => setOpenTipoProductoModal(false)}
        tipoProducto={selectedTipoProducto}
        setReload={setReload}
      />
    </div>
  );
};

export default TipoProducto;
