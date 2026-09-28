import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

// Obtener categorias:
router.get('/', async (req, res) => {
    try {
        const categorias = `SELECT * FROM categorias WHERE activo = 1;`;
        const resultado = await pool.query(categorias);
        res.status(200).json(resultado.rows);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ok: false, error:'Error al obtener las categorías.'});
    }
})

//Borrar una categoria (soft delete):
router.patch('/', async (req, res) => { //investigar diseño de API REST para cambiar patch por delete
    try {
        const { id_categoria } = req.body;
        const categorias = `UPDATE categorias SET activo = 0 WHERE id_categoria = $1 AND activo = 1;`; //AND activo = 1 para evitar que un usuario elimine una categoria que ya fue eliminada.
        const resultado = await pool.query(categorias, [id_categoria]);
        if (resultado.rowCount === 1) {
            res.status(200).json({mensaje: "Categoría eliminada con éxito."});
        }
        else {
            res.status(404).json({mensaje: "El recurso no existe o ya fue eliminado."});
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({mensaje:'Error del servidor. No se pudo eliminar la categoría.'});
    }
})

export default router;
