import db from "./db.js";

const getAll = async (filtros = {}) => {
        const { estado, prioridad } = filtros;
        let sql = `SELECT i.id_incidencia, 
                            to_char(i.creado, 'DD-MM-YYYY HH24:MI') creado,
                            i.descripcion_pedido, 
                            i.descripcion_resolucion, 
                            i.prioridad,
                            a.descripcion articulo_descripcion, 
                            c.descripcion cateoria, 
                            concat(u.apellidos, ' ', u.nombres) asignado_a, 
                            e.descripcion estado,
                            e.id_estado
                        FROM incidencias i 
                        INNER JOIN articulos a ON a.id_articulo  = i.id_articulo 
                        INNER JOIN categorias c ON c.id_categoria = a.id_categoria
                        INNER JOIN usuarios u ON u.id_usuario = i.asignado_a
                        INNER JOIN estados e ON e.id_estado = i.id_estado`;
        const values = [];

        // Filtro por estado "pendiente", "cancelada" o "todas".
        if (estado && estado !== "todas") {
            values.push(estado);
            sql += ` AND LOWER(e.descripcion) = LOWER($${values.length})`;
        }

        // Filtro por prioridad: 1, 2 o 3
        if (prioridad) {
            values.push(prioridad);
            sql += ` AND i.prioridad = $${values.length}`;
        }

        sql += ` ORDER BY i.id_incidencia ASC;`;            

        const {rows} = await db.query(sql, values); // se pasan los valores de estado y prioridad, o solo estado

        return rows;
}

const asignarA = async (incidencia) => {
        
        // OBTENGO UN CLIENTE DEL POOL DE CONEXIONES PARA MANEJAR LA TRANSACCIÓN DE FORMA AISLADA
        const client = await db.connect();

        try{
            await client.query('BEGIN');
            // ACTUALIZO LA INCIDENCIA
            const {id_incidencia, asignado_a} = incidencia;

            // SE PODRÍA MEJORAR Y RECIBIR EL ESTADO
            const sql = `UPDATE incidencias  
                        SET asignado_a = $1, id_estado = 2
                        WHERE id_incidencia = $2
                        RETURNING *;`;

            const { rowCount, rows } = await client.query(sql, [asignado_a, id_incidencia]);
            if (rowCount === 0) {
                await client.query('ROLLBACK');
                return null;
            }    

            // NUEVO REGISTRO PARA EL HISTORIAL DE incidencias_estados
            const sql_insert = `INSERT INTO incidencias_estados (id_incidencia, id_estado)
                                VALUES ($1, 2)`;
            await client.query(sql_insert, [id_incidencia]);                                
            
            await client.query('COMMIT');

            return rows;

        }catch (error){
            await client.query('ROLLBACK');
            console.error('Error en latransacción de asignación: ', error);
            throw error; 
        }finally{
            client.release();
        }
    }

    // FINALIZAR INCIDENCIA
    // REGISTRA EL NUEVO ESTADO EN EL HISTORIAL
const finalizarIncidencia = async (incidencia) => {
        
        const client = await db.connect();

        try{
            await client.query('BEGIN');
            
            const {id_incidencia, resolucion} = incidencia;

            const sql = `UPDATE incidencias  
                        SET id_estado = 3, descripcion_resolucion = $1
                        WHERE id_incidencia = $2
                        RETURNING *;`;

            const { rowCount, rows } = await client.query(sql, [resolucion, id_incidencia]);
            if (rowCount === 0) {
                await client.query('ROLLBACK');
                return null;
            }    

            const sql_insert = `INSERT INTO incidencias_estados (id_incidencia, id_estado)
                                VALUES ($1, 3)`;
            await client.query(sql_insert, [id_incidencia]);                                
            
            await client.query('COMMIT');

            return rows[0];

        }catch (error){
            await client.query('ROLLBACK');
            console.error('Error en latransacción de asignación: ', error);
            throw error; 
        }finally{
            client.release();
        }
    }

const cancelarIncidencia = async (id_incidencia, descripcion_res) => {
        
        const client = await db.connect();

        try{
            await client.query('BEGIN');
            
            const sql = `UPDATE incidencias  
                        SET id_estado = 4, descripcion_resolucion = $1
                        WHERE id_incidencia = $2
                        RETURNING *;`;

            const { rowCount, rows } = await client.query(sql, [descripcion_res, id_incidencia]);
            if (rowCount === 0) {
                await client.query('ROLLBACK');
                return null;
            }    

            const sql_insert = `INSERT INTO incidencias_estados (id_incidencia, id_estado)
                                VALUES ($1, 4)`;
            await client.query(sql_insert, [id_incidencia]);                                
            
            await client.query('COMMIT');

            return rows[0];

        }catch (error){
            await client.query('ROLLBACK');
            console.error('Error en la transacción de cancelación: ', error);
            throw error; 
        }finally{
            client.release();
        }
    }

