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
    console.error(error);
    res.status(500).json({ error: "Error al crear artículo" });
  }
};

const update = async (req, res) => {
  try {
    const { id_articulo, descripcion } = req.body;
    
    const resultado = await articulosService.update(id_articulo, descripcion);
    if (resultado.rowCount === 1) {
      res.status(200).json({ mensaje: "Artículo actualizado con éxito." });
    } else {
      res.status(404).json({ mensaje: "El artículo no existe." });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar artículo" });
  }
};

const remove = async (req, res) => {
  try {
    const {id_articulo} = req.body;
    const resultado = await articulosService.remove(id_articulo);

    if (resultado.rowCount === 1) {
      res.status(204).json({ mensaje: "Artículo eliminado con éxito." });
    } else {
      res.status(404).json({ mensaje: "El recurso no existe o ya fue eliminado." });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar artículo" });
  }
};

export default { getAll, getById, create, update, remove };
