import { Router } from "express";
import { check, param } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import incidenciasController from "../../controllers/incidencias.controller.js";
import { validarIncidencia, validarId } from "../../middlewares/index.js";
import autorizarUsuarios from "../../middlewares/autorizarUsuario.js";

const router = Router();


// Obtener todas
router.get("/", autorizarUsuarios([1,2,3]),incidenciasController.getAll);

// Ruta relacionada al director
router.get('/datos-dashboard', autorizarUsuarios([1]), incidenciasController.datosDashboard); 

// Obtener una por ID
router.get("/:id", validarId, autorizarUsuarios([2,3]), incidenciasController.creadasPorId);

// Crear incidencia
router.post("/",     
    [
        check('id_articulo')
        .notEmpty().withMessage('El articulo es obligatorio.'),        
        check('descripcion_pedido')
        .notEmpty().withMessage('La descripcion del pedido es obligatoria.'),
        check('prioridad')
        .notEmpty().withMessage('La prioridad del pedido es obligatoria.'),
        validarCampos
    ], 
    autorizarUsuarios([3]), incidenciasController.create);

// Actualizar incidencia
router.put("/:id_incidencia/asignar",    
    [   
        param('id_incidencia')
            .notEmpty().withMessage('La incidencia es necesaria.')
            .isInt().withMessage('La incidencia debe ser un valor entero'),
        check('asignado_a')
            .notEmpty().withMessage('El id del empleado es necesario.')
            .isInt().withMessage('El id del empleado debe ser un valor entero'),
        validarCampos
    ], 
    autorizarUsuarios([1]), incidenciasController.asignarA);

router.put('/:id_incidencia/finalizar', 
    [   
        param('id_incidencia')
            .notEmpty().withMessage('La incidencia es necesaria.')
            .isInt().withMessage('La incidencia debe ser un valor entero'),
        check('resolucion')
            .notEmpty().withMessage('La descripción es necesaria.'),    
        validarCampos
    ], 
    autorizarUsuarios([2]), incidenciasController.finalizarIncidencia);

router.put('/:id_incidencia/cancelar', 
    [   
        param('id_incidencia')
            .notEmpty().withMessage('La incidencia es necesaria.')
            .isInt().withMessage('La incidencia debe ser un valor entero'),
        check('descripcion_res')
            .notEmpty().withMessage('El motivo de la cancelación es necesario.'),
        validarCampos
    ], 
    autorizarUsuarios([1,3]), incidenciasController.cancelar); 

router.get('/informe', autorizarUsuarios([1]), incidenciasController.generarInforme);     

// Eliminar incidencia 
router.delete("/:id", validarId, incidenciasController.remove);

export default router;
