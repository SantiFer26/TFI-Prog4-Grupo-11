const Modal = window.bootstrap.Modal;

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
                            {headers: {"Authorization": `Bearer ${token}`}});
            console.log(response.status);
            
            if (!response.ok) {
                mostrarToast("Hubo un error al cargar las incidencias", "danger");
                return;
            }

            const incidencias = await response.json();
            console.log(incidencias);
            const tbody = document.querySelector("tbody");
            //tbody.innerHTML = "";
            while (tbody.firstChild) {
                tbody.removeChild(tbody.firstChild);
            }

            const PRIORIDADES = { 1: "Alta", 2: "Media", 3: "Baja" };

            incidencias.forEach(inc => {
                console.log("id:", inc.id_incidencia,
                            "estado:", inc.id_estado,
                            "tipo:", typeof inc.id_estado);

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
                prioridad.textContent = PRIORIDADES[inc.prioridad];

                const estado_incidencia = document.createElement("td");
                estado_incidencia.textContent = estadoTexto;

                const articulo = document.createElement("td");
                articulo.textContent = inc.articulo_descripcion;

                const acciones = document.createElement("td");
                
                //Boton cancelar incidencia en estado pendiente
                if (inc.id_estado === 1) {
                    const btnCancelar = document.createElement("button");
                
                    btnCancelar.classList.add("btn", "btn-danger", "btn-sm");
                    btnCancelar.textContent = "Cancelar";

                    btnCancelar.setAttribute("data-id-inc", `${inc.id_incidencia}`);
                    btnCancelar.setAttribute("data-bs-toggle", "modal");
                    btnCancelar.setAttribute("data-bs-target", "#modalCancelarIncidencia");
                    
                    acciones.appendChild(btnCancelar);
                }

                fila.appendChild(id_incidencia);
                fila.appendChild(articulo)
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


// ==========================================
// Cancelar Incidencia con estado "Pendiente"
// ==========================================
const modalCancInc = document.getElementById("modalCancelarIncidencia");
const miModalCancInc = Modal.getOrCreateInstance(modalCancInc);

let idIncCancelar = 0;

modalCancInc.addEventListener("show.bs.modal", event => {
    const boton = event.relatedTarget;

    idIncCancelar = boton.getAttribute("data-id-inc");

    document.getElementById("tituloModal").innerText =`Cancelar Incidencia con ID ${idIncCancelar}`;
});

document.getElementById("btnCancelarIncidencia").addEventListener("click", async () => {
    if (!token) {
        mostrarToast("Necesitas iniciar sesión para acceder al recurso.", "danger");
        return;
    }
    else {
        try {
            const motivo = document.getElementById("inputCancelarIncidencia").value.trim();
            const response = await fetch(`http://localhost:3000/api/v1/incidencias/${idIncCancelar}/cancelar`, {
                method: "PUT", 
                headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`}, 
                body: JSON.stringify({ descripcion_res: motivo })
            });

            miModalCancInc.hide();

            if (response.ok) {
                mostrarToast("Incidencia cancelada con éxito.", "success");
                cargarIncidencias();
            } 
            else {
                const data = await response.json();
                mostrarToast(data.error || "Error al cancelar la incidencia", "danger");
            }

        } catch (error) {
            console.error(error);
            mostrarToast("Error al cancelar la incidencia", "danger");
        }
    }
});


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