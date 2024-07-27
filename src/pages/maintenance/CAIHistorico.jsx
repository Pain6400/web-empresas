import React, { useState, useEffect, useContext } from 'react';
import api from '../../components/axiosConfig';
import { Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from '@mui/material';
import { Edit } from '@mui/icons-material';
import GlobalAlert from '../../components/GlobalAlert';
import ModalCAIHistorico from '../../components/maintenance/ModalCAIHistorico';
import { LoadingContext } from '../../context/LoadingContext';

const CAIHistorico = () => {
  const [caiHistorico, setCaiHistorico] = useState([]);
  const [selectedCAI, setSelectedCAI] = useState(null);
  const [openCAIModal, setOpenCAIModal] = useState(false);
  const [reload, setReload] = useState(false);
  const { setIsLoading } = useContext(LoadingContext);

  useEffect(() => {
    fetchCAIHistorico();
    setReload(false);
  }, [reload]);

  const fetchCAIHistorico = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/maintenance/getCAIHistorico');
      if (Array.isArray(response.data.caiHistorico)) {
        setCaiHistorico(response.data.caiHistorico);
      } else {
        GlobalAlert.showError('Error fetching caiHistorico: Data is not an array');
      }
    } catch (error) {
      let response = error.response?.data ?? null;
      if (response) {
        GlobalAlert.showError('Error fetching caiHistorico', response.message);
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
        <Typography variant="h5">CAI Histórico</Typography>
        <Button variant="contained" color="primary" onClick={() => { setSelectedCAI(null); setOpenCAIModal(true); }}>
          Crear
        </Button>
      </Box>
      <TableContainer component={Paper} style={{ marginBottom: '2rem' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>CAI</TableCell>
              <TableCell>Factura Desde</TableCell>
              <TableCell>Factura Hasta</TableCell>
              <TableCell>Última Factura Generada</TableCell>
              <TableCell>Fecha Vigencia</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(caiHistorico) && caiHistorico.length > 0 ? (
              caiHistorico.map((cai) => (
                <TableRow key={cai.cai}>
                  <TableCell>{cai.cai}</TableCell>
                  <TableCell>{cai.factura_desde}</TableCell>
                  <TableCell>{cai.factura_hasta}</TableCell>
                  <TableCell>{cai.ultima_factura_generada}</TableCell>
                  <TableCell>{cai.fecha_vigencia}</TableCell>
                  <TableCell>{cai.estado == '1' ? 'Activo' : 'Inactivo'}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => { setSelectedCAI(cai); setOpenCAIModal(true); }}>
                      <Edit />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">No hay datos disponibles</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <ModalCAIHistorico
        open={openCAIModal}
        handleClose={() => setOpenCAIModal(false)}
        cai={selectedCAI}
        setReload={setReload}
      />
    </div>
  );
};

export default CAIHistorico;
