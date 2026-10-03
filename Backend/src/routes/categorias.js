import { Router } from "express";
import categoriasController from "../controllers/categorias.controller.js";
import { validarCategoria, validarId } from "../middlewares/index.js";

const router = Router();

// Obtener todas
router.get("/", categoriasController.getAll);

// Editar categoría
router.put("/", validarCategoria, categoriasController.update);

export default router;
