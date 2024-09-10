import express from "express";
import mongoose from "mongoose";
import "dotenv/config.js";
import "./src/database.js";

const app = express();
app.use(express.json());

//CABECERAS con métodos permitidos
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
});

const port = process.env.PORT || 8088;

// Esquema para los contactos
const contactoSchema = mongoose.Schema({
  _id: String,
  nombre: String,
  apellido: String,
  edad: Number,
  cargo: String,
});

const Contacto = mongoose.model('Usuario', contactoSchema);

app.get("/", async function (req, res) {
    return res.json("Microservicio transaccional / V. 01 / Brenda Pilozo");
});

// Ruta GET para listar todos los contactos
app.get("/contactos", async function (req, res) {
  try {
    const contactos = await Contacto.find({});
    return res.status(200).json({resp:true, data: contactos});
  } catch (error) {
    console.error(error.message);
    return res.status(400).json({resp:false, mensaje: "Error al obtener los contactos", error: error.message});
  }
});

// Ruta GET para obtener un contacto por id
app.get("/contactos/consulta/:id", async function (req, res) {
  try {
    const contacto = await Contacto.findById(req.params.id);
    if (!contacto) return res.status(404).send('Contacto no encontrado');
    return res.status(200).json({resp:true, data: contacto});
  } catch (error) {
    console.error(error.message);
    return res.status(400).json({resp:false, mensaje: "Error al buscar el contacto", error: error.message});
  }
});

// Ruta POST para agregar un nuevo contacto
app.post("/contactos", async function (req, res) {
  try {
    const nuevoContacto = new Contacto({
      _id: new mongoose.Types.ObjectId().toString(),
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      edad: req.body.edad,
      cargo: req.body.cargo
    });

    const contactoGuardado = await nuevoContacto.save();

    return res.status(200).json({resp:true, data: contactoGuardado});
  } catch (error) {
    console.error(error.message);
    return res.status(400).json({resp:false, mensaje: "Error al guardar el contacto", error: error.message});
  }
});

// Ruta PUT para editar un contacto por ID
app.put("/contactos/editar/:id", async function (req, res) {
  try {
    const contactoActualizado = await Contacto.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!contactoActualizado) return res.status(404).send('Contacto no encontrado');
    return res.status(200).json({resp:true, data: contactoActualizado});
  } catch (error) {
    console.error(error.message);
    return res.status(400).json({resp:false, mensaje: "Error al actualizar el contacto", error: error.message});
  }
});

// Ruta DELETE para eliminar un contacto por ID
app.delete("/contactos/eliminar/:id", async function (req, res) {
  try {
    const contactoEliminado = await Contacto.findByIdAndDelete(req.params.id);
    if (!contactoEliminado) return res.status(404).send('Contacto no encontrado');
    return res.status(200).json({resp:true, mensaje: "Contacto eliminado exitosamente"});
  } catch (error) {
    console.error(error.message);
    return res.status(400).json({resp:false, mensaje: "Error al eliminar el contacto", error: error.message});
  }
});

// Ruta GET para buscar contactos por cualquier parámetro
app.get("/contactos/buscar", async function (req, res) {
  try {
    let query = {};
    if (req.query.nombre) query.nombre = { $regex: new RegExp(req.query.nombre), $options: 'i' };
    if (req.query.apellido) query.apellido = { $regex: new RegExp(req.query.apellido), $options: 'i' };
    if (req.query.cargo) query.cargo = req.query.cargo;
    if (req.query.edad) query.edad = req.query.edad;

    const contactos = await Contacto.find(query);
    return res.status(200).json({resp:true, data: contactos});
  } catch (error) {
    console.error(error.message);
    return res.status(400).json({resp:false, mensaje: "Error al buscar contactos", error: error.message});
  }
});

// MENSAJE DE EJECUCION DE SERVICIO
app.listen(port, ()=>{
    console.log("Servidor en", port)
});