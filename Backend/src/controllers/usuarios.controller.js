import usuariosService from "../services/usuarios.service.js";

const empleadosSistemas = async (req, res) => {
    console.log(req.usuario);
    try {
        if (req.usuario.rol === 1) {
            const usuarios = await usuariosService.empleadosSistemas();
            res.status(200).json(usuarios);
        }

    } catch(error) {
        console.error(error);
        res.status(500).json({
        error: "Error al obtener los empleados de sistemas"
        });
    }
};

export default { empleadosSistemas };