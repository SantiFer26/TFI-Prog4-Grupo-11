import incidenciasService from "../services/incidencias.service.js";

const getAll = async (req, res) => {
  try {
    const incidencias = await incidenciasService.getAll();
    res.status(200).json(incidencias);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener incidencias" });
  }
};

const getById = async (req, res) => {
  try {
    const incidencia = await incidenciasService.getById(req.params.id);
    res.status(200).json(incidencia);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener incidencia" });
  }
};

const create = async (req, res) => {
  try {
    const nueva = await incidenciasService.create(req.body);
    res.status(201).json(nueva);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear incidencia" });
  }
};

const update = async (req, res) => {
  try {
    const actualizada = await incidenciasService.update(req.params.id, req.body);
    res.status(200).json(actualizada);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar incidencia" });
  }
};

const remove = async (req, res) => {
  try {
    await incidenciasService.remove(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar incidencia" });
  }
};

export default { getAll, getById, create, update, remove };
