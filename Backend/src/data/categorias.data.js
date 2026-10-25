import db from "./db.js";

const getAll = async () => {
  const result = await db.query(`
    SELECT 
      id_categoria,
      descripcion,
      activo
    FROM categorias
    WHERE activo = 1
    ORDER BY id_categoria ASC;
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
    WHERE id_categoria = $1 AND activo = 1;
  `, [id_categoria]);

  return result;
};

const update = async (id_categoria, descripcion) => {
  const query = `
    UPDATE categorias
    SET descripcion = $1
    WHERE id_categoria = $2 AND activo = 1;
  `;
  return db.query(query, [descripcion, id_categoria]);
};


const create = async (descripcion) => {
  const query = `
    INSERT INTO categorias (descripcion, activo)
    VALUES ($1, 1);
  `;
  return db.query(query, [descripcion]);
};

export default { getAll, getById, softDelete, update, create };
