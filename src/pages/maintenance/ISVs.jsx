import React, { useState, useEffect, useContext } from 'react';
import api from '../../components/axiosConfig';
import { Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from '@mui/material';
import { Edit } from '@mui/icons-material';
import GlobalAlert from '../../components/GlobalAlert';
import ModalISV from '../../components/maintenance/ModalISV';
import { LoadingContext } from '../../context/LoadingContext';

const ISVs = () => {
  const [isvs, setISVs] = useState([]);
  const [selectedISV, setSelectedISV] = useState(null);
  const [openISVModal, setOpenISVModal] = useState(false);
  const [reload, setReload] = useState(false);
  const { setIsLoading } = useContext(LoadingContext);

  useEffect(() => {
    fetchISVs();
    setReload(false);
  }, [reload]);

  const fetchISVs = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/maintenance/getISVs');
      if (Array.isArray(response.data.isvs)) {
        setISVs(response.data.isvs);
      } else {
        GlobalAlert.showError('Error fetching ISVs: Data is not an array');
      }
    } catch (error) {
      let response = error.response?.data ?? null;
      if (response) {
        GlobalAlert.showError('Error fetching ISVs', response.message);
      } else {
        GlobalAlert.showError('Error fetching ISVs', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Box sx={{ backgroundColor: 'primary.main', color: 'primary.contrastText', padding: '16px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">ISVs</Typography>
        <Button variant="contained" color="primary" onClick={() => { setSelectedISV(null); setOpenISVModal(true); }}>
          Crear
        </Button>
      </Box>
      <TableContainer component={Paper} style={{ marginBottom: '2rem' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Porcentaje</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(isvs) && isvs.length > 0 ? (
              isvs.map((isv) => (
                <TableRow key={isv.isv_id}>
                  <TableCell>{isv.isv_id}</TableCell>
                  <TableCell>{isv.nombre}</TableCell>
                  <TableCell>{isv.porcentaje}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => { setSelectedISV(isv); setOpenISVModal(true); }}>
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
      {openISVModal && (
        <ModalISV
          open={openISVModal}
          onClose={() => setOpenISVModal(false)}
          isv={selectedISV}
          setReload={setReload}
        />
      )}
    </div>
  );
};

export default ISVs;
