import db from "./db.js";

const empleadosSistemas = async () => {
    const sql = `SELECT u.id_usuario, 
                        u.nombres,
                        u.apellidos 
                FROM usuarios u 
                WHERE u.rol = $1`;
    const result = await db.query(sql, [2]); 
        
    if (result.rowCount === 0) {
        return null;
    }
    return result.rows;
}     

export default { empleadosSistemas };