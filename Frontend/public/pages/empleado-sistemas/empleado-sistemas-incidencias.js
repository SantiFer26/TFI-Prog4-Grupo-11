console.log("SE CARGO EL JS DE INCIDENCIAS");
async function cargarIncidencias() {
    if (!sessionStorage.getItem("token")) {
        mostrarToast("Necesitas iniciar sesión para acceder al recurso.", "danger");
        return;
    }
    else {
        try {
            const response = await fetch("http://localhost:3000/api/v1/incidencias", 
                            {headers: {"Authorization": `Bearer ${sessionStorage.getItem("token")}`}});
            console.log(response.status);        
            
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

            incidencias.forEach(inc => {
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
                creada_el.textContent = new Date(inc.creado).toLocaleDateString();

                const prioridad = document.createElement("td");
                prioridad.textContent = inc.prioridad;

                const estado_incidencia = document.createElement("td");
                estado_incidencia.textContent = estadoTexto;

                /*const acciones = document.createElement("td");
                const botonCancelar = document.createElement("button");

                botonCancelar.classList.add("btn", "btn-danger", "btn-sm");
                botonCancelar.textContent = "Cancelar";

                acciones.appendChild(botonCancelar);*/
                //Boton cancelar incidencia en estado pendiente
                const acciones = document.createElement("td");


                        if (inc.id_estado === 1) {

                            const botonComenzar = document.createElement("button");

                            botonComenzar.classList.add(
                                "btn",
                                "btn-warning",
                                "btn-sm"
                            );

                            botonComenzar.textContent = "Comenzar";

                            botonComenzar.addEventListener("click", async () => {
                                console.log("Iniciando incidencia", inc.id_incidencia);
                                    try {

                                        const response = await fetch(
                                            `http://localhost:3000/api/v1/incidencias/${inc.id_incidencia}/iniciar`,
                                            {
                                                method: "PUT",
                                                headers: {
                                                    "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                                                }
                                            }
                                        );

                                        if (response.ok) {
                                            alert("Incidencia iniciada correctamente");
                                            cargarIncidencias();
                                        }

                                    } catch (error) {
                                        console.error(error);
                                    }

                                });

                            acciones.appendChild(botonComenzar);
                        }

                        else if (inc.id_estado === 2) {

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
        alert("Debe ingresar una resolución");
        return;
    }

    try {

        const response = await fetch(
            `http://localhost:3000/api/v1/incidencias/${idIncidenciaSeleccionada}/finalizar`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    resolucion
                })
            }
        );

        if (response.ok) {

            alert("Incidencia finalizada");

            panelResolucion.style.display = "none";

            inputResolucion.value = "";

            cargarIncidencias();
        }

    } catch (error) {
        console.error(error);
    }

});