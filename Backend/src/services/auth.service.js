import authData from "../data/auth.data.js";

const buscarUsuario = (usuario, contrasenia) => {
    return authData.buscarUsuario(usuario, contrasenia);
}

const buscarPorId = (usuarioId) => {
    return authData.buscarPorId(usuarioId);
}

export default { buscarUsuario };