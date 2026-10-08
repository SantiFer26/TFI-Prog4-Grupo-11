import { Router } from "express";
import categoriasController from "../controllers/categorias.controller.js";
import { validarCategoria, validarId } from "../middlewares/index.js";

const router = Router();

// Obtener todas
router.get("/", categoriasController.getAll);

// Obtener uno por ID
router.get("/:id", categoriasController.getById);

// Editar categoría
router.put("/", validarCategoria, categoriasController.update);

// Agregar categoría
router.post("/", validarCategoria, categoriasController.create);

// Eliminar categoria
router.patch("/", categoriasController.softDelete);

export default router;
