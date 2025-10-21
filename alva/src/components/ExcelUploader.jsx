import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
  Paper,
  IconButton,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
//import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DescriptionIcon from '@mui/icons-material/Description';

const ExcelUploader = ({ setLogueado }) => {
  const [file, setFile] = useState(null);
  const [precios, setPrecios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleUpload = async () => {
    if (!file) {
      setSnackbar({ open: true, message: "Selecciona un archivo primero", severity: "warning" });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:3000/upload", formData, { headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` } });
      if (res.status === 403) setLogueado(false);
      setSnackbar({ open: true, message: res.data, severity: "success" });
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchPrecios();
    } catch (error) {
      if (error.response && error.response.status === 403) {
        setLogueado(false);
        setSnackbar({ open: true, message: "Token inválido o expirado", severity: "error" });
      } else {
        setSnackbar({ open: true, message: "Error subiendo el archivo", severity: "error" });
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPrecios = async () => {
    try {
      const res = await axios.get("http://localhost:3000/precios");
      if (res.status === 403) setLogueado(false);
      const datos = res.data.map((p) => ({
        ...p,
        medida: `${p.ancho}/${p.perfil} R${p.rodado}`,
      }));
      setPrecios(datos);
    } catch (error) {
      console.error(error);

    }
  };

  useEffect(() => {
    fetchPrecios();
  }, []);

  // Drag & Drop
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  return (
    <Box p={3}>
      <Typography variant="h4" mb={3} fontWeight="bold">
        Subir Excel de Precios
      </Typography>

      {/* Drag & Drop */}
      <Paper
        elevation={0}
        sx={{
          border: `2px dashed ${dragOver ? "#1976d2" : "#ccc"}`,
          borderRadius: 3,
          p: 5,
          textAlign: "center",
          color: dragOver ? "#1976d2" : "#555",
          cursor: "pointer",
          transition: "all 0.3s ease",
          mb: 3,
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        {file ? (
          <DescriptionIcon sx={{ fontSize: 60, mb: 2 }} />
        ) : (
          <CloudUploadIcon sx={{ fontSize: 60, mb: 2 }} />
        )}
        <Typography variant="h6">
          {file ? `Archivo seleccionado: ${file.name}` : "Arrastrá el archivo o hacé click aquí"}
        </Typography>
        {file && (
          <IconButton
            sx={{ mt: 1 }}
            onClick={(e) => {
              e.stopPropagation();
              setFile(null);
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
          >
            <DeleteIcon />
          </IconButton>
        )}
        <input
          ref={fileInputRef}
          id="file-upload"
          type="file"
          style={{ display: "none" }}
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setFile(e.target.files[0]);
              e.target.value = "";
            }
          }}
          accept=".xlsx,.xls"
        />
      </Paper>

      <Button
        variant="contained"
        color="primary"
        startIcon={<UploadFileIcon />}
        onClick={handleUpload}
        disabled={loading}
        sx={{ mb: 4 }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "Subir Archivo"}
      </Button>

      {/* Tabla de precios más facha */}
      <Paper sx={{ overflowX: "auto" }}>
        <Table sx={{ minWidth: 600 }}>
          <TableHead sx={{ backgroundColor: "#1976d2" }}>
            <TableRow>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>ID</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Marca</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Medida</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Precio</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {precios.map((p, index) => (
              <TableRow
                key={p.id}
                sx={{
                  backgroundColor: index % 2 === 0 ? "#f5f5f5" : "#fff",
                  "&:hover": { backgroundColor: "#e3f2fd" },
                }}
              >
                <TableCell>{p.id}</TableCell>
                <TableCell>{p.marca}</TableCell>
                <TableCell>{p.medida}</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>${p.precio}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ExcelUploader;
