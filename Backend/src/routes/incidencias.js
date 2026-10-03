import { Router } from "express";
import incidenciasController from "../controllers/incidencias.controller.js";
import { validarIncidencia, validarId } from "../middlewares/index.js";

const router = Router();

// Obtener todas
router.get("/", incidenciasController.getAll);

// Obtener una por ID
router.get("/:id", validarId, incidenciasController.getById);

// Crear incidencia
router.post("/", validarIncidencia, incidenciasController.create);

// Actualizar incidencia
router.put("/:id", validarId, validarIncidencia, incidenciasController.update);

// Eliminar incidencia definitivamente
router.delete("/:id", validarId, incidenciasController.remove);

export default router;
