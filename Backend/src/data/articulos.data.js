import db from "./db.js";

const getAll = async () => {
  const result = await db.query(`
    SELECT 
      id_articulo,
      id_categoria,
      descripcion
    FROM articulos
    WHERE activo = 1
    ORDER BY id_articulo ASC;
  `);
  return result.rows;
};


const getById = async (id_articulo) => {
  const result = await db.query(`
    SELECT 
      id_articulo,
      id_categoria,
      descripcion
    FROM articulos
    WHERE id_articulo = $1 AND activo = 1;
  `, [id_articulo]);
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
  
  /*const result = await db.query(`
    UPDATE articulos
    SET id_area = $1,
        id_categoria = $2,
        descripcion = $3,
        activo = $4
    WHERE id_articulo = $5
    RETURNING id_articulo, id_area, id_categoria, descripcion, activo
  `, [id_area, id_categoria, descripcion, activo, id_articulo]);
  */

  const result = await db.query(`
    UPDATE articulos
    SET descripcion = $1
    WHERE id_articulo = $2 AND activo = 1;
  `, [descripcion, id_articulo]);

  return result;

};


const remove = async (id) => {
  const result = await db.query(`
    UPDATE articulos
    SET activo = 0
    WHERE id_articulo = $1 AND activo = 1;
  `, [id]);

  return result;
};


export default { getAll, getById, create, update, remove };
