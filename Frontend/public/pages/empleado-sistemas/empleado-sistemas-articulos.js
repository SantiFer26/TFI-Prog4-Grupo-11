const Modal = window.bootstrap.Modal;

// ===============================
// CARGAR ARTÍCULOS
// ===============================
async function cargarArticulos() {
    if (!sessionStorage.getItem("token")) {
        mostrarToast("Necesitas iniciar sesión para acceder al recurso.", "danger");
    }
    else {
        try {
            const response = await fetch("http://localhost:3000/api/v1/articulos", 
                            {headers: {"Authorization": `Bearer ${sessionStorage.getItem("token")}`}});

            const articulos = await response.json();

            const tabla = document.getElementById("tabla_articulos");
            tabla.innerHTML = ""; // limpiar tabla

            articulos.forEach(art => {
                const fila = document.createElement("tr");

                const id_articulo = document.createElement("th");
                id_articulo.textContent = art.id_articulo;

                const id_categoria = document.createElement("td");
                id_categoria.textContent = art.id_categoria;
            
                const descripcion = document.createElement("td");
                descripcion.textContent = art.descripcion;

                const acciones = document.createElement("td");
                const botonEditar = document.createElement("button");
                botonEditar.classList.add("btn", "btn-warning", "btn-sm", "me-2");
                botonEditar.textContent = "Editar";
                botonEditar.setAttribute("data-id-art", `${art.id_articulo}`)
                botonEditar.setAttribute("data-id-cat", `${art.id_categoria}`)
                botonEditar.setAttribute("data-descripcion", `${art.descripcion}`)
                botonEditar.setAttribute("data-bs-toggle", "modal");
                botonEditar.setAttribute("data-bs-target", "#modalEditarArticulo");

                const botonEliminar = document.createElement("button");
                botonEliminar.classList.add("btn", "btn-danger", "btn-sm", "me-2");
                botonEliminar.textContent = "Eliminar";
                botonEliminar.setAttribute("data-id-art", `${art.id_articulo}`)
                botonEliminar.setAttribute("data-id-cat", `${art.id_categoria}`)
                botonEliminar.setAttribute("data-descripcion", `${art.descripcion}`)
                botonEliminar.setAttribute("data-bs-toggle", "modal");
                botonEliminar.setAttribute("data-bs-target", "#modalEliminarArticulo");

                acciones.appendChild(botonEditar);
                acciones.appendChild(botonEliminar);

                fila.appendChild(id_articulo);
                fila.appendChild(id_categoria);
                fila.appendChild(descripcion);
                fila.appendChild(acciones);

                tabla.appendChild(fila);
            });
        } 
        catch (error) {
            console.error("Error al cargar los artículos:", error);
        }
    }
}

cargarArticulos();


// ===============================
// BÚSQUEDA DE ARTÍCULO POR ID
// ===============================
async function buscarArticulo(idBuscado) {
    if (!sessionStorage.getItem("token")) {
        mostrarToast("Necesitas iniciar sesión para acceder al recurso.", "danger");
    }
    else {
        try {
            const response = await fetch(`http://localhost:3000/api/v1/articulos/${idBuscado}`, 
                            {headers: {"Authorization": `Bearer ${sessionStorage.getItem("token")}`}});
                
            const art = await response.json();
        
            const tabla = document.getElementById("tabla_articulos");
            tabla.innerHTML = ""; // limpiar tabla

            const fila = document.createElement("tr");

            const id_articulo = document.createElement("th");
            id_articulo.textContent = art.id_articulo;

            const id_categoria = document.createElement("td");
            id_categoria.textContent = art.id_categoria;
            
            const descripcion = document.createElement("td");
            descripcion.textContent = art.descripcion;

            const acciones = document.createElement("td");
            const botonEditar = document.createElement("button");
            botonEditar.classList.add("btn", "btn-warning", "btn-sm", "me-2");
            botonEditar.textContent = "Editar";

            const botonEliminar = document.createElement("button");
            botonEliminar.classList.add("btn", "btn-danger", "btn-sm", "me-2");
            botonEliminar.textContent = "Eliminar";

            acciones.appendChild(botonEditar);
            acciones.appendChild(botonEliminar);

            fila.appendChild(id_articulo);
            fila.appendChild(id_categoria);
            fila.appendChild(descripcion);
            fila.appendChild(acciones);

            tabla.appendChild(fila);

        } catch (error) {
            console.error("Error al cargar el artículo:", error);
            mostrarToast("Artículo no encontrado", "danger");
        }
    }
}

const inputId = document.getElementById("input-id");
const btnBusqueda = document.getElementById("btn-busqueda");
btnBusqueda.addEventListener("click", () => {
    const idBuscado = inputId.value.trim();

    // Si el input está vacío → volver al listado completo
    if (idBuscado === "") {
        cargarArticulos();
        return;
    }

    // Si hay un ID → buscar artículo
    buscarArticulo(idBuscado);
});

inputId.addEventListener("input", () => {
    if (inputId.value.trim() === "") {
        cargarArticulos();
    }
});


