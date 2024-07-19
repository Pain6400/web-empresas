import React, { useState, useEffect, useContext } from 'react';
import api from '../../components/axiosConfig';
import { Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from '@mui/material';
import { Edit } from '@mui/icons-material';
import GlobalAlert from '../../components/GlobalAlert';
import ModalBodega from '../../components/maintenance/ModalBodega';
import { LoadingContext } from '../../context/LoadingContext';

const Bodegas = () => {
  const [bodegas, setBodegas] = useState([]);
  const [selectedBodega, setSelectedBodega] = useState(null);
  const [openBodegaModal, setOpenBodegaModal] = useState(false);
  const [reload, setReload] = useState(false);
  const { setIsLoading } = useContext(LoadingContext);

  useEffect(() => {
    fetchBodegas();
    setReload(false);
  }, [reload]);

  const fetchBodegas = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/maintenance/getBodegas');
      if (Array.isArray(response.data.bodega)) {
        setBodegas(response.data.bodega);
      } else {
        GlobalAlert.showError('Error fetching bodega: Data is not an array');
      }
    } catch (error) {
      let response = error.response?.data ?? null;
      if (response) {
        GlobalAlert.showError('Error fetching bodega', response.message);
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
        <Typography variant="h5">Bodegas</Typography>
        <Button variant="contained" color="primary" onClick={() => { setSelectedBodega(null); setOpenBodegaModal(true); }}>
          Crear
        </Button>
      </Box>
      <TableContainer component={Paper} style={{ marginBottom: '2rem' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Principal</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(bodegas) && bodegas.length > 0 ? (
              bodegas.map((bodega) => (
                <TableRow key={bodega.bodega_id}>
                  <TableCell>{bodega.bodega_id}</TableCell>
                  <TableCell>{bodega.nombre}</TableCell>
                  <TableCell>{bodega.estado === 1 ? 'Activo' : 'Inactivo'}</TableCell>
                  <TableCell>{bodega.principal === 1 ? 'Sí' : 'No'}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => { setSelectedBodega(bodega); setOpenBodegaModal(true); }}>
                      <Edit />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">No hay datos disponibles</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <ModalBodega
        open={openBodegaModal}
        handleClose={() => setOpenBodegaModal(false)}
        bodega={selectedBodega}
        setReload={setReload}
      />
    </div>
  );
};

export default Bodegas;
