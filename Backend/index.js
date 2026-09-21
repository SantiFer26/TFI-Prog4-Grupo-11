import express from "express";
import cors from "cors";
import incidenciasRoutes from './routes/incidencias.js';
import articulosRoutes from './routes/articulos.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Servidor funcionando");
});
app.use('/incidencias', incidenciasRoutes);
app.use('/articulos', articulosRoutes);
i
// Levantar servidor
app.listen(3000, () => {
  console.log("Servidor iniciado en http://localhost:3000");
});
