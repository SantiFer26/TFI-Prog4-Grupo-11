export function manejarErrores(err, req, res, next) {
    console.error("ERROR:", err);
    res.status(500).json({ error: "Error interno del servidor" });
}
