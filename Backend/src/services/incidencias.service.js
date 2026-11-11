import incidenciasData from "../data/incidencias.data.js";
import notificacionesService from "./notificaciones.service.js"
import reportesService from "./reportes.service.js";

const getAll = (filtros) => {
  return incidenciasData.getAll(filtros);
};

const getById = (id) => {
  return incidenciasData.getById(id);
};

const create = (incidencia) => {
  return incidenciasData.create(incidencia);
};

const update = (id, data) => {
  return incidenciasData.update(id, data);
};

const creadasPorId = (creado_por) => {
  return incidenciasData.creadasPorId(creado_por);
}

const asignadasAId = (asignado_a) => {
        return incidenciasData.asignadasAId(asignado_a);
    }


const remove = (id) => {
  return incidenciasData.remove(id);
};

const asignarA = (incidencia) => {
  return incidenciasData.asignarA(incidencia);
}

const finalizarIncidencia = async (incidencia) => {

        const result = await incidenciasData.finalizarIncidencia(incidencia);

        if (!result) { 
            return null; 
        };

        const datosCorreo = await incidenciasData.informacionIncidencia(incidencia);

        await notificacionesService.enviarCorreo(datosCorreo);

        console.log("CORREO DE FINALIZACIÓN ENVIADO");

        return result;
    }
  
const cancelarIncidencia = async (id_incidencia, descripcion_res) => {
        // CONTROLES??
        // LA INCIDENCIA EXISTE? ESTA PENDIENTE?
        const result = await incidenciasData.cancelarIncidencia(id_incidencia, descripcion_res);

        if (!result) { 
            return null; 
        };

        const datosCorreo = await incidenciasData.informacionIncidencia({id_incidencia});

        await notificacionesService.enviarCorreo(datosCorreo);

        console.log("CORREO DE CANCELACIÓN ENVIADO");

        return result;
}


const generarInforme = async (estado, prioridad) => {

    let datosReporte;

    if (estado === "pendiente" && prioridad === "1") {
        datosReporte = await incidenciasData.datosInformePrioritarias();

    } else if (estado === "pendiente") {
        datosReporte = await incidenciasData.datosInformePendientes();

    } else if (estado === "cancelada") {
        datosReporte = await incidenciasData.datosInformeCanceladas();

    } else {
        datosReporte = await incidenciasData.datosInforme();
    }

    const pdf =
        await reportesService.informeIncidenciasPdf(datosReporte);

    return {
        buffer: pdf,
        headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition':
                'inline; filename="incidencias.pdf"'
        }
    };
        /*const datosReporte = await incidenciasData.datosInforme();
        const pdf = await reportesService.informeIncidenciasPdf(datosReporte);
        
        return {
            buffer: pdf,
            headers:{
                'Content-Type' : 'application/pdf',
                'Content-Disposition' : 'inline; filename = "incidencias.pdf"'  
            }
        }*/
    }

const datosInformePendientes = async () => {
    const sql = `
        SELECT
            i.id_incidencia,
            to_char(i.creado, 'DD-MM-YYYY HH24:MI') creada,
            a.descripcion articulo,
            concat(u.apellidos, ' ', u.nombres) asignada_a,
            e.descripcion estado
        FROM incidencias i
        INNER JOIN articulos a
            ON a.id_articulo = i.id_articulo
        INNER JOIN usuarios u
            ON u.id_usuario = i.asignado_a
        INNER JOIN estados e
            ON e.id_estado = i.id_estado
        WHERE i.id_estado = 1
        ORDER BY i.id_incidencia DESC
    `;

    const { rowCount, rows } = await db.query(sql);

    if (rowCount === 0) {
        return null;
    }

    return rows;
};

const datosInformePrioritarias = async () => {
    const sql = `
        SELECT
            i.id_incidencia,
            to_char(i.creado, 'DD-MM-YYYY HH24:MI') creada,
            a.descripcion articulo,
            concat(u.apellidos, ' ', u.nombres) asignada_a,
            e.descripcion estado
        FROM incidencias i
        INNER JOIN articulos a
            ON a.id_articulo = i.id_articulo
        INNER JOIN usuarios u
            ON u.id_usuario = i.asignado_a
        INNER JOIN estados e
            ON e.id_estado = i.id_estado
        WHERE i.id_estado = 1
        AND i.prioridad = 1
        ORDER BY i.id_incidencia DESC
    `;

    const { rowCount, rows } = await db.query(sql);

    if (rowCount === 0) {
        return null;
    }

    return rows;
};

const datosInformeCanceladas = async () => {
    const sql = `
        SELECT
            i.id_incidencia,
            to_char(i.creado, 'DD-MM-YYYY HH24:MI') creada,
            a.descripcion articulo,
            concat(u.apellidos, ' ', u.nombres) asignada_a,
            e.descripcion estado
        FROM incidencias i
        INNER JOIN articulos a
            ON a.id_articulo = i.id_articulo
        INNER JOIN usuarios u
            ON u.id_usuario = i.asignado_a
        INNER JOIN estados e
            ON e.id_estado = i.id_estado
        WHERE i.id_estado = 4
        ORDER BY i.id_incidencia DESC
    `;

    const { rowCount, rows } = await db.query(sql);

    if (rowCount === 0) {
        return null;
    }

    return rows;
};

const datosDashboard = () => {
        return incidenciasData.datosDashboard();
    }

export default { getAll, getById, create, update, remove, creadasPorId, asignadasAId,
   asignarA, finalizarIncidencia, cancelarIncidencia, generarInforme, datosDashboard, datosInformePendientes, datosInformePrioritarias, datosInformeCanceladas };
