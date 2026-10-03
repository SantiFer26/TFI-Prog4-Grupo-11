export function validarArticulo(req, res, next) {
    const { descripcion, id_area, id_categoria } = req.body;

    if (!descripcion || descripcion.trim() === "") {
        return res.status(400).json({ error: "La descripción no puede estar vacía" });
    }

    if (!id_area || !id_categoria) {
        return res.status(400).json({ error: "Faltan datos del artículo" });
    }

    next();
}
