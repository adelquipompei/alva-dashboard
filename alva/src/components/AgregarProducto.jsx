import { useState, useCallback } from "react";
import "swiper/css";
import "swiper/css/navigation";
import imageCompression from "browser-image-compression";
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Box,
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



export default function AgregarProducto({setLogueado}) {
  const [producto, setProducto] = useState({
    marca: "",
    codigo: "",
    descripcion: "",
    ancho: "",
    perfil: "",
    rodado: "",
    carga: "",
    precio: "",
  });

  const [imagenes, setImagenes] = useState([]);
  const [open, setOpen] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingGlobal, setLoadingGlobal] = useState(false);

  const handleChange = (e) => {
    setProducto({ ...producto, [e.target.name]: e.target.value });
  };

  const compressImage = async (file) => {
    const options = { maxSizeMB: 0.3, maxWidthOrHeight: 1280, useWebWorker: true };
    try {
      return await imageCompression(file, options);
    } catch (error) {
      console.error("❌ Error al comprimir:", error);
      return file;
    }
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    setLoadingGlobal(true);
    const comprimidas = await Promise.all(
      acceptedFiles.map(async (file) => ({
        file: await compressImage(file),
        preview: URL.createObjectURL(file),
        loaded: false,
      }))
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
      const formData = new FormData();

      formData.append("producto", JSON.stringify(producto));

      // Mantengo imágenes por si quieres enviarlas también
      imagenes.forEach((img) => {
        const fileWithName = new File([img.file], img.file.name || `imagen-${Date.now()}.jpg`, { type: img.file.type });
        formData.append("imagenes", fileWithName);
      });

      const res = await fetch(`http://${import.meta.env.VITE_SERVER}:${import.meta.env.VITE_PORT}/add-producto`, {
        headers: {Authorization: `Bearer ${sessionStorage.getItem('token')}`},
        method: "POST",
        body: formData,
      });

      
      if (res.status === 403) setLogueado(false);
      if (!res.ok) throw new Error("Error en la respuesta del servidor");

      setMensaje("Producto agregado correctamente ✅");
      setOpen(true);
      setProducto({
        marca: "",
        codigo: "",
        descripcion: "",
        ancho: "",
        perfil: "",
        rodado: "",
        carga: "",
        precio: "",
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
    <Box sx={{display: "flex", justifyContent: "center", alignItems: "flex-start", minHeight: "100vh", p: 3 }}>
      <Paper elevation={5} sx={{  p: 4, borderRadius: 2, width: "100%", maxWidth: 700, mt: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <AddCircleIcon  sx={{ mr: 1, fontSize: 30 ,color:'#212529'}} />
          <Typography variant="h5" fontWeight="bold">Agregar nuevo producto</Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" mb={3}>
          Cargá la información del neumático y sus imágenes (opcional).
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {Object.entries(producto).map(([key, value]) => (
              <Grid item xs={12} sm={6} key={key}>
                <TextField
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                  name={key}
                  value={value}
                  onChange={handleChange}
                  fullWidth
                  required
                  type={key === "precio" ? "number" : "text"}
                />
              </Grid>
            ))}

            {/* 🖼️ Área Drag & Drop */}
            <Grid item xs={12}>
              <Box {...getRootProps()} sx={{
                border: "2px dashed #212529",
                borderRadius: 2,
                p: 3,
                textAlign: "center",
                cursor: "pointer",
                backgroundColor: isDragActive ? "#e3f2fd" : "transparent",
              }}>
                <input {...getInputProps()} />
                {isDragActive ? <Typography>Soltá las imágenes aquí...</Typography> : <Typography>Arrastrá y soltá imágenes o hacé click para subir</Typography>}
              </Box>

              {imagenes.length > 0 && (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}>
                  {imagenes.map((img, index) => (
                    <Box key={index} sx={{ position: "relative", width: 100, height: 100, border: "1px solid #ccc", borderRadius: 2, overflow: "hidden" }}>
                      {!img.loaded && <Skeleton variant="rectangular" width="100%" height="100%" animation="wave" />}
                      <img
                        src={img.preview}
                        alt="preview"
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: img.loaded ? "block" : "none" }}
                        onLoad={() => setImagenes((prev) => prev.map((item, i) => i === index ? { ...item, loaded: true } : item))}
                      />
                      <IconButton size="small" onClick={() => handleEliminarImagen(index)} sx={{ position: "absolute", top: 0, right: 0, backgroundColor: "rgba(255,255,255,0.7)" }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )}
            </Grid>
          </Grid>

          <Button variant="contained"  type="submit" fullWidth sx={{ mt: 4, py: 1.2, fontWeight: "bold",backgroundColor:'#ffc107',color:'#212529' }}>
            Guardar producto
          </Button>
        </form>

        <Snackbar open={open} onClose={() => setOpen(false)} message={mensaje} autoHideDuration={2500} />
      </Paper>
    </Box>
  );
}
