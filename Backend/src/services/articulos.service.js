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

const update = (id, data) => {
  return articulosData.update(id, data);
};

const remove = (id) => {
  return articulosData.remove(id);
};

export default { getAll, getById, create, update, remove };
