const Modal = window.bootstrap.Modal;

const tabla = document.getElementById("tabla_categorias");

// ===============================
// CARGAR CATEGORÍAS
// ===============================
async function cargarCategorias() {
    if (!sessionStorage.getItem("token")) {
        mostrarToast("Necesitas iniciar sesión para acceder al recurso.", "danger");
        return;
    }
    else {
        try {
            const response = await fetch("http://localhost:3000/api/v1/categorias", 
                            {headers: {"Authorization": `Bearer ${sessionStorage.getItem("token")}`}});

            if (!response.ok) {
                mostrarToast("Hubo un error al cargar las categorías", "danger");
                return;
            }

            const categorias = await response.json();

            tabla.innerHTML = "";

            categorias.forEach(cat => {
                const filaActual = document.createElement("tr");

                const idCat = document.createElement("th");
                idCat.textContent = cat.id_categoria;

                const desc = document.createElement("td");
                desc.textContent = cat.descripcion;

                const acciones = document.createElement("td");

                const botonEditar = document.createElement("button");
                botonEditar.classList.add("btn", "btn-warning", "btn-sm", "me-2");
                botonEditar.textContent = "Editar";

                botonEditar.setAttribute("data-id-cat", `${cat.id_categoria}`)
                botonEditar.setAttribute("data-descripcion", `${cat.descripcion}`)
                botonEditar.setAttribute("data-bs-toggle", "modal");
                botonEditar.setAttribute("data-bs-target", "#modalEditarCategoria");

                const botonEliminar = document.createElement("button");
                botonEliminar.classList.add("btn", "btn-danger", "btn-sm", "me-2");
                botonEliminar.textContent = "Eliminar";

                botonEliminar.setAttribute("data-id-cat", `${cat.id_categoria}`)
                botonEliminar.setAttribute("data-descripcion", `${cat.descripcion}`)
                botonEliminar.setAttribute("data-bs-toggle", "modal");
                botonEliminar.setAttribute("data-bs-target", "#modalEliminarCategoria");

                acciones.appendChild(botonEditar);
                acciones.appendChild(botonEliminar);

                filaActual.appendChild(idCat);
                filaActual.appendChild(desc);
                filaActual.appendChild(acciones);

                tabla.appendChild(filaActual);
            })

        } catch (error) {
            console.error("Error cargando categorías:", error);
        }
    }
}

cargarCategorias();

// ===============================
// BÚSQUEDA DE CATEGORÍA POR ID
// ===============================
async function buscarCategoria(idBuscado) {
    if (!sessionStorage.getItem("token")) {
        mostrarToast("Necesitas iniciar sesión para acceder al recurso.", "danger");
        return;
    }
    else {
        try {
            const response = await fetch(`http://localhost:3000/api/v1/categorias/${idBuscado}`, 
                            {headers: {"Authorization": `Bearer ${sessionStorage.getItem("token")}`}});

            if (!response.ok) {
                mostrarToast("Categoría no encontrada", "danger");
                return;
            }
                
            const cat = await response.json();
        
            tabla.innerHTML = ""; // limpiar tabla

            const fila = document.createElement("tr");

            const idCat = document.createElement("th");
            idCat.textContent = cat.id_categoria;

            const desc = document.createElement("td");
            desc.textContent = cat.descripcion;

            const acciones = document.createElement("td");

            const botonEditar = document.createElement("button");
            botonEditar.classList.add("btn", "btn-warning", "btn-sm", "me-2");
            botonEditar.textContent = "Editar";

            botonEditar.setAttribute("data-id-cat", `${cat.id_categoria}`)
            botonEditar.setAttribute("data-descripcion", `${cat.descripcion}`)
            botonEditar.setAttribute("data-bs-toggle", "modal");
            botonEditar.setAttribute("data-bs-target", "#modalEditarCategoria");

            const botonEliminar = document.createElement("button");
            botonEliminar.classList.add("btn", "btn-danger", "btn-sm", "me-2");
            botonEliminar.textContent = "Eliminar";

            botonEliminar.setAttribute("data-id-cat", `${cat.id_categoria}`)
            botonEliminar.setAttribute("data-descripcion", `${cat.descripcion}`)
            botonEliminar.setAttribute("data-bs-toggle", "modal");
            botonEliminar.setAttribute("data-bs-target", "#modalEliminarCategoria");

            acciones.appendChild(botonEditar);
            acciones.appendChild(botonEliminar);

            fila.appendChild(idCat);
            fila.appendChild(desc);
            fila.appendChild(acciones);

            tabla.appendChild(fila);
        
        } catch (error) {
            console.error("Error al cargar la categoria:", error);
            mostrarToast("Error de conexión con el servidor", "danger")
        }
    }
}

