import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Box,
  IconButton,
  Collapse,
  Typography,
  Chip,
} from '@mui/material';
import { Person, ShoppingCart, ExpandMore, ExpandLess } from '@mui/icons-material';

function ListaPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [filter, setFilter] = useState('');
  const [openRows, setOpenRows] = useState({});

 useEffect(() => {
  const fetchPedidos = async () => {
    try {
      const res = await axios.get(
        `http://${import.meta.env.VITE_SERVER}:${import.meta.env.VITE_PORT}/detalle-pedido`,
        {
          headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
        }
      );
      const datos = res.data.map((p) => ({
        ...p,
        cliente: `${p.nombre} ${p.apellido}`,
        estado: p.estado || 'Pendiente',
      }));
      setPedidos(datos);
    } catch (err) {
      console.error('Error cargando pedidos:', err);
    }
  };

  // Cargar datos inmediatamente
  fetchPedidos();

  // Configurar polling cada 30 segundos
  const intervalId = setInterval(() => {
    fetchPedidos();
  }, 30000); // 30 segundos

  // Cleanup: limpiar el intervalo cuando el componente se desmonte
  return () => {
    clearInterval(intervalId);
  };
}, []);

  const filteredPedidos = pedidos.filter(
    (p) =>
      p.cliente.toLowerCase().includes(filter.toLowerCase()) ||
      p.descripcion.toLowerCase().includes(filter.toLowerCase())
  );

  const toggleRow = (id) => {
    setOpenRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Box sx={{ p: 3 }}>
      <TextField
        label="Buscar pedidos"
        variant="outlined"
        fullWidth
        sx={{ mb: 3 }}
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#212529'}}>
            <TableRow>
              <TableCell sx={{ color: '#ffc107', fontWeight: 'bold' }}>Cliente</TableCell>
              <TableCell sx={{ color: '#ffc107', fontWeight: 'bold' }}>Pedido #</TableCell>
              <TableCell sx={{ color: '#ffc107', fontWeight: 'bold' }}>Producto</TableCell>
              <TableCell sx={{ color: '#ffc107', fontWeight: 'bold' }}>Cantidad</TableCell>
              <TableCell sx={{ color: '#ffc107', fontWeight: 'bold' }}>Precio</TableCell>
              <TableCell sx={{ color: '#ffc107', fontWeight: 'bold' }}>Estado</TableCell>
              <TableCell sx={{ color: '#ffc107', fontWeight: 'bold' }}>Detalle</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredPedidos.map((p) => (
              <React.Fragment key={p.id_pedido_}>
                <TableRow
                  sx={{
                    '&:nth-of-type(even)': { backgroundColor: '#f5f5f5' },
                    '&:hover': { backgroundColor: '#2125291a' },
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Person sx={{ color: '#1976d2' }} />
                      {p.cliente}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ShoppingCart sx={{ color: '#ff9800' }} />
                      {p.id_pedido_}
                    </Box>
                  </TableCell>
                  <TableCell>{p.descripcion}</TableCell>
                  <TableCell>{p.cantidad}</TableCell>
                  <TableCell>${p.precio_compra}</TableCell>
                  <TableCell>
                    <Chip
                      label={p.estado}
                      color={
                        p.estado === 'Entregado'
                          ? 'success'
                          : p.estado === 'Cancelado'
                          ? 'error'
                          : 'warning'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => toggleRow(p.id_pedido_)}>
                      {openRows[p.id_pedido_] ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                  </TableCell>
                </TableRow>

                {/* Row expandida */}
                <TableRow>
                  <TableCell colSpan={7} sx={{ p: 0, border: 0 }}>
                    <Collapse in={openRows[p.id_pedido_]} timeout="auto" unmountOnExit>
                      <Box sx={{ margin: 2, backgroundColor: '#f9f9f9', p: 2, borderRadius: 1 }}>
                        <Typography variant="subtitle2">
                          <strong>Nombre:</strong> {p.nombre}
                        </Typography>
                        <Typography variant="subtitle2">
                          <strong>Apellido:</strong> {p.apellido}
                        </Typography>
                        <Typography variant="subtitle2">
                          <strong>Dirección:</strong> {p.direccion}
                        </Typography>
                        <Typography variant="subtitle2">
                          <strong>Teléfono:</strong> {p.telefono}
                        </Typography>
                        <Typography variant="subtitle2">
                          <strong>Email:</strong> {p.email}
                        </Typography>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default ListaPedidos;
