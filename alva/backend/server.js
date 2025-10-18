import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mysql2 from "mysql2";
import multer from "multer";
import XLSX from "xlsx";
import fs from "fs";

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 📁 Configuración de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".").pop();
    cb(null, Date.now() + "." + ext);
  },
});
const upload = multer({ storage });

// 💾 Conexión MySQL
const db = mysql2.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "neumaticos",
});

db.connect((err) => {
  if (err) console.error("❌ Error de conexión:", err);
  else console.log("✅ Conectado a MySQL");
});

// 📦 Crear tabla si no existe
db.query(
  `CREATE TABLE IF NOT EXISTS precios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    marca VARCHAR(255),
    codigo VARCHAR(255),
    descripcion VARCHAR(255),
    ancho VARCHAR(50),
    perfil VARCHAR(50),
    rodado VARCHAR(50),
    carga VARCHAR(50),
    precio DECIMAL(12,2)
  )`,
  (err) => err && console.error("❌ Error creando tabla:", err)
);

// 🧾 Subir Excel y cargarlo a la base
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path;
    const fileBuffer = fs.readFileSync(filePath);
    const workbook = XLSX.read(fileBuffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);

    console.log("📊 Filas leídas del Excel:", data.length);

    const dbPromise = db.promise();
    await dbPromise.query("DELETE FROM precios");

    let filasInsertadas = 0;
    for (const row of data) {
      // Si no tiene datos, o no tiene descripción → se salta
      const tieneDatos = Object.values(row).some(
        (v) => v !== null && v !== undefined && String(v).trim() !== ""
      );
      if (!tieneDatos || !row["descripcion"]) continue;

      const marca = row["marca"];
      const codigo = row["codigo"];
      const descripcion = row["descripcion"];
      const ancho = row["ancho"];
      const perfil = row["perfil"];
      const rodado = row["rodado"];
      const carga = row["carga"];
      const precio = row["precio"] || 0;


      await dbPromise.query(
        "INSERT INTO precios (marca, codigo, descripcion, ancho, perfil, rodado, carga, precio) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [marca, codigo, descripcion, ancho, perfil, rodado, carga, precio]
      );

      filasInsertadas++;
    }

    // 🧹 Borrar el archivo Excel una vez procesado
    fs.unlinkSync(filePath);

    res.send(`Excel cargado correctamente (${filasInsertadas} filas insertadas)`);
  } catch (error) {
    console.error("❌ Error procesando Excel:", error);
    res.status(500).send("Error al procesar el archivo");
  }
});



// 📋 Endpoint para traer precios
app.get("/precios", (req, res) => {
  db.query("SELECT * FROM precios order by id  desc", (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.post("/add-producto", upload.array("imagenes", 5), async (req, res) => {
  try {
    if (!req.body.producto) return res.status(400).send("No hay producto enviado");

    const producto = JSON.parse(req.body.producto); // objeto único, no array

    const { marca, codigo, descripcion, ancho, perfil, rodado, carga, precio } = producto;

    const dbPromise = db.promise();
    await dbPromise.query(
      "INSERT INTO precios (marca, codigo, descripcion, ancho, perfil, rodado, carga, precio) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [marca, codigo, descripcion, ancho, perfil, rodado, carga, precio || 0]
    );

    if (req.files && req.files.length > 0) {
      console.log("Archivos subidos:", req.files.map(f => f.filename));
    }

    res.send("Producto guardado correctamente ✅");
  } catch (error) {
    console.error("❌ Error guardando producto:", error);
    res.status(500).send("Error guardando producto");
  }
});




const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