const inputId = document.getElementById("input-id");
const btnBusqueda = document.getElementById("btn-busqueda");
btnBusqueda.addEventListener("click", () => {
    const idBuscado = inputId.value.trim();

    // Si el input está vacío → volver al listado completo
    if (idBuscado === "") {
        cargarCategorias();
        return;
    }

    // Si hay un ID → buscar categoría
    buscarCategoria(idBuscado);
});

inputId.addEventListener("input", () => {
    if (inputId.value.trim() === "") {
        cargarCategorias();
    }
});



// ===============================
// ELIMINAR CATEGORÍA
// ===============================
let categoriaSeleccionada = null;

const modalEliminar = document.getElementById("modalEliminarCategoria");
const miModalEliminar = Modal.getOrCreateInstance(modalEliminar);

modalEliminar.addEventListener("show.bs.modal", event => {

    const boton = event.relatedTarget;

    categoriaSeleccionada =
        boton.getAttribute("data-id-cat");

    const descripcion =
        boton.getAttribute("data-descripcion");

    document.getElementById("textoModal").innerText =
        `¿Seguro que deseas eliminar la categoría "${descripcion}"?`;
});
document.getElementById("botonEliminar").addEventListener("click", async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/v1/categorias/${categoriaSeleccionada}`, {
                                method: "DELETE", 
                                headers: {"Authorization": `Bearer ${sessionStorage.getItem("token")}`}
            });

            miModalEliminar.hide(); 

            if (response.ok) {
                mostrarToast("Categoría eliminada con éxito", "success");
                cargarCategorias();
            } else {
                const data = await response.json();
                mostrarToast(data.error || "Error al eliminar categoría", "danger");
            }

        } catch (error) {
            console.error(error);
            mostrarToast("Error al eliminar categoría", "danger");
        }
    });


// ===============================
// EDITAR CATEGORÍA
// ===============================
let idCatEditar = 0;

const modalEditar =
    document.getElementById("modalEditarCategoria");

const miModalEditar =
    Modal.getOrCreateInstance(modalEditar);

modalEditar.addEventListener("show.bs.modal", event => {

    const boton = event.relatedTarget;

    idCatEditar =
        boton.getAttribute("data-id-cat");

    const descripcionActual =
        boton.getAttribute("data-descripcion");

    document.getElementById(
        "inputEditarCategoria"
    ).value = descripcionActual;
});
document.getElementById("botonGuardarCambios").addEventListener("click", async () => {
        const nuevaDescripcion = document.getElementById("inputEditarCategoria").value.trim();

        try {
            const respuesta = await fetch(`http://localhost:3000/api/v1/categorias/${idCatEditar}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${sessionStorage.getItem("token")}`},
                body: JSON.stringify({
                    descripcion: nuevaDescripcion
                })
            });

            if (respuesta.ok) {
                mostrarToast("Categoría actualizada con éxito", "success");
                miModalEditar.hide();
                cargarCategorias();
            } else {
                mostrarToast("Error al actualizar categoría", "danger");
            }

        } catch (error) {
            console.error("Error al actualizar categoría:", error);
            mostrarToast("Error inesperado al actualizar", "danger");
        }
    });



// ===============================
// CREAR NUEVA CATEGORÍA
// ===============================
const modalNueva =
    document.getElementById("modalNuevaCategoria");

const miModalNueva =
    Modal.getOrCreateInstance(modalNueva);

document.getElementById(
    "btnNuevaCategoria"
).addEventListener("click", () => {

    document.getElementById(
        "inputNuevaCategoria"
    ).value = "";

    miModalNueva.show();
});
document.getElementById("botonCrearCategoria").addEventListener("click", async () => {
        const descripcion = document.getElementById("inputNuevaCategoria").value.trim();

        if (descripcion === "") {
            mostrarToast("La descripción no puede estar vacía", "danger");
            return;
        }

        try {
            const respuesta = await fetch("http://localhost:3000/api/v1/categorias", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${sessionStorage.getItem("token")}` },
                body: JSON.stringify({ descripcion: descripcion })
            });

            if (respuesta.ok) {
                mostrarToast("Categoría creada con éxito", "success");
                miModalNueva.hide();
                cargarCategorias(); // refresca la tabla
            } else {
                mostrarToast("Error al crear categoría", "danger");
            }

        } catch (error) {
            console.error("Error al crear categoría:", error);
            mostrarToast("Error inesperado al crear categoría", "danger");
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