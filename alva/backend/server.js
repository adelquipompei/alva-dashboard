import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser';
import mysqli2 from'mysql2'

const app = express();
app.use(cors());
app.use(bodyParser.json());

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

app.post('/add-producto',(req,res) => {

    console.log(req.body)
     res.status(200).json({
    message: "Producto agregado correctamente ✅",
    data: req.body,
  });

     const {marca,medida,modelo,precio,stock,tipo} = req.body 
    
    })

const PORT = 5000;
app.listen(PORT,() => {
    console.log('✅ Servidor corriendo en puerto ' + PORT)
})
