import React from "react";
import { Box, Grid, Typography, Card, CardContent } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const metricas = [
  {
    titulo: "Ventas del mes",
    valor: "$ 482.300",
    icono: <TrendingUpIcon sx={{ fontSize: 40, color: "#0d6efd" }} />,
    cambio: "+12%",
    color: "#0d6efd",
  },
  {
    titulo: "Clientes activos",
    valor: "1.249",
    icono: <PeopleAltIcon sx={{ fontSize: 40, color: "#198754" }} />,
    cambio: "+5%",
    color: "#198754",
  },
  {
    titulo: "Productos en stock",
    valor: "834",
    icono: <InventoryIcon sx={{ fontSize: 40, color: "#ffc107" }} />,
    cambio: "-3%",
    color: "#ffc107",
  },
  {
    titulo: "Pedidos pendientes",
    valor: "27",
    icono: <ShoppingCartIcon sx={{ fontSize: 40, color: "#dc3545" }} />,
    cambio: "+8%",
    color: "#dc3545",
  },
];

const MetricasDemo = () => {
  return (
    <Box sx={{ p: 4 }}>
      <Typography
        variant="h4"
        sx={{ mb: 4, fontWeight: "bold", textAlign: "center", color: "#333" }}
      >
        📊 Métricas generales
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {metricas.map((m, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Card
              sx={{
                borderRadius: 4,
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                },
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  gap: 1,
                }}
              >
                <Box sx={{ mb: 1 }}>{m.icono}</Box>

                <Typography variant="h6" sx={{ fontWeight: 600, color: "#555" }}>
                  {m.titulo}
                </Typography>

                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: "bold",
                    color: m.color,
                  }}
                >
                  {m.valor}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: m.cambio.startsWith("+") ? "#28a745" : "#dc3545",
                    fontWeight: 500,
                  }}
                >
                  {m.cambio} respecto al mes anterior
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MetricasDemo;
