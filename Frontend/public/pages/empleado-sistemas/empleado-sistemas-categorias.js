const Modal = window.bootstrap.Modal;
const Toast = window.bootstrap.Toast;

//-- FUNCIONALIDAD DE CARGAR LAS CATEGORIAS --
async function cargarCategorias() {
    try {
        const respuesta = await fetch("http://localhost:3000/categorias");
        const categorias = await respuesta.json();

        const tbody = document.getElementById("tabla_categorias");
        tbody.innerHTML = ""; // limpiar tabla en el caso de recargar las categorias ante borrados o actualizaciones
        categorias.forEach(cat => {
            const filaActual = document.createElement("tr");

            const idCat = document.createElement("th");
            idCat.textContent = cat.id_categoria;

            const desc = document.createElement("td");
            desc.textContent = cat.descripcion;

            const acciones = document.createElement("td");

            const boton1 = document.createElement("button");
            boton1.classList.add("btn", "btn-warning", "btn-sm", "me-2");
            boton1.textContent = "Editar";
            boton1.setAttribute("data-id", `${cat.id_categoria}`);
            boton1.setAttribute("data-descripcion", `${cat.descripcion}`);

            const boton2 = document.createElement("button");
            boton2.classList.add("btn", "btn-danger", "btn-sm", "me-2");
            boton2.textContent = "Eliminar";
            boton2.setAttribute("data-id", `${cat.id_categoria}`);
            boton2.setAttribute("data-descripcion", `${cat.descripcion}`);
            boton2.setAttribute("data-bs-toggle", "modal");
            boton2.setAttribute("data-bs-target", "#modalCategorias");

            filaActual.appendChild(idCat);
            filaActual.appendChild(desc);
            filaActual.appendChild(acciones);

            acciones.appendChild(boton1);
            acciones.appendChild(boton2);

            tbody.appendChild(filaActual);
        })

    }
    catch(error) {
        console.error("Error al cargar las categorías.", error);
    }

}

cargarCategorias();

// -- FUNCIONALIDAD DE ELIMINAR CATEGORIA --
const modal = document.getElementById("modalCategorias");
const toast = document.getElementById("miToast");
let idCat = 0; 
let confirmado = false; //Para identificar que el usuario apretó "Eliminar" dentro del modal

//Creación de Listeners de ventana modal y boton "Eliminar"
modal.addEventListener("show.bs.modal", event => {
    const boton = event.relatedTarget;
    if (boton.textContent.trim() === "Eliminar") {
        idCat = boton.getAttribute("data-id");
        const textoModal = document.getElementById("textoModal");
        textoModal.textContent = `¿Está seguro que desea eliminar la categoría "${boton.getAttribute("data-descripcion")}" de la lista?`;
    }
})

modal.addEventListener("hidden.bs.modal", async function() {
    if (confirmado === true) {
        confirmado = false;
        await eliminarCategoria(idCat, miToast, toast);
    }
})
const miModal = Modal.getOrCreateInstance(modal); // Se obtiene o se crea el objeto Bootstrap asociado al elemento.
const miToast = Toast.getOrCreateInstance(toast);
const btnEliminar = document.getElementById("botonEliminar");
btnEliminar.addEventListener("click", function() {
    confirmado = true;
    miModal.hide();
})

//Funcion para mostrar el toast (alerta moderna) después de eliminar una categoria
function mostrarToast(toast, miToast, bandera) {
    toast.classList.remove("text-bg-success", "text-bg-danger");
    if (bandera === true) {
        toast.classList.add("text-bg-success");
    }
    else {
        toast.classList.add("text-bg-danger");
    }
    miToast.show();
}

//Función para eliminar una categoria
async function eliminarCategoria(idCat, miToast, toast) {
    const textoToast = document.getElementById("textoToast");
    let bandera = false; //Para identificar si se pudo eliminar la categoria, y personalizar el color del toast
    try {
        const respuesta = await fetch(`http://localhost:3000/categorias`, {method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({id_categoria: `${idCat}`})}); //Investigar diseño de API REST para cambiar patch por delete
        switch (respuesta.status) {
            case 200:
                await cargarCategorias();
                textoToast.textContent = "Categoría eliminada con éxito.";
                bandera = true;
                mostrarToast(toast, miToast, bandera);
                break;

            case 404:
                textoToast.textContent = "Error. La categoría seleccionada ya no existe."
                mostrarToast(toast, miToast, bandera);
                break;
            
            case 500:
                textoToast.textContent = "Error del servidor. No se pudo eliminar la categoría."
                mostrarToast(toast, miToast, bandera);
                break;

            default:
                textoToast.textContent = "Error al eliminar la categoría. Intente nuevamente."
                mostrarToast(toast, miToast, bandera);
                break;
        }
    }

    catch (error) {
        console.error("No se pudo borrar la categoría.", error);
        textoToast.textContent = "Error. Hubo un problema al eliminar la categoría.";
        mostrarToast(toast, miToast, bandera);
    }
}