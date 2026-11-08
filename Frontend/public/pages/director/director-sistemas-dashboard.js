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
parrafoInicio.textContent = "Resumen operativo de incidencias:";

buscarDatosDashboard();

// ===============================
// Resumen Dashboard
// ===============================
async function buscarDatosDashboard() {
    if (!token) {
        mostrarToast("Necesitas iniciar sesión para acceder al recurso.", "danger");
        return;
    } else {    
        try {
            const response = await fetch(`http://localhost:3000/api/v1/incidencias/datos-dashboard`, 
                            {headers: {Authorization: `Bearer ${token}`}});

            if (!response.ok) {
                mostrarToast("Error al cargar datos de incidencias.", "danger");
                return;
            }

            const data = await response.json();

            const valorPendientes = document.getElementById('total_pendientes');
            const valorPrioritarias = document.getElementById('total_prioritarias');
            const valorCanceladas = document.getElementById('total_canceladas');
            const valorTotales = document.getElementById('incidencias_totales');
    
            valorPendientes.textContent = data.total_pendientes;
            valorPrioritarias.textContent = data.total_prioritarias;
            valorCanceladas.textContent = data.total_canceladas;
            valorTotales.textContent = data.total_canceladas;

        } catch (error) {
            console.log(error);
        }
    }
}

// ===============================
// Cerrar Sesión
// ===============================
const cerrarSesion = document.getElementById("cerrar-sesion");
cerrarSesion.addEventListener("click", () => {
    sessionStorage.removeItem("token");
});

// ===============================
// TOAST
// ===============================
const toast = document.getElementById("miToast");
function mostrarToast(texto, tipo) {
    document.getElementById("textoToast").innerText = texto;
    if (tipo === "success") {
        toast.classList.remove("text-bg-danger");
        toast.classList.add("text-bg-success");
    }
    else {
        toast.classList.remove("text-bg-success");
        toast.classList.add("text-bg-danger");
    }
    const Toast = window.bootstrap.Toast;
    const miToast = Toast.getOrCreateInstance(toast);
    miToast.show();
}