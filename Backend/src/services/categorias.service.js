import categoriasData from "../data/categorias.data.js";

const getAll = () => {
  return categoriasData.getAll();
};

const getById = (id_categoria) => {
  return categoriasData.getById(id_categoria);
};

const softDelete = (id_categoria) => {
  return categoriasData.softDelete(id_categoria);
};

const update = (id_categoria, descripcion) => {
  return categoriasData.update(id_categoria, descripcion);
};

const create = (descripcion) => {
  return categoriasData.create(descripcion);
};


export default { getAll, getById, softDelete, create, update };
