export function validarArticulo(req, res, next) {

    // Validación al crear un artículo
    if (req.method === "POST") {
        const { descripcion, id_categoria } = req.body;
        if (!descripcion || descripcion.trim() === "") {
            return res.status(400).json({ error: "La descripción no puede estar vacía" });
        }

        if (!id_categoria) {
            return res.status(400).json({ error: "Falta seleccionar una categoría para el artículo" });
        }
    }

    // Validación al editar un artículo
    if (req.method === "PUT") {
        const { id_articulo, descripcion } = req.body;
        if (!descripcion || descripcion.trim() === "") {
        return res.status(400).json({ error: "La descripción no puede estar vacía" });
        }
        
        if (!id_articulo) {
        return res.status(400).json({ error: "Falta id del articulo" });
    }
    }

    next();
}
