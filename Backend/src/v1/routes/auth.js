import { Router } from 'express';
import authController from "../../controllers/auth.controller.js";
import { validarCampos } from '../../middlewares/validarCampos.js';
import { check } from 'express-validator';

const router = Router();


/**
 * @swagger
 * /auth/login:
 *   post:
 *     servers:
 *       - url: http://localhost:3000
 *     summary: Iniciar sesión y obtener token JWT
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuario
 *               - contrasenia
 *             properties:
 *               usuario:
 *                 type: string
 *                 format: email
 *                 example: "carper@correo.com"
 *               contrasenia:
 *                 type: string
 *                 format: password
 *                 example: "carper"
 *     responses:
 *       200:
 *         description: Autenticación exitosa.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 rol: 
 *                   type: integer
 *                   example: 1
 *       400:
 *         description: Nombres de usuario o contraseña incorrectos, o datos faltantes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Nombre de usuario y/o contraseña incorrectos."
 *       500:
 *         description: Error en el servidor al intentar autenticar
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado: 
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Error interno del servidor."
 */
router.post("/auth/login", 
    [
        check('usuario')
        .notEmpty().withMessage('El usuario es obligatorio.')
        .isEmail().withMessage('Revisar el formato del dato.'),
        check('contrasenia')
        .notEmpty('contrasenia').withMessage('La contraseña es obligatoria.'),
        validarCampos
    ], authController.buscarUsuario);

export default router;