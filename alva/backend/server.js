import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser';
import mysqli2 from'mysql2'
import multer from 'multer'



const app = express();
app.use(cors());
app.use(bodyParser.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1]; // "jpeg", "png", etc.
    const uniqueName = Date.now() + "-" + file.originalname.split(".")[0] + "." + ext;
    cb(null, uniqueName);
  },
});

// ❌ Antes tenías esto: const upload = multer({ dest: 'uploads/' });
// ✅ Ahora creamos el upload usando el storage
const upload = multer({ storage });





const db = mysqli2.createConnection(
    {
        host:'localhost',
        user:'root',
        password:'',
        database:'neumaticos'
    }
);

db.connect((err) =>{
    if (err) {
        console.error("❌ Error de conexión a la base de datos:", err)
    }else{
        console.log("✅ Conectado a MySQL");
    }
} )

app.post('/add-producto',upload.array("imagenes"),(req,res) => {

   console.log("Campos de texto:", req.body); // los datos del producto
  console.log("Archivos recibidos:", req.files); // las imágenes comprimidas
     res.status(200).json({
    message: "Producto agregado correctamente ✅",
    data: req.body,
    archivos:req.files
  });

     const {marca,medida,modelo,precio,stock,tipo} = req.body 
    
    })

const PORT = 5000;
app.listen(PORT,() => {
    console.log('✅ Servidor corriendo en puerto ' + PORT)
})
