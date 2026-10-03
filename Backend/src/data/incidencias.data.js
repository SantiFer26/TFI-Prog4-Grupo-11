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

export default { getAll, getById };
