const Modal = window.bootstrap.Modal;

const token = sessionStorage.getItem("token");

const params = new URLSearchParams(window.location.search);
const estado = params.get("estado") || "todas"; // Si no viene nada, por defecto "todas"
const prioridad = params.get("prioridad");

const titulo = document.getElementById("titulo-tabla-director");
const contenedorTabla = document.getElementById("contenedor-tabla");

let urlActual = "";
// Se ajusta el título según corresponda
if (prioridad === "1" && estado === "pendiente") {
    titulo.textContent = "Incidencias Pendientes Prioritarias";
    urlActual = "http://localhost:3000/api/v1/incidencias?estado=pendiente&prioridad=1";

} else if (estado === "pendiente") {
    titulo.textContent = "Incidencias Pendientes";
    urlActual = "http://localhost:3000/api/v1/incidencias?estado=pendiente";

} else if (estado === "cancelada") {
    titulo.textContent = "Incidencias Canceladas";
    urlActual = "http://localhost:3000/api/v1/incidencias?estado=cancelada";

} else {
    titulo.textContent = "Todas las Incidencias";
    urlActual = "http://localhost:3000/api/v1/incidencias";
}
cargarDatos(urlActual);

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

                const descripcion = document.createElement("td");
                descripcion.textContent = inc.descripcion_pedido;

                const asignado_a = document.createElement("td");
                asignado_a.textContent = inc.asignado_a;

                const creada_el = document.createElement("td");
                creada_el.textContent = inc.creado;

                const prioridad = document.createElement("td");
                prioridad.textContent = PRIORIDADES[inc.prioridad];

                const estado = document.createElement("td");
                estado.textContent = inc.estado; // traer la descripcion del estado de la BD

                const acciones = document.createElement("td");

                const btnAsignar = document.createElement("button");
                btnAsignar.classList.add("btn", "btn-info", "btn-sm", "me-3");
                btnAsignar.textContent = "Asignar a";
                btnAsignar.setAttribute("data-id-inc", `${inc.id_incidencia}`);
                btnAsignar.setAttribute("data-id-asignado", `${inc.id_usuario_asignado}`)
                btnAsignar.setAttribute("data-bs-toggle", "modal");
                btnAsignar.setAttribute("data-bs-target", "#modalAsignarIncidencia");

                const btnCancelar = document.createElement("button");
                btnCancelar.classList.add("btn", "btn-danger", "btn-sm");
                btnCancelar.textContent = "Cancelar";
                btnCancelar.setAttribute("data-id-inc", `${inc.id_incidencia}`);
                btnCancelar.setAttribute("data-bs-toggle", "modal");
                btnCancelar.setAttribute("data-bs-target", "#modalCancelarIncidencia");

                const estadoActual = inc.estado ? inc.estado.toLowerCase() : "";
                if (estadoActual !== "pendiente") {
                    btnAsignar.disabled = true;
                    btnCancelar.disabled = true;
                }

                acciones.appendChild(btnAsignar);
                acciones.appendChild(btnCancelar);

                fila.appendChild(id_incidencia);
                fila.appendChild(descripcion);
                fila.appendChild(asignado_a)
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


// ==========================================
// Cancelar Incidencia con estado "Pendiente"
// ==========================================
const modalCancInc = document.getElementById("modalCancelarIncidencia");
const miModalCancInc = Modal.getOrCreateInstance(modalCancInc);

let idIncEliminar = 0;

modalCancInc.addEventListener("show.bs.modal", event => {
    const boton = event.relatedTarget;

    idIncEliminar = boton.getAttribute("data-id-inc");

    document.getElementById("tituloModal").innerText =`Cancelar Incidencia con ID ${idIncEliminar}`;
});

