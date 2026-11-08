import nodemailer from "nodemailer";
import fs from 'fs';
import path from "path";
import { fileURLToPath } from "url";
import handlebars from "handlebars";



const   enviarCorreo = async (datosCorreo) => {
        const {creada, finalizada, resolucion, destinatario} = datosCorreo[0];
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const plantillaPath = path.join(__dirname, '../utiles/handlebars/plantilla.hbs');
        const plantillaTemp = fs.readFileSync(plantillaPath, 'utf-8');
        
        const plantilla = handlebars.compile(plantillaTemp);

        const datos = {
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
            subject: 'Incidencia Finalizada',
            html: correoHtml
        }

        transporter.sendMail(correoConf, (error, info) => {
            if(error){
                console.log(`Error enviado correo electrónico ${error}`);
                return false;
            }

            return true;
        });
    }
export default { enviarCorreo }