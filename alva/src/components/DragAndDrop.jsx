import React from 'react'
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

function DragAndDrop() {
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

  return (
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
  )
}

export default DragAndDrop