import categoriasService from "../services/categorias.service.js";

const getAll = async (req, res) => {
  try {
    const categorias = await categoriasService.getAll();
    res.status(200).json(categorias);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener categorías" });
  }
};

const getById = async (req, res) => {
  try {
    const categoria = await categoriasService.getById(req.params.id);
    if (!categoria) {
      return res.status(404).json({ error: "Categoria no encontrada" });
    }
    res.status(200).json(categoria);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener categoria" });
  }
};

const update = async (req, res) => {
  try {
    const id_categoria = req.params.id;
    const { descripcion } = req.body;

    const resultado = await categoriasService.update(id_categoria, descripcion);

    if (resultado.rowCount === 1) {
      res.status(200).json({ mensaje: "Categoría actualizada con éxito." });
    } else {
      res.status(404).json({ mensaje: "La categoría no existe." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar categoría" });
  }
};

const softDelete = async (req, res) => {
  try {
    const id_categoria = req.params.id;
    const resultado = await categoriasService.softDelete(id_categoria);

    if (resultado.rowCount === 1) {
      res.status(204).send();
    } else {
      res.status(404).json({ mensaje: "El recurso no existe o ya fue eliminado." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar categoría" });
  }
};

const create = async (req, res) => {
  try {
    const { descripcion } = req.body;

    const resultado = await categoriasService.create(descripcion);

    if (resultado.rowCount === 1) {
      res.status(201).json({ mensaje: "Categoría creada con éxito." });
    } else {
      res.status(400).json({ mensaje: "No se pudo crear la categoría." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear categoría" });
  }
};


export default { getAll, getById, update, softDelete, create };
