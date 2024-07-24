import React, { useState, useEffect, useContext } from 'react';
import api from '../../components/axiosConfig';
import { Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from '@mui/material';
import { Edit } from '@mui/icons-material';
import GlobalAlert from '../../components/GlobalAlert';
import ModalClasificacionProducto from '../../components/maintenance/ModalClasificacionProducto';
import { LoadingContext } from '../../context/LoadingContext';

const ClasificacionProducto = () => {
  const [clasificacionProductos, setClasificacionProductos] = useState([]);
  const [selectedClasificacionProducto, setSelectedClasificacionProducto] = useState(null);
  const [openClasificacionProductoModal, setOpenClasificacionProductoModal] = useState(false);
  const [reload, setReload] = useState(false);
  const { setIsLoading } = useContext(LoadingContext);

  useEffect(() => {
    fetchClasificacionProductos();
    setReload(false);
  }, [reload]);

  const fetchClasificacionProductos = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/maintenance/getClasificacionProductos');
      if (Array.isArray(response.data.clasificacionProducto)) {
        setClasificacionProductos(response.data.clasificacionProducto);
      } else {
        GlobalAlert.showError('Error fetching clasificacionProducto: Data is not an array');
      }
    } catch (error) {
      let response = error.response?.data ?? null;
      if (response) {
        GlobalAlert.showError('Error fetching clasificacionProducto', response.message);
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
        <Typography variant="h5">Clasificación de Producto</Typography>
        <Button variant="contained" color="primary" onClick={() => { setSelectedClasificacionProducto(null); setOpenClasificacionProductoModal(true); }}>
          Crear
        </Button>
      </Box>
      <TableContainer component={Paper} style={{ marginBottom: '2rem' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Porcentaje Tercera Edad</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(clasificacionProductos) && clasificacionProductos.length > 0 ? (
              clasificacionProductos.map((clasificacionProducto) => (
                <TableRow key={clasificacionProducto.clasificacion_producto_id}>
                  <TableCell>{clasificacionProducto.clasificacion_producto_id}</TableCell>
                  <TableCell>{clasificacionProducto.nombre}</TableCell>
                  <TableCell>{clasificacionProducto.porcentaje_tercera_edad}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => { setSelectedClasificacionProducto(clasificacionProducto); setOpenClasificacionProductoModal(true); }}>
                      <Edit />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">No hay datos disponibles</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <ModalClasificacionProducto
        open={openClasificacionProductoModal}
        handleClose={() => setOpenClasificacionProductoModal(false)}
        clasificacionProducto={selectedClasificacionProducto}
        setReload={setReload}
      />
    </div>
  );
};

export default ClasificacionProducto;
