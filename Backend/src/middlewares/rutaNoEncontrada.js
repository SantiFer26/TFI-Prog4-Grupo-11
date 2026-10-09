export function rutaNoEncontrada(req, res, next) {
    if (!req.route) {
        return res.status(404).json({ error: "Ruta no encontrada" });
    }
    next();
}
