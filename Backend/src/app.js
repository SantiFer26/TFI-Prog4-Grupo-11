import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import incidenciasRoutes from "./v1/routes/incidencias.js";
import articulosRoutes from "./v1/routes/articulos.js";
import categoriasRoutes from "./v1/routes/categorias.js";

import { manejarErrores, rutaNoEncontrada } from "./middlewares/index.js";

const app = express();

// Middlewares globales
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Servidor funcionando");
});

// Rutas REST
app.use("/api/v1/incidencias", incidenciasRoutes);
app.use("/api/v1/articulos", articulosRoutes);
app.use("/api/v1/categorias", categoriasRoutes);

// Ruta no encontrada
app.use(rutaNoEncontrada);

// Manejo de errores global
app.use(manejarErrores);

export default app;
