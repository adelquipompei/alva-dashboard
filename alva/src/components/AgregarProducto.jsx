import { useState, useCallback } from "react";
import "swiper/css";
import "swiper/css/navigation";
import imageCompression from "browser-image-compression";
import { useNavigate } from 'react-router-dom';

import {
  TextField,
  Button,
  Box,
  MenuItem,
  Typography,
  Snackbar,
  Paper,
  Grid,
  IconButton,
  Skeleton,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDropzone } from "react-dropzone";


export default function AgregarProducto() {
  const [producto, setProducto] = useState({
    marca: "",
    modelo: "",
    medida: "",
    tipo: "",
    precio: "",
    stock: "",
  });

  const [imagenes, setImagenes] = useState([]);
  const [open, setOpen] = useState(false);
  const [loadingGlobal, setLoadingGlobal] = useState(false);
  const [mensaje, setMensaje] = useState('')
  const [loading , setLoading] = useState(false)

  const handleChange = (e) => {
    setProducto({ ...producto, [e.target.name]: e.target.value });
  };

  // 🔧 Compresión de imagen
  const compressImage = async (file) => {
    const options = {
      maxSizeMB: 0.3,
      maxWidthOrHeight: 1280,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.error("❌ Error al comprimir:", error);
      return file;
    }
  };

  // 📦 Drag & Drop con compresión
  const onDrop = useCallback(async (acceptedFiles) => {
    setLoadingGlobal(true);

    const comprimidas = await Promise.all(
      acceptedFiles.map(async (file) => {
        const compressed = await compressImage(file);
        return {
          file: compressed,
          preview: URL.createObjectURL(compressed),
          loaded: false, // 🟡 nuevo estado por imagen
        };
      })
    );

    

    setImagenes((prev) => [...prev, ...comprimidas]);
    setLoadingGlobal(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: true,
  });

  const handleEliminarImagen = (index) => {
    setImagenes((prev) => prev.filter((_, i) => i !== index));
  };

  const navigate = useNavigate();
 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    // 1️⃣ Crear FormData
    const formData = new FormData();
    formData.append("marca", producto.marca);
    formData.append("modelo", producto.modelo);
    formData.append("medida", producto.medida);
    formData.append("tipo", producto.tipo);
    formData.append("precio", producto.precio);
    formData.append("stock", producto.stock);

    // 2️⃣ Agregar las imágenes comprimidas
    imagenes.forEach((img) => {
  // si no tiene nombre, le ponemos uno con extensión .jpg
  const fileWithName = new File([img.file], img.file.name || `imagen-${Date.now()}.jpg`, { type: img.file.type });
  formData.append("imagenes", fileWithName);
});


    // 3️⃣ Enviar todo al backend
    const res = await fetch("http://localhost:5000/add-producto", {
      method: "POST",
      body: formData, // no pongas headers manualmente
    });

    if (!res.ok) throw new Error("Error en la respuesta del servidor");

    setMensaje("Producto agregado correctamente ✅");
    setOpen(true);
    setProducto({
      marca: "",
      modelo: "",
      medida: "",
      tipo: "",
      precio: "",
      stock: "",
    });
    setImagenes([]);
  } catch (e) {
    setMensaje("Error! No se pudo agregar el producto ❌ " + e.message);
    setOpen(true);
  } finally {
    setLoading(false);
  }
};


  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
        p: 3,
      }}
    >
      <Paper
        elevation={5}
        sx={{
          p: 4,
          borderRadius: 4,
          width: "100%",
          maxWidth: 700,
          mt: 4,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <AddCircleIcon color="primary" sx={{ mr: 1, fontSize: 30 }} />
          <Typography variant="h5" fontWeight="bold">
            Agregar nuevo producto
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" mb={3}>
          Cargá la información del neumático y sus imágenes (drag & drop incluido).
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Marca"
                name="marca"
                value={producto.marca}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
           
            <Grid item xs={12} sm={6}>
              <TextField
                label="Medida"
                name="medida"
                placeholder="Ej: 205/55 R16"
                value={producto.medida}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12} sm={12}>
              <TextField
                sx={{ minWidth: 100 }}
                select
                label="Tipo"
                name="tipo"
                value={producto.tipo}
                onChange={handleChange}
                required
              >
                <MenuItem value="auto">Auto</MenuItem>
                <MenuItem value="camioneta">Camioneta</MenuItem>
                <MenuItem value="camión">Camión</MenuItem>
                <MenuItem value="tractor">Tractor</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Precio ($)"
                name="precio"
                type="number"
                value={producto.precio}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Stock disponible"
                name="stock"
                type="number"
                value={producto.stock}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            {/* 🖼️ Área Drag & Drop */}
            <Grid item xs={12}>
              <Box
                {...getRootProps()}
                sx={{
                  border: "2px dashed #1976d2",
                  borderRadius: 2,
                  p: 3,
                  textAlign: "center",
                  cursor: "pointer",
                  backgroundColor: isDragActive ? "#e3f2fd" : "transparent",
                }}
              >
                <input {...getInputProps()} />
                {isDragActive ? (
                  <Typography>Soltá las imágenes aquí...</Typography>
                ) : (
                  <Typography>
                    Arrastrá y soltá imágenes o hacé click para subir
                  </Typography>
                )}
              </Box>

              {imagenes.length > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 2,
                    mt: 2,
                  }}
                >
                  {imagenes.map((img, index) => (
                    <Box
                      key={index}
                      sx={{
                        position: "relative",
                        width: 100,
                        height: 100,
                        border: "1px solid #ccc",
                        borderRadius: 2,
                        overflow: "hidden",
                      }}
                    >
                      {!img.loaded && (
                        <Skeleton
                          variant="rectangular"
                          width="100%"
                          height="100%"
                          animation="wave"
                        />
                      )}

                      <img
                        src={img.preview}
                        alt="preview"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: img.loaded ? "block" : "none",
                        }}
                        onLoad={() =>
                          setImagenes((prev) =>
                            prev.map((item, i) =>
                              i === index ? { ...item, loaded: true } : item
                            )
                          )
                        }
                      />

                      <IconButton
                        size="small"
                        onClick={() => handleEliminarImagen(index)}
                        sx={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          backgroundColor: "rgba(255,255,255,0.7)",
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )}
            </Grid>
          </Grid>

          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            loading={loading}
            sx={{ mt: 4, py: 1.2, fontWeight: "bold" }}
          >
            Guardar producto
          </Button>
        </form>

        <Snackbar
          open={open}
          onClose={() => setOpen(false)}
          message={mensaje}
          autoHideDuration={2500}
        />
      </Paper>
    </Box>
  );
}
