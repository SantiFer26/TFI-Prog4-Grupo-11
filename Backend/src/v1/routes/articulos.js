import { Router } from "express";
import articulosController from "../../controllers/articulos.controller.js";
import { validarArticulo, validarId } from "../../middlewares/index.js";
import { check, param } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import autorizarUsuarios from '../../middlewares/autorizarUsuario.js';


const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     articulo:
 *       type: object
 *       properties:
 *         id_articulo:
 *           type: integer
 *           description: ID del articulo
 *         id_area:
 *           type: integer
 *           description: ID del área al que pertenece el artículo
 *         id_categoria:
 *           type: integer
 *           description: ID de la categoría a la que pertenece el artículo
 *         descripcion:
 *           type: string
 *           description: Descripcion del articulo
 *         activo:
 *           type: integer
 *           description: Si el artículo está activo o no
 */


/**
 * @swagger
 * /v1/articulos:
 *   get:
 *     summary: Obtiene una lista de todos los articulos activos
 *     security:
 *       - BearerAuth: []
 *     tags: [articulos]
 *     responses:
 *       200:
 *         description: Se obtuvo con éxito la lista de artículos
 *         content:
 *           application/json:
 *             schema: 
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/articulo'
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
 *         description: Hubo un error en el servidor al consultar los artículos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error al obtener artículos"
 */
router.get("/", autorizarUsuarios([2,3]), articulosController.getAll);


/**
 * @swagger
 * /v1/articulos/{id}:
 *  get:
 *      summary: Obtiene un artículo por su ID
 *      security:
 *          - BearerAuth: []
 *      tags: [articulos]
 *      parameters: 
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              type: integer
 *            description: ID numérico del artículo
 *      responses:
 *          200:
 *           description: Se encontró el artículo
 *           content:
 *            application/json:
 *             schema: 
 *               $ref: '#/components/schemas/articulo'
 *          403:
 *           description: El rol del usuario no tiene permisos para este recurso
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   mensaje:
 *                     type: string
 *                     example: "Acceso Denegado"
 *          404: 
 *            description: No se encontró el artículo porque no existe o está inactivo
 *            content: 
 *             application/json: 
 *              schema: 
 *               type: object
 *               properties: 
 *                error: 
 *                  type: string
 *                  example: "Articulo no encontrado"
 *          500:
 *            description: Hubo un error en el servidor al buscar el articulo
 *            content:
 *             application/json:
 *              schema:
 *               type: object
 *               properties:
 *                error:
 *                 type: string
 *                 example: "Error al obtener artículo"
 */
router.get("/:id", autorizarUsuarios([2,3]), articulosController.getById);


/**
 * @swagger
 * /v1/articulos:
 *   post:
 *     summary: Crea un nuevo artículo
 *     tags: [articulos]
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
 *               - id_categoria
 *             properties:
 *               descripcion:
 *                 type: string
 *                 example: "Mouse Logitech"
 *               id_categoria:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Artículo creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/articulo'
 *       400: 
 *         description: Datos inválidos o campos obligatorios faltantes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "La descripción y la categoría son obligatorias"
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
 *         description: Hubo un error en el servidor al crear el articulo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                error:
 *                  type: string
 *                  example: "Error al crear artículo"
 */
router.post("/", validarArticulo, autorizarUsuarios([2]), articulosController.create);


/**
 * @swagger
 * /v1/articulos/{id}:
 *   put:
 *     summary: Actualiza un artículo
 *     tags: [articulos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID numérico del artículo a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               descripcion:
 *                 type: string
 *                 example: "Mouse Logitech Pro"
 *     responses:
 *       200:
 *         description: Artículo actualizado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/articulo'
 *       400: 
 *         description: Datos inválidos o campos obligatorios faltantes
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
 *                 mensaje:
 *                   type: string
 *                   example: "Acceso Denegado"
 *       404: 
 *         description: El artículo no se actualizó porque no se encontró o no existe
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "El artículo no se encontró o no existe"
 *       500:
 *         description: Hubo un error en el servidor al actualizar el articulo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                error:
 *                  type: string
 *                  example: "Error al actualizar artículo"
 */
router.put("/:id", validarArticulo, autorizarUsuarios([2]), articulosController.update);


/**
 * @swagger
 * /v1/articulos/{id}:
 *   delete:
 *     summary: Realiza la baja lógica de un artículo por su ID
 *     tags: [articulos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID numérico del artículo a dar de baja
 *     responses:
 *       204:
 *         description: Artículo eliminado con éxito (sin contenido)
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
 *                 mensaje:
 *                   type: string
 *                   example: "Acceso Denegado"
 *       404:
 *         description: El artículo no existe o ya fue dado de baja previamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "El recurso no existe o ya fue eliminado."
 *       500:
 *         description: Error en el servidor al eliminar el artículo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error al eliminar artículo"
 */
router.delete("/:id", 
    [
        param('id')
        .isInt().withMessage('El id debe ser un valor númerico')
        .notEmpty().withMessage('El id es necesario para la consulta'),
        validarCampos
    ], 
    autorizarUsuarios([2]), articulosController.remove);

export default router;
