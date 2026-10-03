import articulosService from "../services/articulos.service.js";

const getAll = async (req, res) => {
  try {
    const articulos = await articulosService.getAll();
    res.status(200).json(articulos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener artículos" });
  }
};

const getById = async (req, res) => {
  try {
    const articulo = await articulosService.getById(req.params.id);
    res.status(200).json(articulo);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener artículo" });
  }
};

const create = async (req, res) => {
  try {
    const nuevo = await articulosService.create(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ error: "Error al crear artículo" });
  }
};

const update = async (req, res) => {
  try {
    const actualizado = await articulosService.update(req.params.id, req.body);
    res.status(200).json(actualizado);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar artículo" });
  }
};

const remove = async (req, res) => {
  try {
    await articulosService.remove(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar artículo" });
  }
};

export default { getAll, getById, create, update, remove };
