const token = sessionStorage.getItem("token");

console.log("SE CARGO EL JS DE INCIDENCIAS");
async function cargarIncidencias() {
    if (!token) {
        mostrarToast("Necesitas iniciar sesión para acceder al recurso.", "danger");
        return;
    }
    else {
        try {
            const response = await fetch("http://localhost:3000/api/v1/incidencias", 
                            {headers: {"Authorization": `Bearer ${token}`},cache: "no-store"});
            console.log(response.status);

            if (!response.ok) {
                mostrarToast("Hubo un error al cargar las incidencias", "danger");
                return;
            }
            
            const incidencias = await response.json();

            console.log("STATUS:", response.status);
            console.log("RESPUESTA:", incidencias);
            console.log("ES ARRAY:", Array.isArray(incidencias));
            console.log(incidencias);

            const tbody = document.querySelector("tbody");
            //tbody.innerHTML = "";
            while (tbody.firstChild) {
                tbody.removeChild(tbody.firstChild);
            }

            const incidenciasFiltradas = incidencias

            if (incidenciasFiltradas.length === 0) {
                mostrarToast("No tenés incidencias asignadas", "danger");
                return;
            }
            incidenciasFiltradas.forEach(inc => {
                console.log(inc);
                // Traducir estado
                let estadoTexto = "";
                switch (inc.id_estado) {
                    case 1: estadoTexto = "Pendiente"; break;
                    case 2: estadoTexto = "En proceso"; break;
                    case 3: estadoTexto = "Finalizada"; break;
                    case 4: estadoTexto = "Cancelada"; break;
                    default: estadoTexto = "Desconocido";
                }

                const fila = document.createElement("tr");

                const id_incidencia = document.createElement("td");
                id_incidencia.textContent = inc.id_incidencia;

                const creada_el = document.createElement("td");
                creada_el.textContent = inc.creado ? inc.creado.split(' ')[0] : '';

                const prioridad = document.createElement("td");
                prioridad.textContent = inc.prioridad;

                const estado_incidencia = document.createElement("td");
                estado_incidencia.textContent = estadoTexto;

                const acciones = document.createElement("td");

                console.log(
                    "Incidencia:",
                    inc.id_incidencia,
                    "Estado:",
                    inc.id_estado
                );
                
                if (inc.id_estado === 2) {
                    const botonFinalizar = document.createElement("button");

                    botonFinalizar.classList.add(
                        "btn",
                        "btn-success",
                        "btn-sm"
                    );

                    botonFinalizar.textContent = "Finalizar";
                    
                    botonFinalizar.addEventListener("click", () => {
                        idIncidenciaSeleccionada = inc.id_incidencia;
                        panelResolucion.style.display = "block";
                    });
    
                    acciones.appendChild(botonFinalizar);
                }

                fila.appendChild(id_incidencia);
                fila.appendChild(creada_el);
                fila.appendChild(prioridad);
                fila.appendChild(estado_incidencia);
                fila.appendChild(acciones);

                tbody.appendChild(fila);
            })

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

// ===================================
// TOAST y PANEL RESOLUCION INCIDENCIA
// ===================================
const toast = document.getElementById("miToast");
const panelResolucion = document.getElementById("panel-resolucion");
const inputResolucion = document.getElementById("input-resolucion");
const btnGuardarResolucion = document.getElementById("btn-guardar-resolucion");

let idIncidenciaSeleccionada = null;

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

btnGuardarResolucion.addEventListener("click", async () => {

    const resolucion = inputResolucion.value.trim();

    if (!resolucion) {
        mostrarToast("Debe ingresar una resolución", "danger");
        return;
    }

    try {

        const response = await fetch(
            `http://localhost:3000/api/v1/incidencias/${idIncidenciaSeleccionada}/finalizar`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    resolucion
                })
            }
        );

        if (response.ok) {

            mostrarToast("Incidencia finalizada con éxito", "success");

            panelResolucion.style.display = "none";

            inputResolucion.value = "";

            cargarIncidencias();
        } else {
            mostrarToast("Error al finalizar la incidencia", "danger");
        }

    } catch (error) {
        console.error(error);
    }

});