document.getElementById("btnCancelarIncidencia").addEventListener("click", async () => {
    if (!token) {
    mostrarToast("Necesitas iniciar sesión para acceder al recurso.", "danger");
    return;
    }
    else {
        try {
            const motivo = document.getElementById("inputCancelarIncidencia").value.trim();
            const response = await fetch(`http://localhost:3000/api/v1/incidencias/${idIncEliminar}/cancelar`, {
                method: "PUT", 
                headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`}, 
                body: JSON.stringify({ descripcion_res: motivo })
            });

            miModalCancInc.hide();

            if (response.ok) {
                mostrarToast("Incidencia cancelada con éxito.", "success");
                cargarDatos(urlActual);
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


// ==========================================
// Asignar incidencia
// ==========================================
if (!token) {
    mostrarToast("Necesitas iniciar sesión para acceder al recurso.", "danger");
}
else {
    let idIncAsignar = 0;
    const modalAsignar = document.getElementById("modalAsignarIncidencia");
    const miModalAsignar = Modal.getOrCreateInstance(modalAsignar);

    modalAsignar.addEventListener("show.bs.modal", async event => {
        const boton = event.relatedTarget;

        idIncAsignar = boton.getAttribute("data-id-inc");
        const idAsignadoActual = Number(boton.getAttribute("data-id-asignado"));

        const response = await fetch('http://localhost:3000/api/v1/usuarios/empleados-sistemas', 
                        {headers: {"Authorization": `Bearer ${token}`}});

        const empleados = await response.json();

        console.log("Empleados recibidos:", empleados);
        console.log("Asignado actual:", idAsignadoActual);

        const defaultOption = document.getElementById('defaultOption');
        document.getElementById("selectEmpleadosSistemas").replaceChildren(defaultOption); //limpiar los usuarios cargados anteriormente
        
        const empleadosDisponibles = empleados;//.filter(emp => emp.id_usuario !== idAsignadoActual);

        empleadosDisponibles.forEach(emp => {
            const option = document.createElement('option');
            option.value = emp.id_usuario;
            option.textContent = `${emp.id_usuario} - ${emp.nombres} ${emp.apellidos}`;
            selectEmpleadosSistemas.appendChild(option);
        });

        document.getElementById("tituloModalAsignar").innerText =`Asignar Incidencia con ID ${idIncAsignar}`;
    });

    document.getElementById("btnAsignarIncidencia").addEventListener("click", async () => {
        const idUsuario = document.getElementById("selectEmpleadosSistemas").value;

        if (idUsuario === "") {
            mostrarToast("Debe seleccionarse un empleado", "danger");
            return;
        }

        try {
            const respuesta = await fetch(`http://localhost:3000/api/v1/incidencias/${idIncAsignar}/asignar`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}`},
                body: JSON.stringify({ asignado_a: idUsuario })
            });

            if (respuesta.ok) {
                mostrarToast("Incidencia asignada con éxito", "success");
                miModalAsignar.hide();
                cargarDatos(urlActual); // refresca la tabla
            } else {
                mostrarToast("Error al asignar la incidencia", "danger");
            }

        } catch (error) {
            console.error("Error al asignar la incidencia:", error);
            mostrarToast("Error inesperado al asignar la incidencia", "danger");
        }
    });
}
// ===============================
// Boton realizar PDF
// ===============================
const btnReportePDF = document.getElementById("btn-reporte-pdf");
btnReportePDF.addEventListener("click", descargarPDF);

async function descargarPDF() {
    try {

        const response = await fetch(
            "http://localhost:3000/api/v1/incidencias/informe",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            mostrarToast(
                "Error al generar el informe",
                "danger"
            );
            return;
        }

        const blob = await response.blob();

        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "informe-incidencias.pdf";

        document.body.appendChild(a);
        a.click();

        a.remove();
        window.URL.revokeObjectURL(url);

        mostrarToast(
            "Informe descargado correctamente",
            "success"
        );

    } catch (error) {
        console.error(error);

        mostrarToast(
            "Error al descargar el PDF",
            "danger"
        );
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