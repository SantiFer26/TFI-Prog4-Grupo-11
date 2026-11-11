import db from "./db.js";

const getAll = async () => {
  const result = await db.query(`
    SELECT 
      id_articulo,
      id_categoria,
      descripcion
    FROM articulos
    WHERE activo = $1
    ORDER BY id_articulo ASC;
  `, [1]);
  return result.rows;
};


const getById = async (id_articulo) => {
  const result = await db.query(`
    SELECT 
      id_articulo,
      id_categoria,
      descripcion
    FROM articulos
    WHERE id_articulo = $1 AND activo = $2;
  `, [id_articulo, 1]);
  return result.rows[0];
};


const create = async (data) => {
  const { id_area, id_categoria, descripcion, activo } = data;

  const result = await db.query(`
    INSERT INTO articulos (id_area, id_categoria, descripcion, activo)
    VALUES ($1, $2, $3, $4)
    RETURNING id_articulo, id_area, id_categoria, descripcion, activo;
  `, [1, id_categoria, descripcion, 1]);

  return result.rows[0];
};

const update = async (id_articulo, descripcion) => {

  const result = await db.query(`
    UPDATE articulos
    SET descripcion = $1
    WHERE id_articulo = $2 AND activo = $3;
  `, [descripcion, id_articulo, 1]);

  return result;

};


const remove = async (id) => {
  const result = await db.query(`
    UPDATE articulos
    SET activo = $1
    WHERE id_articulo = $2 AND activo = $3;
  `, [0, id, 1]);

  return result;
};


export default { getAll, getById, create, update, remove };
