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

const update = async (req, res) => {
  try {
    const { id_categoria, descripcion } = req.body;

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
    const { id_categoria } = req.body;
    const resultado = await categoriasService.softDelete(id_categoria);

    if (resultado.rowCount === 1) {
      res.status(200).json({ mensaje: "Categoría eliminada con éxito." });
    } else {
      res.status(404).json({ mensaje: "El recurso no existe o ya fue eliminado." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar categoría" });
  }
};

export default { getAll, update, softDelete };
