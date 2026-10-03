import categoriasData from "../data/categorias.data.js";

const getAll = () => {
  return categoriasData.getAll();
};

const softDelete = (id_categoria) => {
  return categoriasData.softDelete(id_categoria);
};

export default { getAll, softDelete };
