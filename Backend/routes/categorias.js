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

export default router;
