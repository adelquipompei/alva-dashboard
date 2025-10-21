import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  LinearProgress,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import {
  TrendingUp,
  LocalShipping,
  Inventory2,
  AttachMoney,
  People,
  Star,
  Warning,
  CheckCircle
} from '@mui/icons-material';

// Componente de tarjeta de métrica
const MetricCard = ({ title, value, change, icon, color = '#1976d2' }) => (
  <Card sx={{ height: '100%', boxShadow: 3 }}>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography color="textSecondary" gutterBottom variant="overline">
            {title}
          </Typography>
          <Typography variant="h4" component="div" fontWeight="bold">
            {value}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ color: change >= 0 ? 'success.main' : 'error.main' }}
          >
            {change >= 0 ? '+' : ''}{change}% vs mes anterior
          </Typography>
        </Box>
        <Avatar sx={{ bgcolor: color, width: 56, height: 56 }}>
          {icon}
        </Avatar>
      </Box>
    </CardContent>
  </Card>
);

// Componente de progreso de ventas
const SalesProgress = ({ title, progress, value, color }) => (
  <Box mb={3}>
    <Box display="flex" justifyContent="space-between" mb={1}>
      <Typography variant="body2" fontWeight="medium">
        {title}
      </Typography>
      <Typography variant="body2" color="textSecondary">
        {value}
      </Typography>
    </Box>
    <LinearProgress 
      variant="determinate" 
      value={progress} 
      sx={{ 
        height: 8, 
        borderRadius: 4,
        backgroundColor: '#f0f0f0',
        '& .MuiLinearProgress-bar': {
          backgroundColor: color
        }
      }} 
    />
  </Box>
);

// Componente Home principal
const Home = () => {
  // Datos de ejemplo
  const metrics = [
    {
      title: 'VENTAS TOTALES',
      value: '$284,200',
      change: 12.5,
      icon: <AttachMoney />,
      color: '#2e7d32'
    },
    {
      title: 'NEUMÁTICOS VENDIDOS',
      value: '1,248',
      change: 8.3,
      icon: <Inventory2 />,
      color: '#ed6c02'
    },
    {
      title: 'CLIENTES NUEVOS',
      value: '89',
      change: 15.2,
      icon: <People />,
      color: '#9c27b0'
    },
    {
      title: 'PEDIDOS PENDIENTES',
      value: '23',
      change: -5.1,
      icon: <LocalShipping />,
      color: '#d32f2f'
    }
  ];

  const topProducts = [
    { name: 'Michelin Pilot Sport 4', sales: 156, rating: 4.8 },
    { name: 'Bridgestone Turanza T005', sales: 134, rating: 4.7 },
    { name: 'Pirelli P Zero', sales: 98, rating: 4.9 },
    { name: 'Continental PremiumContact 6', sales: 87, rating: 4.6 },
    { name: 'Goodyear Eagle F1', sales: 76, rating: 4.5 }
  ];

  const recentActivities = [
    { action: 'Pedido completado', details: 'Orden #2842 - Michelin Pilot', status: 'success', time: 'Hace 5 min' },
    { action: 'Stock bajo', details: 'Bridgestone Turanza 205/55R16', status: 'warning', time: 'Hace 12 min' },
    { action: 'Nuevo cliente', details: 'AutoService Martínez', status: 'info', time: 'Hace 25 min' },
    { action: 'Venta mayorista', details: '50 unid. - Pirelli P Zero', status: 'success', time: 'Hace 1 hora' }
  ];

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Dashboard de Ventas - Neumáticos
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Resumen general de ventas y métricas de performance
        </Typography>
      </Box>

      {/* Métricas principales */}
      <Grid container spacing={3} mb={4}>
        {metrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <MetricCard {...metric} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Columna izquierda - Gráficos y progreso */}
        <Grid item xs={12} md={8}>
          <Card sx={{ boxShadow: 3, mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Progreso de Ventas Mensual
              </Typography>
              <SalesProgress 
                title="Neumáticos de Alto Rendimiento" 
                progress={75} 
                value="$142,300" 
                color="#2e7d32"
              />
              <SalesProgress 
                title="Neumáticos Todo Terreno" 
                progress={60} 
                value="$89,500" 
                color="#ed6c02"
              />
              <SalesProgress 
                title="Neumáticos Urbanos" 
                progress={45} 
                value="$52,400" 
                color="#1976d2"
              />
            </CardContent>
          </Card>

          {/* Productos más vendidos */}
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Productos Más Vendidos
              </Typography>
              <List>
                {topProducts.map((product, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemIcon>
                        <Chip 
                          label={`#${index + 1}`} 
                          size="small" 
                          color={index < 3 ? "primary" : "default"}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={product.name}
                        secondary={`${product.sales} unidades vendidas`}
                      />
                      <Box display="flex" alignItems="center">
                        <Star sx={{ color: '#ffc107', fontSize: 18, mr: 0.5 }} />
                        <Typography variant="body2">
                          {product.rating}
                        </Typography>
                      </Box>
                    </ListItem>
                    {index < topProducts.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Columna derecha - Actividad reciente */}
        <Grid item xs={12} md={4}>
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Actividad Reciente
              </Typography>
              <List dense>
                {recentActivities.map((activity, index) => (
                  <ListItem key={index} sx={{ py: 1.5 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {activity.status === 'success' && (
                        <CheckCircle sx={{ color: 'success.main' }} />
                      )}
                      {activity.status === 'warning' && (
                        <Warning sx={{ color: 'warning.main' }} />
                      )}
                      {activity.status === 'info' && (
                        <TrendingUp sx={{ color: 'info.main' }} />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={activity.action}
                      secondary={activity.details}
                      primaryTypographyProps={{ variant: 'body2', fontWeight: 'medium' }}
                      secondaryTypographyProps={{ variant: 'caption' }}
                    />
                    <Typography variant="caption" color="textSecondary">
                      {activity.time}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          {/* Métricas rápidas */}
          <Card sx={{ boxShadow: 3, mt: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>
                Resumen del Día
              </Typography>
              <Box sx={{ color: 'white' }}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Ventas hoy:</Typography>
                  <Typography variant="body2" fontWeight="bold">$12,840</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Unidades vendidas:</Typography>
                  <Typography variant="body2" fontWeight="bold">54</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Clientes atendidos:</Typography>
                  <Typography variant="body2" fontWeight="bold">28</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;