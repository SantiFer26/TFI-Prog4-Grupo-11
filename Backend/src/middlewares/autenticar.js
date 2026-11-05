import jwt from 'jsonwebtoken';
import authServicio from '../services/auth.service.js';

// Valida el token Bearer y deja el usuario en req.user
const autenticar = async (req, res, next) => {
    try {

        const [scheme, token] = (req.headers.authorization ?? '').split(' ');
        if (scheme !== 'Bearer' || !token) {
            return res.status(401).json({ mensaje: 'Token requerido.' });
        }

        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const usuario = await authServicio.buscarPorId(payload.id_usuario);
        if (!usuario) {
            return res.status(401).json({ mensaje: 'Token incorrecto.' });
        }

        req.usuario = usuario;
        next();

    } catch (exc) {
        if (exc.name === 'JsonWebTokenError' || exc.name === 'TokenExpiredError') {
            return res.status(401).json({ mensaje: 'Token incorrecto.' });
        }
        next(exc);
    }
};

export default autenticar;
