import db from "./db.js";

const getAll = async () => {
  const result = await db.query(`
    SELECT 
      id_categoria,
      descripcion,
      activo
    FROM categorias
    WHERE activo = 1
  `);
  return result.rows;
};

const getById = async (id_categoria) => {
  const result = await db.query(`
    SELECT 
      id_categoria,
      descripcion
    FROM categorias
    WHERE id_categoria = $1 AND activo = 1;
  `, [id_categoria]);
  return result.rows[0];
};

const softDelete = async (id_categoria) => {
  const result = await db.query(`
    UPDATE categorias
    SET activo = 0
    WHERE id_categoria = $1 AND activo = 1
  `, [id_categoria]);

  return result;
};

export default { getAll, getById, softDelete };
