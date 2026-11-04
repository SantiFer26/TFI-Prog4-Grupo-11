import jwt from 'jsonwebtoken';
import authServicio from '../services/auth.service.js';

const buscarUsuario = async (req, res) => {
    try{
        const { usuario, contrasenia } = req.body;
            
        const usuarioBD = await authServicio.buscarUsuario(usuario, contrasenia);

        if(!usuarioBD){
            res.status(400).json({mensaje:'Nombre de usuario y/o contraseña incorrectos.'});
            return ;
        }

        // CREAR TOKEN
        const token = jwt.sign(usuarioBD, process.env.JWT_SECRET, {expiresIn: '1h'});

        res.status(200).json({token: token, rol: usuarioBD.rol});

    } catch (error) {
        console.error('Error al obtener usuario /login:', error.message);
        return res.status(500).json({ 
            estado: false, 
            error: 'Error interno del servidor.' 
        });
    }
    }

export default { buscarUsuario };