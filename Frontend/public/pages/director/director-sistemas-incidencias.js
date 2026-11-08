const token = sessionStorage.getItem("token");

const params = new URLSearchParams(window.location.search);
const estado = params.get("estado") || "todas"; // Si no viene nada, por defecto "todas"
const prioridad = params.get("prioridad");

const titulo = document.getElementById("titulo-tabla-director");
const contenedorTabla = document.getElementById("contenedor-tabla");

// Se ajusta el título según corresponda
if (prioridad === "1" && estado === "pendiente") {
    titulo.textContent = "Incidencias Pendientes Prioritarias";
    cargarDatos("http://localhost:3000/api/v1/incidencias/prioritarias");

} else if (estado === "pendiente") {
    titulo.textContent = "Incidencias Pendientes";
    cargarDatos("http://localhost:3000/api/v1/incidencias/pendientes");

} else if (estado === "cancelada") {
    titulo.textContent = "Incidencias Canceladas";
    cargarDatos("http://localhost:3000/api/v1/incidencias/canceladas");

} else {
    titulo.textContent = "Todas las Incidencias";
    cargarDatos("http://localhost:3000/api/v1/incidencias");
}

const PRIORIDADES = { 1: "Alta", 2: "Media", 3: "Baja" };

async function cargarDatos(url) {
    const tbody = document.getElementById("cuerpo-tabla");

    if (!token) {
        mostrarToast("Necesitas iniciar sesión para acceder al recurso.", "danger");
        return;
    }
    else {
        try {
            const response = await fetch(url, {headers: { "Authorization": `Bearer ${token}` }});

            if (!response.ok) {
                mostrarToast(`Error al obtener las incidencias (${response.status})`, "danger");
                return;
            }

            const incidencias = await response.json();
            tbody.innerHTML = "";

            if (incidencias.length === 0) {
                mostrarToast("No se encontraron incidencias", "danger");
                return;
            }

            contenedorTabla.classList.remove("d-none");

            incidencias.forEach(inc => {
                const fila = document.createElement("tr");

                const id_incidencia = document.createElement("th");
                id_incidencia.textContent = inc.id_incidencia;

                const creada_el = document.createElement("td");
                creada_el.textContent = new Date(inc.creado).toLocaleDateString();

                const prioridad = document.createElement("td");
                prioridad.textContent = PRIORIDADES[inc.prioridad];

                const estado = document.createElement("td");
                estado.textContent = inc.estado; // traer la descripcion del estado de la BD

                const acciones = document.createElement("td");

                const btnAsignar = document.createElement("button");
                btnAsignar.classList.add("btn", "btn-info", "btn-sm", "me-3");
                btnAsignar.textContent = "Asignar a";

                const btnCancelar = document.createElement("button");
                btnCancelar.classList.add("btn", "btn-danger", "btn-sm");
                btnCancelar.textContent = "Cancelar";

                const estadoActual = inc.estado ? inc.estado.toLowerCase() : "";
                if (estadoActual !== "pendiente") {
                    btnAsignar.disabled = true;
                    btnCancelar.disabled = true;
                }

                acciones.appendChild(btnAsignar);
                acciones.appendChild(btnCancelar);

                fila.appendChild(id_incidencia);
                fila.appendChild(creada_el);
                fila.appendChild(prioridad);
                fila.appendChild(estado);
                fila.appendChild(acciones);

                tbody.appendChild(fila);
            });

        } catch (error) {
            console.error("Error de conexión:", error);
            mostrarToast("Error al conectar con el servidor.", "danger");
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