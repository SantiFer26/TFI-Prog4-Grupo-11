import db from "./db.js";

const buscarUsuario = async (usuario, contrasenia) => {
    const result = await db.query(`
        SELECT id_usuario, nombres, apellidos, rol
        FROM usuarios AS u
        WHERE u.activo = 1 AND u.usuario = $1 AND 
            u.contrasenia = encode(digest($2, 'sha256'), 'hex')`, [usuario, contrasenia]);

    if (result.rowCount === 0) {
        return null;
    }
    return result.rows[0];
}

const buscarPorId = async (usuarioId) => {
    const result = await db.query(`
        SELECT id_usuario, nombres, apellidos, rol
        FROM usuarios AS u
        WHERE u.activo = 1 AND u.id_usuario = $1`, [usuarioId]);

    if (result.rowCount === 0) {
        return null;
    }
    return result.rows[0];
}

export default { buscarUsuario, buscarPorId }