// ===============================
// EDITAR ARTÍCULO
// ===============================
if (!sessionStorage.getItem("token")) {
    mostrarToast("Necesitas iniciar sesión para acceder al recurso.", "danger");
}
else {
    const modalEditar = document.getElementById("modalEditarArticulo");
    const miModalEditar = Modal.getOrCreateInstance(modalEditar);

    let idArtEditar = 0;

    modalEditar.addEventListener("show.bs.modal", event => {
        const boton = event.relatedTarget;

        idArtEditar = boton.getAttribute("data-id-art");
        const descripcionActual = boton.getAttribute("data-descripcion");

        document.getElementById("inputEditarArticulo").value = descripcionActual;
    });

    document.getElementById("botonGuardarCambios").addEventListener("click", async () => {
        const nuevaDescripcion = document.getElementById("inputEditarArticulo").value.trim();

        try {
            const respuesta = await fetch(`http://localhost:3000/api/v1/articulos/${idArtEditar}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${sessionStorage.getItem("token")}`},
                body: JSON.stringify({
                    descripcion: nuevaDescripcion
                })
            });

            if (respuesta.ok) {
                mostrarToast("Artículo actualizado con éxito", "success");
                miModalEditar.hide();
                cargarArticulos();
            } else {
                mostrarToast("Error al actualizar artículo", "danger");
            }

        } catch (error) {
            console.error("Error al actualizar artículo:", error);
            mostrarToast("Error inesperado al actualizar", "danger");
        }
    });
}

// ===============================
// CREAR NUEVO ARTÍCULO
// ===============================
if (!sessionStorage.getItem("token")) {
    mostrarToast("Necesitas iniciar sesión para acceder al recurso.", "danger");
}
else {
    const modalNuevo = document.getElementById("modalNuevoArticulo");
    const miModalNuevo = Modal.getOrCreateInstance(modalNuevo);

    document.getElementById("btnNuevoArticulo").addEventListener("click", async () => {
        document.getElementById("inputDescNuevoArticulo").value = ""; // limpiar input 

        const response = await fetch('http://localhost:3000/api/v1/categorias', 
                        {headers: {"Authorization": `Bearer ${sessionStorage.getItem("token")}`}});

        const categorias = await response.json();

        const defaultOption = document.getElementById('defaultOption');
        document.getElementById("selectCategorias").replaceChildren(defaultOption); //limpiar las categorías cargadas anteriormente

        categorias.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id_categoria;
            option.textContent = `${cat.id_categoria} - ${cat.descripcion}`;
            selectCategorias.appendChild(option);
        });

        miModalNuevo.show();
    });

    document.getElementById("botonCrearArticulo").addEventListener("click", async () => {
        const descripcion = document.getElementById("inputDescNuevoArticulo").value.trim();
        const idCat = document.getElementById("selectCategorias").value;

        if (descripcion === "" || idCat === "") {
            mostrarToast("Ningún campo debe estar vacío", "danger");
            return;
        }

        try {
            const respuesta = await fetch("http://localhost:3000/api/v1/articulos", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${sessionStorage.getItem("token")}`},
                body: JSON.stringify({ descripcion: descripcion, id_categoria: idCat })
            });

            if (respuesta.ok) {
                mostrarToast("Artículo creado con éxito", "success");
                miModalNuevo.hide();
                cargarArticulos(); // refresca la tabla
            } else {
                mostrarToast("Error al crear artículo", "danger");
            }

        } catch (error) {
            console.error("Error al crear artículo:", error);
            mostrarToast("Error inesperado al crear artículo", "danger");
        }
    });
}

// ===============================
// ELIMINAR ARTÍCULO
// ===============================
if (!sessionStorage.getItem("token")) {
    mostrarToast("Necesitas iniciar sesión para acceder al recurso.", "danger");
}
else {
    const modalEliminar = document.getElementById("modalEliminarArticulo");
    const miModalEliminar = Modal.getOrCreateInstance(modalEliminar);

    let idArtEliminar = 0;

    modalEliminar.addEventListener("show.bs.modal", event => {
        const boton = event.relatedTarget;

        idArtEliminar = boton.getAttribute("data-id-art");
        const descripcion = boton.getAttribute("data-descripcion");

        document.getElementById("textoModal").innerText =
            `¿Seguro que deseas eliminar el artículo "${descripcion}"?`;
    });

    document.getElementById("botonEliminar").addEventListener("click", async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/v1/articulos/${idArtEliminar}`, {
                method: "DELETE", 
                headers: {"Authorization": `Bearer ${sessionStorage.getItem("token")}`}
            });

            miModalEliminar.hide();

            if (response.ok) {
                mostrarToast("Artículo eliminado con éxito", "success");
                cargarArticulos();
            } 
            else {
                const data = await response.json();
                mostrarToast(data.error || "Error al eliminar artículo", "danger");
            }

        } catch (error) {
            console.error(error);
            mostrarToast("Error al eliminar artículo", "danger");
        }
    });
}

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