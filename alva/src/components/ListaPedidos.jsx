import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TextField, Box, IconButton, Collapse, Typography, Chip, Skeleton, Button, MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import { Person, ShoppingCart, ExpandMore, ExpandLess, Refresh, ConfirmationNumber } from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import BoxBienvenida from './BoxBienvenida';

// Ajuste íconos Leaflet para Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// MiniMapa solo usa dirección + localidad
function MiniMapa({ direccion, localidad }) {
  const [position, setPosition] = useState(null);

  useEffect(() => {
    const fullDireccion = [direccion, localidad].filter(Boolean).join(', ');
    if (!fullDireccion) return setPosition([0, 0]);

    const fetchCoords = async () => {
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullDireccion)}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.length > 0) setPosition([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        else setPosition([0, 0]);
      } catch (err) {
        console.error('Error geocoding:', err);
        setPosition([0, 0]);
      }
    };
    fetchCoords();
  }, [direccion, localidad]);

  if (!position) return <Skeleton variant="rectangular" height={200} width="100%" />;
  if (position[0] === 0 && position[1] === 0) return <Typography>Sin ubicación</Typography>;

  return (
    <MapContainer center={position} zoom={16} style={{ height: 200, width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={position}>
        <Popup>{`${direccion}, ${localidad}`}</Popup>
      </Marker>
    </MapContainer>
  );
}

function ListaPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [filter, setFilter] = useState('');
  const [openRows, setOpenRows] = useState({});
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [refreshInterval, setRefreshInterval] = useState(60); // en segundos
  const intervalRef = useRef(null);

  const formatearPrecio = (precio) => {
    if (precio == null) return '-';
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2,
    }).format(precio);
  };

  const fetchPedidos = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://${import.meta.env.VITE_SERVER}:${import.meta.env.VITE_PORT}/historial-pedidos`, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
      });
      const datos = (res.data.historial || []).map(p => ({
        ...p,
        cliente: `${p.nombre} ${p.apellido}`,
        estado: p.estado || 'Pendiente',
      }));
      setPedidos(datos);
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Error cargando pedidos:', err);
    } finally {
      setLoading(false);
    }
  };

  // Manejo del refresco automático
  useEffect(() => {
    fetchPedidos();

    if (intervalRef.current) clearInterval(intervalRef.current);

    if (refreshInterval > 0) {
      intervalRef.current = setInterval(fetchPedidos, refreshInterval * 1000);
    }

    return () => clearInterval(intervalRef.current);
  }, [refreshInterval]);

  const filteredPedidos = pedidos.filter(
    p =>
    (p.cliente?.toLowerCase().includes(filter.toLowerCase()) ||
      p.descripcion?.toLowerCase().includes(filter.toLowerCase()))
  );

  const toggleRow = (id) => setOpenRows(prev => ({ ...prev, [id]: !prev[id] }));

  const formatearFecha = (fechaString) => {
    if (!fechaString) return 'Sin fecha';
    const fecha = new Date(fechaString);
    const hoy = new Date();
    const ayer = new Date(); ayer.setDate(hoy.getDate() - 1);
    const mismoDia = (a, b) => a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
    const hora = fecha.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
    if (mismoDia(fecha, hoy)) return `Hoy ${hora}`;
    if (mismoDia(fecha, ayer)) return `Ayer ${hora}`;
    return fecha.toLocaleDateString('es-AR') + ` ${hora}`;
  };
  let textBox = ` En esta página podés consultar todos los pedidos de tus clientes, filtrar por nombre o producto, ver detalles completos y la ubicación en el mapa.
          También podés actualizar la tabla manualmente o configurar un refresco automático según tu preferencia.`
  return (
    <Box sx={{ p: 3 }}>
     <BoxBienvenida icon={<ShoppingCart sx={{ color: '#ffc107', fontSize: 28 }} />} text={textBox} titulo=" Bienvenido a la lista de pedidos" />
      <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
        <TextField
          label="Buscar pedidos"
          variant="outlined"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          sx={{ flex: 1, background: '#ffc10745' }}
        />
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Refrescar cada</InputLabel>
          <Select sx={{ background: '#ffc10745' }}
            value={refreshInterval}
            label="Refrescar cada"
            onChange={(e) => setRefreshInterval(Number(e.target.value))}
          >
            <MenuItem value={0}>Desactivado</MenuItem>
            <MenuItem value={30}>30 seg</MenuItem>
            <MenuItem value={60}>1 min</MenuItem>
            <MenuItem value={120}>2 min</MenuItem>
            <MenuItem value={300}>5 min</MenuItem>
          </Select>
        </FormControl>
        <Button sx={{ backgroundColor: '#ffc107', color: '#212529' }}
          variant="contained"
          startIcon={<Refresh />}
          onClick={fetchPedidos}
        >
          Actualizar
        </Button>
      </Box>

      {lastUpdate && <Typography variant="caption" sx={{ mb: 1 }}>Última actualización: {lastUpdate.toLocaleTimeString()}</Typography>}

      <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#212529' }}>
            <TableRow>
              <TableCell sx={{ color: '#ffc107', fontWeight: 'bold' }}>Cliente</TableCell>
              <TableCell sx={{ color: '#ffc107', fontWeight: 'bold' }}>Pedido #</TableCell>
              <TableCell sx={{ color: '#ffc107', fontWeight: 'bold' }}>Producto</TableCell>
              <TableCell sx={{ color: '#ffc107', fontWeight: 'bold' }}>Cantidad</TableCell>
              <TableCell sx={{ color: '#ffc107', fontWeight: 'bold' }}>Precio</TableCell>
              <TableCell sx={{ color: '#ffc107', fontWeight: 'bold' }}>Estado</TableCell>
              <TableCell sx={{ color: '#ffc107', fontWeight: 'bold' }}>Fecha</TableCell>
              <TableCell sx={{ color: '#ffc107', fontWeight: 'bold' }}>Detalle</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              Array.from(new Array(5)).map((_, idx) => (
                <TableRow key={idx}>
                  {Array.from(new Array(8)).map((_, i) => (
                    <TableCell key={i}><Skeleton /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              filteredPedidos.map((p) => (
                <React.Fragment key={`${p.id_pedido_}-${p.id_producto_}`}>
                  <TableRow sx={{ '&:nth-of-type(even)': { backgroundColor: '#f5f5f5' }, '&:hover': { backgroundColor: '#2125291a' } }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Person sx={{ color: '#1976d2' }} />
                        {p.cliente}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ConfirmationNumber sx={{ color: '#ff9800' }} />
                        {p.id_pedido_}
                      </Box>
                    </TableCell>
                    <TableCell>{p.descripcion}</TableCell>
                    <TableCell>{p.cantidad}</TableCell>
                    <TableCell>{formatearPrecio(p.precio_compra)}</TableCell>
                    <TableCell>
                      <Chip
                        label={p.estado}
                        color={p.estado === 'Entregado' ? 'success' : p.estado === 'Cancelado' ? 'error' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{formatearFecha(p.fecha_registro)}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => toggleRow(p.id_pedido_)}>
                        {openRows[p.id_pedido_] ? <ExpandLess /> : <ExpandMore />}
                      </IconButton>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell colSpan={8} sx={{ p: 0, border: 0 }}>
                      <Collapse in={openRows[p.id_pedido_]} timeout="auto" unmountOnExit>
                        <Box sx={{ display: 'flex', gap: 2, margin: 2, p: 2, borderRadius: 1, alignItems: 'center' }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle2"><strong>Nombre:</strong> {p.nombre}</Typography>
                            <Typography variant="subtitle2"><strong>Apellido:</strong> {p.apellido}</Typography>
                            <Typography variant="subtitle2"><strong>Dirección:</strong> {p.direccion}</Typography>
                            <Typography variant="subtitle2"><strong>Localidad:</strong> {p.localidad}</Typography>
                            <Typography variant="subtitle2"><strong>Teléfono:</strong> {p.telefono}</Typography>
                            <Typography variant="subtitle2"><strong>Email:</strong> {p.email}</Typography>
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <MiniMapa
                              direccion={p.direccion}
                              localidad={p.localidad}
                            />
                          </Box>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default ListaPedidos;
