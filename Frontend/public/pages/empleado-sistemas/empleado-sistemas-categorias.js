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
                                data-bs-target="#modalCategorias">
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
// ELIMINAR CATEGORÍA
// ===============================
const modalEliminar = document.getElementById("modalCategorias");
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
        const response = await fetch("http://localhost:3000/api/categorias", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_categoria: categoriaSeleccionada })
        });

        miModalEliminar.hide();

        if (response.ok) {
            mostrarToast("Categoría eliminada con éxito");
            cargarCategorias();
        } else {
            mostrarToast("Error al eliminar categoría");
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
        const respuesta = await fetch("http://localhost:3000/api/categorias", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id_categoria: idCatEditar,
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
// TOAST
// ===============================
function mostrarToast(texto) {
    document.getElementById("textoToast").innerText = texto;
    miToast.show();
}
