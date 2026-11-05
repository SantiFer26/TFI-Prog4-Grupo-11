import db from "./db.js";

const getAll = async () => {
  const result = await db.query(`
    SELECT 
      id_incidencia,
      id_articulo,
      id_estado,
      creado_por,
      asignado_a,
      creado,
      prioridad,
      descripcion_pedido,
      descripcion_resolucion
    FROM incidencias
  `);
  return result.rows;
};

const getById = async (id_incidencia) => {
  const result = await db.query(`
    SELECT 
      id_incidencia,
      id_articulo,
      id_estado,
      creado_por,
      asignado_a,
      creado,
      prioridad,
      descripcion_pedido,
      descripcion_resolucion
    FROM incidencias
    WHERE id_incidencia = $1
  `, [id_incidencia]);
  return result.rows[0];
};

const create = async (id_art, creado_por, asignado_a, id_prioridad, desc_pedido) => {
  const result = await db.query(`
    INSERT INTO incidencias (id_articulo, id_estado, creado_por, asignado_a, prioridad, descripcion_pedido)
    VALUES ($1, $2, $3, $4, $5, $6)
  `, [id_art, 1, creado_por, asignado_a, id_prioridad, desc_pedido]);
  return result.rows[0];
}

export default { getAll, getById, create};
