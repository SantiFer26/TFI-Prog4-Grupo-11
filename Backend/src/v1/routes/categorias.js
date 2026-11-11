import { Router } from "express";
import categoriasController from "../../controllers/categorias.controller.js";
import { validarCategoria, validarId } from "../../middlewares/index.js";
import { check, param } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import autorizarUsuarios from '../../middlewares/autorizarUsuario.js';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     categoria:
 *       type: object
 *       properties:
 *         id_categoria:
 *           type: integer
 *           description: ID único de la categoría
 *         descripcion:
 *           type: string
 *           description: Nombre de la categoría
 *         activo: 
 *           type: integer
 *           description: Si la categoría está activa o no
 */

/**
 * @swagger
 * /v1/categorias:
 *   get:
 *     summary: Obtiene la lista de todas las categorías
 *     tags: [Categorías]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de categorías obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/categoria'
 *       403:
 *         description: El rol del usuario no tiene permisos para este recurso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Acceso Denegado"
 *       500:
 *         description: Error en el servidor al consultar las categorías
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error al obtener categorías"
 */
router.get("/", autorizarUsuarios([2]), categoriasController.getAll);


/**
 * @swagger
 * /v1/categorias/{id}:
 *   get:
 *     summary: Obtiene una categoría por su ID
 *     tags: [Categorías]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID numérico de la categoría
 *     responses:
 *       200:
 *         description: Categoría encontrada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/categoria'
 *       400:
 *        description: Error de validación en los parámetros enviados
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                mensaje:
 *                  type: object
 *                  description: Mapa de errores generado por express-validator
 *            example:
 *              mensaje:
 *                id:
 *                  type: "field"
 *                  value: "abc"
 *                  msg: "El id debe ser un valor numérico"
 *                  path: "id"
 *                  location: "params"
 *       403:
 *         description: El rol del usuario no tiene permisos para este recurso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Acceso Denegado"
 *       404:
 *         description: La categoría no existe
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Categoria no encontrada"
 *       500:
 *         description: Error interno del servidor al consultar la categoría
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error al obtener categoria"
 */
router.get("/:id", 
    [ 
        param('id')        
        .isInt().withMessage('El id debe ser un valor numérico'),
        validarCampos
    ], 
    autorizarUsuarios([2]), categoriasController.getById);



/**
 * @swagger
 * /v1/categorias/{id}:
 *   put:
 *     summary: Actualiza una categoría existente
 *     tags: [Categorías]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID numérico de la categoría a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - descripcion
 *             properties:
 *               descripcion:
 *                 type: string
 *                 example: "Periféricos"
 *     responses:
 *       200:
 *         description: Categoría actualizada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Categoría actualizada con éxito."
 *       400:
 *         description: Error de validación en el ID o en el cuerpo enviado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Falta descripción o ID de categoria"
 *       403:
 *         description: El rol del usuario no tiene permisos para este recurso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Acceso Denegado"
 *       404:
 *         description: La categoría no existe o ya no está disponible
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "La categoría no existe."
 *       500:
 *         description: Error interno del servidor al actualizar la categoría
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error al actualizar categoría"
 */
router.put("/:id", validarCategoria, autorizarUsuarios([2]), categoriasController.update);


/**
 * @swagger
 * /v1/categorias:
 *   post:
 *     summary: Crea una nueva categoría
 *     tags: [Categorías]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - descripcion
 *             properties:
 *               descripcion:
 *                 type: string
 *                 example: "Almacenamiento"
 *     responses:
 *       201:
 *         description: Categoría creada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Categoría creada con éxito."
 *       400:
 *         description: Error de validación en el cuerpo enviado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "La descripción no puede estar vacía"
 *       403:
 *         description: El rol del usuario no tiene permisos para este recurso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Acceso Denegado"
 *       500:
 *         description: Error interno en el servidor al crear la categoría
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error al crear categoría"
 */
router.post("/", validarCategoria, autorizarUsuarios([2]), categoriasController.create);


/**
 * @swagger
 * /v1/categorias/{id}:
 *   delete:
 *     summary: Realiza la baja lógica de una categoría por su ID
 *     tags: [Categorías]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID numérico de la categoría a dar de baja
 *     responses:
 *       204:
 *         description: Categoría eliminada con éxito (sin contenido)
 *       400:
 *         description: ID inválido o vacío en los parámetros de la URL
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: object
 *                   description: Mapa de errores generado por express-validator
 *             example:
 *               mensaje:
 *                 id:
 *                   msg: "El id debe ser un valor númerico"
 *       403:
 *         description: El rol del usuario no tiene permisos para este recurso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Acceso Denegado"
 *       404:
 *         description: La categoría no existe o ya fue dada de baja previamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "El recurso no existe o ya fue eliminado."
 *       500:
 *         description: Error interno del servidor al intentar dar de baja la categoría
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error al eliminar categoría"
 */
router.delete("/:id", 
    [
        param('id')
        .isInt().withMessage('El id debe ser un valor númerico')
        .notEmpty().withMessage('El id es necesario para la consulta'),
        validarCampos
    ], 
    autorizarUsuarios([2]), categoriasController.softDelete);

export default router;
