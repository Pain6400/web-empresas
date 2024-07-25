import React, { useState, useEffect, useContext } from 'react';
import api from '../../components/axiosConfig';
import { Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from '@mui/material';
import { Edit } from '@mui/icons-material';
import GlobalAlert from '../../components/GlobalAlert';
import ModalProducto from '../../components/maintenance/ModalProducto';
import { LoadingContext } from '../../context/LoadingContext';

const Producto = () => {
  const [productos, setProductos] = useState([]);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [openProductoModal, setOpenProductoModal] = useState(false);
  const [reload, setReload] = useState(false);
  const { setIsLoading } = useContext(LoadingContext);

  useEffect(() => {
    fetchProductos();
    setReload(false);
  }, [reload]);

  const fetchProductos = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/maintenance/getProductos');
      if (Array.isArray(response.data.productos)) {
        setProductos(response.data.productos);
      } else {
        GlobalAlert.showError('Error fetching productos: Data is not an array');
      }
    } catch (error) {
      let response = error.response?.data ?? null;
      if (response) {
        GlobalAlert.showError('Error fetching productos', response.message);
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
        <Typography variant="h5">Productos</Typography>
        <Button variant="contained" color="primary" onClick={() => { setSelectedProducto(null); setOpenProductoModal(true); }}>
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
              <TableCell>Costo Promedio</TableCell>
              <TableCell>Precio Sin Impuesto</TableCell>
              <TableCell>Precio Con Impuesto</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(productos) && productos.length > 0 ? (
              productos.map((producto) => (
                <TableRow key={producto.producto_id}>
                  <TableCell>{producto.producto_id}</TableCell>
                  <TableCell>{producto.codigo_interno}</TableCell>
                  <TableCell>{producto.nombre}</TableCell>
                  <TableCell>{producto.costo_promedio}</TableCell>
                  <TableCell>{producto.precio_sin_impuesto}</TableCell>
                  <TableCell>{producto.precio_con_impuesto}</TableCell>
                  <TableCell>{producto.estado == '1' ? 'Activo' : 'Inactivo'}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => { setSelectedProducto(producto); setOpenProductoModal(true); }}>
                      <Edit />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">No hay datos disponibles</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <ModalProducto
        open={openProductoModal}
        handleClose={() => setOpenProductoModal(false)}
        producto={selectedProducto}
        setReload={setReload}
      />
    </div>
  );
};

export default Producto;
