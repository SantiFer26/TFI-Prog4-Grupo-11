import puppeteer from "puppeteer";
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


    
const informeIncidenciasPdf = async (datosReporte) => {
        try{
            const plantillaPath  = path.join(__dirname, '../utiles/handlebars/reporte.hbs');
            const plantillaHtml = fs.readFileSync(plantillaPath , 'utf8');
            
            const template = handlebars.compile(plantillaHtml);
            const htmlFinal = template(
                {
                    incidencias: datosReporte
                }
            );
            
            let browser = await puppeteer.launch();

            let page = await browser.newPage();

            // INYECTO PLANTILLA HTML Y ESPERO EL RENDERIZADO
            await page.setContent(htmlFinal);

            const buffer = await page.pdf({
                path: 'incidencias.pdf', 
                format: 'A4', 
                printBackground: true
            });

            await browser.close();
            return buffer;

        }catch(error){
            console.error('Error generando el PDF:', error);
            throw error;
        }
    }

export default { informeIncidenciasPdf }