const creadasPorId = async (creado_por) => {
        
        const sql = `SELECT i.id_incidencia, 
                            i.descripcion_pedido, 
                            i.descripcion_resolucion, 
                            to_char(i.creado, 'DD-MM-YYYY HH24:MI') creado,
                            a.descripcion articulo_descripcion, 
                            i.prioridad, 
                            c.descripcion categoria, 
                            concat(u.apellidos, ' ', u.nombres) creado_por, 
                            e.descripcion estado, i.id_estado 
                        FROM incidencias i 
                        INNER JOIN articulos a ON a.id_articulo  = i.id_articulo 
                        INNER JOIN categorias c ON c.id_categoria = a.id_categoria
                        INNER JOIN usuarios u ON u.id_usuario = i.asignado_a 
                        INNER JOIN estados e ON e.id_estado = i.id_estado 
                        WHERE i.creado_por = $1`;            

        const {rowCount, rows} = await db.query(sql, [creado_por]);

        if (rowCount === 0) {
            return null;
        }
        return rows;
    }

const asignadasAId = async (asignado_a) => {

        const sql = `SELECT i.id_incidencia, i.descripcion_pedido, i.descripcion_resolucion, to_char(i.creado, 'DD-MM-YYYY HH24:MI') creado,
                         a.descripcion articulo_descripcion, i.prioridad, c.descripcion categoria, concat(u.apellidos, ' ', u.nombres) asignado_a, 
                         e.descripcion estado, i.id_estado 
                        FROM incidencias i 
                        INNER JOIN articulos a ON a.id_articulo  = i.id_articulo 
                        INNER JOIN categorias c ON c.id_categoria = a.id_categoria
                        INNER JOIN usuarios u ON u.id_usuario = i.asignado_a 
                        INNER JOIN estados e ON e.id_estado = i.id_estado 
                        WHERE i.asignado_a = $1`;                                    

        const {rowCount, rows} = await db.query(sql, [asignado_a]);

        if (rowCount === 0) {
            return null;
        }
        return rows;
    }


const create = async (incidencia) => {
        const { id_articulo, creado_por, descripcion_pedido, prioridad } = incidencia;    

        const sql = `INSERT INTO incidencias 
                    (id_articulo, id_estado, creado_por, asignado_a, descripcion_pedido, prioridad) 
                    VALUES ($1, 1, $2, 1, $3, $4)
                    RETURNING *;`;
                    
        const result = await db.query(sql, [id_articulo, creado_por, descripcion_pedido, prioridad]); 
        
        if (result.rowCount === 0) {
            return null;
        }
        return result.rows[0];
    }
  
const informacionIncidencia = async (incidencia) => {
        
        const {id_incidencia } = incidencia;

        const sql = `SELECT to_char(i.creado, 'DD-MM-YYYY HH24:MI') creada, 
                            to_char(e.fecha_hora_estado, 'DD-MM-YYYY HH24:MI') finalizada, 
                            i.descripcion_resolucion resolucion, 
                            u.usuario destinatario
                        FROM incidencias i 
                        INNER JOIN usuarios u ON u.id_usuario = i.creado_por
                        INNER JOIN incidencias_estados e ON e.id_incidencia = i.id_incidencia 
                        WHERE i.id_incidencia = $1 and e.id_estado = 3;`;

        
        const {rowCount, rows} = await db.query(sql, [id_incidencia]);

        
        if (rowCount === 0) {
            return null;
        }
        return rows;
    }
  
const datosInforme = async () => {
        const sql = `SELECT i.id_incidencia, 
                            to_char(i.creado, 'DD-MM-YYYY HH24:MI') creada,
                            a.descripcion articulo, 
                            concat(u.apellidos, ' ', u.nombres) asignada_a, 
                            e.descripcion estado
                        FROM incidencias i 
                        INNER JOIN articulos a ON a.id_articulo  = i.id_articulo 
                        INNER JOIN usuarios u ON u.id_usuario = i.asignado_a
                        INNER JOIN estados e ON e.id_estado = i.id_estado
                        ORDER BY i.id_incidencia DESC`;            

        const {rowCount, rows} = await db.query(sql);

        if (rowCount === 0) {
            return null;
        }
        return rows;
    }

const datosDashboard = async () => {
        const sql = `SELECT * FROM sp_obtener_metricas();`;            

        const {rowCount, rows} = await db.query(sql);

        if (rowCount === 0) {
            return null;
        }
        return rows[0];
    }
export default { getAll, creadasPorId, create, asignarA, finalizarIncidencia, cancelarIncidencia, asignadasAId, informacionIncidencia, datosInforme, datosDashboard};
