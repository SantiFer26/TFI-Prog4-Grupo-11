import nodemailer from "nodemailer";
import fs from 'fs';
import path from "path";
import { fileURLToPath } from "url";
import handlebars from "handlebars";



const enviarCorreo = async (datosCorreo) => {
        const {creada, finalizada, resolucion, destinatario, descripcion_estado} = datosCorreo[0];

        console.log("Destinatario:", destinatario);
        console.log("Estado detectado:", descripcion_estado);
        const esCancelada = descripcion_estado && descripcion_estado.toLowerCase() === 'cancelada';

        // Textos y estilos dinámicos
        const titulo = esCancelada ? "Incidencia Cancelada" : "Incidencia Finalizada";
        const subtitulo = esCancelada 
            ? "La incidencia que creaste ha sido cancelada" 
            : "La incidencia que creaste ha sido finalizada";

        const etiquetaFecha = esCancelada ? "Cancelada el" : "Finalizada el";
        const etiquetaDetalle = esCancelada ? "Motivo de cancelación" : "Resolución";

        const colorTitulo = esCancelada ? '#dc3545' : '#03912e'; // rojo si es cancelada, verde si está resuelta

        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const plantillaPath = path.join(__dirname, '../utiles/handlebars/plantilla.hbs');
        const plantillaTemp = fs.readFileSync(plantillaPath, 'utf-8');
        
        const plantilla = handlebars.compile(plantillaTemp);

        const datos = {
            titulo: titulo,
            subtitulo: subtitulo,
            etiquetaFecha: etiquetaFecha,
            etiquetaDetalle: etiquetaDetalle,
            colorTitulo: colorTitulo,
            creada: creada, 
            finalizada: finalizada,
            resolucion: resolucion
        };

        const correoHtml = plantilla(datos);
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth:{
                user: process.env.CORREO,
                pass: process.env.CLAVE,
            }
        });

        const correoConf = {
            from: process.env.CORREO,
            to: destinatario,
            subject: titulo,
            html: correoHtml
        }

        try {
            // Esperamos a que Gmail realmente confirme el despacho. Tarda uno o dos segundos al hacer click.
            const info = await transporter.sendMail(correoConf);
            console.log("Correo enviado con éxito.");
            return true;
        } catch (error) {
            console.error("Error al enviar con Nodemailer:", error);
            return false;
        }
    }
export default { enviarCorreo }