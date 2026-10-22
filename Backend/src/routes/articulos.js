import { Router } from "express";
import articulosController from "../controllers/articulos.controller.js";
import { validarArticulo, validarId } from "../middlewares/index.js";

const router = Router();

// Obtener todos
router.get("/", articulosController.getAll);

// Obtener uno por ID
router.get("/:id", articulosController.getById);

// Crear artículo
router.post("/", validarArticulo, articulosController.create);

// Actualizar artículo
router.put("/", validarArticulo, articulosController.update);


// Eliminar artículo
router.delete("/", articulosController.remove);

export default router;
