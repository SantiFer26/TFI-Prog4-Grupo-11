import { Router } from "express";
import autorizarUsuarios from "../../middlewares/autorizarUsuario.js";
import usuariosController from "../../controllers/usuarios.controller.js";

const router = Router();

router.get("/empleados-sistemas", autorizarUsuarios([1]), usuariosController.empleadosSistemas);

export default router;