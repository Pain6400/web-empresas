import React, { useState, useEffect, useContext } from 'react';
import api from '../../components/axiosConfig';
import { Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from '@mui/material';
import { Edit } from '@mui/icons-material';
import GlobalAlert from '../../components/GlobalAlert';
import ModalUnidadMedida from '../../components/maintenance/ModalUnidadMedida';
import { LoadingContext } from '../../context/LoadingContext';

const UnidadesMedida = () => {
  const [unidadesMedida, setUnidadesMedida] = useState([]);
  const [selectedUnidadMedida, setSelectedUnidadMedida] = useState(null);
  const [openUnidadMedidaModal, setOpenUnidadMedidaModal] = useState(false);
  const [reload, setReload] = useState(false);
  const { setIsLoading } = useContext(LoadingContext);

  useEffect(() => {
    fetchUnidadesMedida();
    setReload(false);
  }, [reload]);

  const fetchUnidadesMedida = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/maintenance/getUnidadesMedidas');
      if (Array.isArray(response.data.unidadesMedida)) {
        setUnidadesMedida(response.data.unidadesMedida);
      } else {
        GlobalAlert.showError('Error fetching unidades de medida: Data is not an array');
      }
    } catch (error) {
      let response = error.response?.data ?? null;
      if (response) {
        GlobalAlert.showError('Error fetching unidades de medida', response.message);
      } else {
        GlobalAlert.showError('Error fetching unidades de medida', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Box sx={{ backgroundColor: 'primary.main', color: 'primary.contrastText', padding: '16px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">Unidades de Medida</Typography>
        <Button variant="contained" color="primary" onClick={() => { setSelectedUnidadMedida(null); setOpenUnidadMedidaModal(true); }}>
          Crear
        </Button>
      </Box>
      <TableContainer component={Paper} style={{ marginBottom: '2rem' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Siglas</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(unidadesMedida) && unidadesMedida.length > 0 ? (
              unidadesMedida.map((unidadMedida) => (
                <TableRow key={unidadMedida.unidad_medida_id}>
                  <TableCell>{unidadMedida.unidad_medida_id}</TableCell>
                  <TableCell>{unidadMedida.nombre}</TableCell>
                  <TableCell>{unidadMedida.siglas}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => { setSelectedUnidadMedida(unidadMedida); setOpenUnidadMedidaModal(true); }}>
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
      {openUnidadMedidaModal && (
        <ModalUnidadMedida
          open={openUnidadMedidaModal}
          onClose={() => setOpenUnidadMedidaModal(false)}
          unidadMedida={selectedUnidadMedida}
          setReload={setReload}
        />
      )}
    </div>
  );
};

export default UnidadesMedida;
