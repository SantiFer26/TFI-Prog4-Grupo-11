import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

// Obtener artículos
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM articulos ORDER BY id_articulo ASC');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: 'Error al obtener artículos' });
  }
});

export default router;
