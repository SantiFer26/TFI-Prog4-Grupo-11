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

export default { getAll, getById, softDelete };
