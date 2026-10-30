export function validarIncidencia(req, res, next) {
    const { id_articulo, prioridad, descripcion_pedido } = req.body;

    //creado_por es el id_usuario, que se saca al hacer la autenticación, con req.usuario.id_usuario

    if (!id_articulo || /*!creado_por ||*/ !prioridad) {
        return res.status(400).json({ error: "Faltan datos obligatorios de la incidencia" });
    }

    if (!descripcion_pedido || descripcion_pedido.trim() === "") {
        return res.status(400).json({ error: "La descripción del pedido no puede estar vacía" });
    }

    next();
}
