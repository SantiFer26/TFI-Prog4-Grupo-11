import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

import authRoutes from "./v1/routes/auth.js";
import incidenciasRoutes from "./v1/routes/incidencias.js";
import articulosRoutes from "./v1/routes/articulos.js";
import categoriasRoutes from "./v1/routes/categorias.js";
import usuariosRoutes from "./v1/routes/usuarios.js";

import { manejarErrores, rutaNoEncontrada, autenticar } from "./middlewares/index.js";

const app = express();

// Middlewares globales
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API REST INCIDENCIAS',
            version: '1.0.0',
            description: 'API REST Sistema de Gestión de Incidencias Municipales',
        },
        servers: [ { url: `http://localhost:${process.env.PUERTO || 3000}/api` } ],

        // CONFIGURACIÓN DE SEGURIDAD 
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Aquí el token con el formato: Bearer',
                },
            },
        },
    },
    apis: ['./src/v1/routes/*.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Servidor funcionando");
});

// Rutas REST
app.use("/", authRoutes)
app.use("/api/v1/incidencias", autenticar, incidenciasRoutes);
app.use("/api/v1/articulos", autenticar, articulosRoutes);
app.use("/api/v1/categorias", autenticar, categoriasRoutes);
app.use("/api/v1/usuarios", autenticar, usuariosRoutes);

// Ruta no encontrada
app.use(rutaNoEncontrada);

// Manejo de errores global
app.use(manejarErrores);

export default app;


/*
import express from 'express';
import cors from 'cors';

// importo las rutas de categoria
import {router as v1Categorias} from './v1/rutas/categorias.js';
import {router as v1Auth} from './v1/rutas/auth.js';

import autenticar from './middlewares/autenticar.js';

const app = express();
app.use(express.json());
app.use(cors()); 

app.get('/', (req, res) => {
  res.json({'resp':'APP INCIDENCIAS!'});
})

// ruta de acceso público, no requiere autenticación
app.use('/api/v1/auth/', v1Auth);

// ruta deprivada, requiere autenticación
app.use('/api/v1/categorias', autenticar, v1Categorias);

export default app;*/