function decodificarToken(token) {
    try {
        const payloadBase64 = token.split(".")[1];
        return JSON.parse(atob(payloadBase64));
    } catch {
        return null;
    }
}
const token = sessionStorage.getItem("token");
    
const datos = decodificarToken(token);


const h1Inicio = document.getElementById("h1-inicio-sistemas");
h1Inicio.textContent = `¡Bienvenido/a ${datos.nombres}!`;
const parrafoInicio = document.getElementById("p-inicio-sistemas");
parrafoInicio.textContent = "¿Qué es lo que querés hacer hoy?";


const btnCrearIncidencia = document.getElementById("btnCrearIncidencia");
btnCrearIncidencia.addEventListener("click", () => {
    window.location.href = "./empleado-municipal-articulos.html";
})

const btnVerIncidencias = document.getElementById("btnVerIncidencias");
btnVerIncidencias.addEventListener("click", () => {
    window.location.href = "./empleado-municipal-incidencias.html";
})

// ===============================
// Cerrar Sesión
// ===============================
const cerrarSesion = document.getElementById("cerrar-sesion");
cerrarSesion.addEventListener("click", () => {
    sessionStorage.removeItem("token");
});