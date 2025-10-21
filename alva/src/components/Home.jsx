import { Box, Typography, Paper, Grid } from "@mui/material";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SpeedIcon from "@mui/icons-material/Speed";

const stockData = [
  { name: 'Auto', value: 40 },
  { name: 'Camioneta', value: 30 },
  { name: 'Camión', value: 20 },
  { name: 'Tractor', value: 10 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const ventasData = [
  { mes: 'Enero', ventas: 30 },
  { mes: 'Febrero', ventas: 45 },
  { mes: 'Marzo', ventas: 25 },
  { mes: 'Abril', ventas: 60 },
];

export default function Home() {
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Bienvenido al panel de control. Resumen de stock, ventas y actividad reciente.
      </Typography>

      {/* Tarjetas de indicadores */}
      <Grid container spacing={3} mt={2}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <InventoryIcon color="primary" sx={{ fontSize: 40 }} />
            <Box>
              <Typography variant="h6">120</Typography>
              <Typography variant="body2" color="text.secondary">
                Productos en stock
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <ShoppingCartIcon color="success" sx={{ fontSize: 40 }} />
            <Box>
              <Typography variant="h6">35</Typography>
              <Typography variant="body2" color="text.secondary">
                Ventas este mes
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <SpeedIcon color="warning" sx={{ fontSize: 40 }} />
            <Box>
              <Typography variant="h6">Alta</Typography>
              <Typography variant="body2" color="text.secondary">
                Actividad reciente
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Gráficas */}
      <Grid container spacing={3} mt={3}>
        {/* Stock por tipo de neumático */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Stock por tipo de neumático
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={stockData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  {stockData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Ventas por mes */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Ventas por mes
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={ventasData}>
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="ventas" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
