import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

// Crear incidencia
router.post('/', async (req, res) => {
  try {
    const { id_articulo, prioridad, descripcion_pedido } = req.body;

    const result = await pool.query(
    `INSERT INTO incidencias (id_articulo, prioridad, descripcion_pedido)
     VALUES ($1, $2, $3)
    RETURNING *`,
    [id_articulo, prioridad, descripcion_pedido]
);


    res.json({ ok: true, incidencia: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: 'Error al crear incidencia' });
  }
});

// Obtener incidencias
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM incidencias ORDER BY id_incidencia DESC');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: 'Error al obtener incidencias' });
  }
});




export default router;
