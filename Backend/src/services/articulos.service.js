import articulosData from "../data/articulos.data.js";

const getAll = () => {
  return articulosData.getAll();
};

const getById = (id) => {
  return articulosData.getById(id);
};

const create = (data) => {
  return articulosData.create(data);
};

const update = (id, descripcion) => {
  return articulosData.update(id, descripcion);
};

const remove = (id) => {
  return articulosData.remove(id);
};

export default { getAll, getById, create, update, remove };
