import incidenciasData from "../data/incidencias.data.js";

const getAll = () => {
  return incidenciasData.getAll();
};

const getById = (id) => {
  return incidenciasData.getById(id);
};

const create = (id_art, id_prioridad, desc_pedido) => {
  return incidenciasData.create(id_art, id_prioridad, desc_pedido);
};

const update = (id, data) => {
  return incidenciasData.update(id, data);
};

const remove = (id) => {
  return incidenciasData.remove(id);
};

export default { getAll, getById, create, update, remove };
