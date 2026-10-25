const Modal = window.bootstrap.Modal;
const Toast = window.bootstrap.Toast;

const tabla = document.getElementById("tabla_categorias");

// Variables globales
let categoriaSeleccionada = null;
let idCatEditar = 0;

// ===============================
// CARGAR CATEGORÍAS
// ===============================
async function cargarCategorias() {
    try {
        const response = await fetch("http://localhost:3000/api/categorias");
        const categorias = await response.json();

        tabla.innerHTML = "";

        categorias.forEach(cat => {
            const fila = document.createElement("tr");

            fila.innerHTML = `
                <th scope="row">${cat.id_categoria}</th>
                <td>${cat.descripcion}</td>
                <td>
                    <div class="d-flex justify-content-center gap-2">
                        <button class="btn btn-warning btn-sm" 
                                title="Editar"
                                data-id="${cat.id_categoria}"
                                data-descripcion="${cat.descripcion}"
                                data-bs-toggle="modal"
                                data-bs-target="#modalEditarCategoria">
                            Editar
                        </button>

                        <button class="btn btn-danger btn-sm" 
                                title="Eliminar"
                                data-id="${cat.id_categoria}"
                                data-descripcion="${cat.descripcion}"
                                data-bs-toggle="modal"
                                data-bs-target="#modalEliminarCategoria">
                            Eliminar
                        </button>
                    </div>
                </td>
            `;

            tabla.appendChild(fila);
        });

    } catch (error) {
        console.error("Error cargando categorías:", error);
    }
}

cargarCategorias();

// ===============================
// BÚSQUEDA DE CATEGORÍA POR ID
// ===============================
async function buscarCategoria(idBuscado) {
    try {
        const response = await fetch(`http://localhost:3000/api/categorias/${idBuscado}`);
                
        const cat = await response.json();
        
        tabla.innerHTML = ""; // limpiar tabla

        const fila = document.createElement("tr");

        fila.innerHTML = `
                <th scope="row">${cat.id_categoria}</th>
                <td>${cat.descripcion}</td>
                <td>
                    <div class="d-flex justify-content-center gap-2">
                        <button class="btn btn-warning btn-sm" 
                                title="Editar"
                                data-id="${cat.id_categoria}"
                                data-descripcion="${cat.descripcion}"
                                data-bs-toggle="modal"
                                data-bs-target="#modalEditarCategoria">
                            Editar
                        </button>

                        <button class="btn btn-danger btn-sm" 
                                title="Eliminar"
                                data-id="${cat.id_categoria}"
                                data-descripcion="${cat.descripcion}"
                                data-bs-toggle="modal"
                                data-bs-target="#modalEliminarCategoria">
                            Eliminar
                        </button>
                    </div>
                </td>
            `;

        tabla.appendChild(fila);
        
    } catch (error) {
        console.error("Error cargando categorias:", error);
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
const modalEliminar = document.getElementById("modalEliminarCategoria");
const miModalEliminar = Modal.getOrCreateInstance(modalEliminar);
const toast = document.getElementById("miToast");
const miToast = Toast.getOrCreateInstance(toast);

modalEliminar.addEventListener("show.bs.modal", event => {
    const boton = event.relatedTarget;

    categoriaSeleccionada = boton.getAttribute("data-id");
    const descripcion = boton.getAttribute("data-descripcion");

    document.getElementById("textoModal").innerText =
        `¿Seguro que deseas eliminar la categoría "${descripcion}"?`;
});

document.getElementById("botonEliminar").addEventListener("click", async () => {
    try {
        const response = await fetch(`http://localhost:3000/api/categorias/${categoriaSeleccionada}`, {method: "DELETE"});

        miModalEliminar.hide();

        const data = await response.json(); // ← IMPORTANTE

        if (response.ok) {
            mostrarToast("Categoría eliminada con éxito");
            cargarCategorias();
        } else {
            mostrarToast(data.error || "Error al eliminar categoría");
        }

    } catch (error) {
        console.error(error);
        mostrarToast("Error al eliminar categoría");
    }
});

// ===============================
// EDITAR CATEGORÍA
// ===============================
const modalEditar = document.getElementById("modalEditarCategoria");
const miModalEditar = Modal.getOrCreateInstance(modalEditar);

modalEditar.addEventListener("show.bs.modal", event => {
    const boton = event.relatedTarget;

    idCatEditar = boton.getAttribute("data-id");
    const descripcionActual = boton.getAttribute("data-descripcion");

    document.getElementById("inputEditarCategoria").value = descripcionActual;
});

document.getElementById("botonGuardarCambios").addEventListener("click", async () => {
    const nuevaDescripcion = document.getElementById("inputEditarCategoria").value.trim();

    try {
        const respuesta = await fetch(`http://localhost:3000/api/categorias/${idCatEditar}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                descripcion: nuevaDescripcion
            })
        });

        if (respuesta.ok) {
            mostrarToast("Categoría actualizada con éxito");
            miModalEditar.hide();
            cargarCategorias();
        } else {
            mostrarToast("Error al actualizar categoría");
        }

    } catch (error) {
        console.error("Error al actualizar categoría:", error);
        mostrarToast("Error inesperado al actualizar");
    }
});

// ===============================
// NUEVA CATEGORÍA - ABRIR MODAL
// ===============================
const modalNueva = document.getElementById("modalNuevaCategoria");
const miModalNueva = Modal.getOrCreateInstance(modalNueva);

document.getElementById("btnNuevaCategoria").addEventListener("click", () => {
    document.getElementById("inputNuevaCategoria").value = ""; // limpiar input
    miModalNueva.show();
});

// ===============================
// CREAR NUEVA CATEGORÍA
// ===============================
document.getElementById("botonCrearCategoria").addEventListener("click", async () => {
    const descripcion = document.getElementById("inputNuevaCategoria").value.trim();

    if (descripcion === "") {
        mostrarToast("La descripción no puede estar vacía");
        return;
    }

    try {
        const respuesta = await fetch("http://localhost:3000/api/categorias", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ descripcion })
        });

        if (respuesta.ok) {
            mostrarToast("Categoría creada con éxito");
            miModalNueva.hide();
            cargarCategorias(); // refresca la tabla
        } else {
            mostrarToast("Error al crear categoría");
        }

    } catch (error) {
        console.error("Error al crear categoría:", error);
        mostrarToast("Error inesperado al crear categoría");
    }
});


// ===============================
// TOAST
// ===============================
function mostrarToast(texto) {
    document.getElementById("textoToast").innerText = texto;
    miToast.show();
}
