async function cargarIncidencias() {
    if (!sessionStorage.getItem("token")) {
        mostrarToast("Necesitas iniciar sesión para acceder al recurso.", "danger");
    }
    else {
        try {
            const response = await fetch("http://localhost:3000/api/v1/incidencias", 
                            {headers: {"Authorization": `Bearer ${sessionStorage.getItem("token")}`}});
                            
            const incidencias = await response.json();

            const tbody = document.querySelector("tbody");
            tbody.innerHTML = "";

            incidencias.forEach(inc => {

                // Traducir estado
                let estadoTexto = "";
                switch (inc.id_estado) {
                    case 1: estadoTexto = "Pendiente"; break;
                    case 2: estadoTexto = "En proceso"; break;
                    case 3: estadoTexto = "Finalizada"; break;
                    default: estadoTexto = "Desconocido";
                }

                const fila = document.createElement("tr");

                const id_incidencia = document.createElement("td");
                id_incidencia.textContent = inc.id_incidencia;

                const creada_el = document.createElement("td");
                creada_el.textContent = new Date(inc.creado).toLocaleDateString();

                const prioridad = document.createElement("td");
                prioridad.textContent = inc.prioridad;

                const estado_incidencia = document.createElement("td");
                estado_incidencia.textContent = estadoTexto;

                const acciones = document.createElement("td");
                const botonCancelar = document.createElement("button");

                botonCancelar.classList.add("btn", "btn-danger", "btn-sm");
                botonCancelar.textContent = "Cancelar";

                acciones.appendChild(botonCancelar);

                fila.appendChild(id_incidencia);
                fila.appendChild(creada_el);
                fila.appendChild(prioridad);
                fila.appendChild(estado_incidencia);
                fila.appendChild(acciones);

                tbody.appendChild(fila);
            });

        } catch (error) {
            console.error("Error cargando incidencias:", error);
        }
    }
}

cargarIncidencias();

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