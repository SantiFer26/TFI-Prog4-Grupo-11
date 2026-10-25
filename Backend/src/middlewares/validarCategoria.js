export function validarCategoria(req, res, next) {
    const id_categoria = req.params.id;
    const { descripcion } = req.body;

    if (!descripcion || descripcion.trim() === "") {
        return res.status(400).json({ error: "La descripción no puede estar vacía" });
    }

    // id_categoria solo es obligatorio en PUT
    if (req.method === "PUT" && !id_categoria) {
        return res.status(400).json({ error: "Falta id_categoria" });
    }

    next();
}
