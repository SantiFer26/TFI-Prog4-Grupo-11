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

        //const datosCorreo = await incidenciasData.informacionIncidencia(incidencia);
        //await notificacionesService.enviarCorreo(datosCorreo);
        return result;
    }
  
const cancelarIncidencia = async (id_incidencia, descripcion_res) => {
        // CONTROLES??
        // LA INCIDENCIA EXISTE? ESTA PENDIENTE?
        const result = await incidenciasData.cancelarIncidencia(id_incidencia, descripcion_res);
        return result;
     }
const iniciarIncidencia = (incidencia) => {
    return incidenciasData.iniciarIncidencia(incidencia);
};

const generarInforme = async () => {
        const datosReporte = await incidenciasData.datosInforme();
        const pdf = await reportesService.informeIncidenciasPdf(datosReporte);
        
        return {
            buffer: pdf,
            headers:{
                'Content-Type' : 'application/pdf',
                'Content-Disposition' : 'inline; filename = "incidencias.pdf"'  
            }
        }
    }

const datosDashboard = () => {
        return incidenciasData.datosDashboard();
    }

export default { getAll, getById, create, update, remove, creadasPorId, asignadasAId,
   asignarA, finalizarIncidencia, cancelarIncidencia, generarInforme, datosDashboard, iniciarIncidencia };
