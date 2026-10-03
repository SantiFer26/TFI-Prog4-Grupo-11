export function validarIncidencia(req, res, next) {
    const { id_articulo, creado_por, prioridad, descripcion_pedido } = req.body;

    if (!id_articulo || !creado_por || !prioridad) {
        return res.status(400).json({ error: "Faltan datos obligatorios de la incidencia" });
    }

    if (!descripcion_pedido || descripcion_pedido.trim() === "") {
        return res.status(400).json({ error: "La descripción del pedido no puede estar vacía" });
    }

    next();
}
