
import incidenciasService from "../services/incidencias.service.js";

const getAll = async (req, res) => {
    console.log("ENTRE A GETALL");
    console.log(req.usuario);
    try {

        const { estado, prioridad } = req.query;
        const filtros = { estado, prioridad }
        let rows = [];
        if (req.usuario.rol === 1) {
            rows = await incidenciasService.getAll(filtros);
        }
        if (req.usuario.rol === 2) {
            rows = await incidenciasService.asignadasAId(
            req.usuario.id_usuario
        );
        }
    
        if (req.usuario.rol === 3) {
            console.log(req.usuario);
            rows = await incidenciasService.creadasPorId(
            req.usuario.id_usuario
        );
        }

        res.status(200).json(rows);

    } catch(error) {
        console.error(error);
        res.status(500).json({
        error: "Error al obtener incidencias"
        });
    }
};

const creadasPorId = async (req, res) => {
    try {
        let rows = [];

      // ES EMPLEADO MUNICIPAL
        if (req.usuario.rol === 3){
            rows = await incidenciasService.creadasPorId(req.usuario.id_usuario);
        }

      // ES EMPLEADO AREA SISTEMAS
        if (req.usuario.rol === 2){
            rows = await incidenciasService.asignadasAId(req.usuario.id_usuario);
        }

        if(rows === null){
            return res.status(200).json({mensaje: 'Incidencias no encontradas.'});
        }

        res.status(200).json({
            incidencias: rows
        });

    } catch(error){
        console.error('Error al obtener incidencias:', error.message);
        return res.status(500).json({ 
            error: 'Error interno del servidor.' 
        });
    }
};

const create = async (req, res) => {
    console.log(req.body);
    console.log(req.usuario);

  try {

      const incidencia = { 
          id_articulo : req.body.id_articulo, 
          creado_por : req.usuario.id_usuario,
          descripcion_pedido : req.body.descripcion_pedido,
          prioridad : req.body.prioridad
      }

      const rows = await incidenciasService.create(incidencia);
      
      if(rows === null){
          return res.status(404).json({mensaje: 'Incidencia no creada.'});
      }

      return res.status(201).json({
          mensaje: 'Incidencia creada.',
          categoria: rows
      });

  } catch (error) {
      console.error(error);
      return res.status(500).json({ 
        error: "Error al crear la incidencia" });
  }
};

const update = async (req, res) => {
  try {
    const actualizada = await incidenciasService.update(req.params.id, req.body);
    res.status(200).json(actualizada);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar incidencia" });
  }
};

const remove = async (req, res) => {
  try {
    await incidenciasService.remove(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar incidencia" });
  }
};

const asignarA = async (req, res) => {
        try{       
            const incidencia = { 
                id_incidencia : req.params.id_incidencia, 
                asignado_a: req.body.asignado_a
            }
        
            const rows = await incidenciasService.asignarA(incidencia);

            if(rows === null){
                return res.status(404).json({mensaje: 'Incidencia no asignada.'});
            }

            return res.status(200).json({
                mensaje: 'Incidencia asignada correctamente',
                incidencia: rows
            });
            
        }catch(error){
            console.error('Error al asignar Incidencia:', error.message);
            return res.status(500).json({ 
                error: 'Error interno del servidor.' 
            });
        }
      };

const finalizarIncidencia = async (req, res) => {
        try{
                   
            const incidencia = { 
                id_incidencia : req.params.id_incidencia, 
                resolucion: req.body.resolucion
            }
        
            const rows = await incidenciasService.finalizarIncidencia(incidencia);

            if(rows === null){
                return res.status(404).json({mensaje: 'Incidencia no finalizada.'});
            }

            return res.status(200).json({
                mensaje: 'Incidencia finalizada.',
                incidencia: rows
            });
            
        }catch(error){
            console.error('Error al asignar Incidencia:', error.message);
            return res.status(500).json({ 
                error: 'Error interno del servidor.' 
            });
        }
      };

const cancelar = async (req, res) => {
        try{
            const id_incidencia = req.params.id_incidencia; 
            const { descripcion_res } = req.body;
            const rows = await incidenciasService.cancelarIncidencia(id_incidencia, descripcion_res);

            if(rows === null){
                return res.status(200).json({mensaje: 'Incidencia no cancelada.'});
            }

            return res.status(200).json({
                mensaje: 'Incidencia cancelada.',
                incidencia: rows
            });
            
        }catch(error){
            console.error('Error al cancelar Incidencia:', error.message);
            return res.status(500).json({ 
                error: 'Error interno del servidor.' 
            });
        }
    };

const generarInforme = async (req, res) => {
        try{
            const {buffer, headers} = await incidenciasService.generarInforme();
            res.set(headers)
            res.status(200).end(buffer);
            
        }catch(error){
            console.error('Error al generar informe de Incidencia:', error.message);
            return res.status(500).json({ 
                error: 'Error interno del servidor.' 
            });
        }
      };

const datosDashboard = async (req, res) => {
        try{
            const rows = await incidenciasService.datosDashboard();

            if(rows === null){
                return res.status(200).json({mensaje: 'Sin datos para el dashboard.'});
            }

            res.status(200).json({
                dashboard: rows
            });

        }catch(error){
            console.error('Error al obtener datos dashboard:', error.message);
            return res.status(500).json({ 
                error: 'Error interno del servidor.' 
            });
        }
    };
export default { getAll, creadasPorId, create, update, remove, asignarA, finalizarIncidencia, cancelar, generarInforme, datosDashboard };
