const Toast = window.bootstrap.Toast;
const toast = document.getElementById("miToast");
const miToast = Toast.getOrCreateInstance(toast);

async function cargarArticulos() {
    if (!sessionStorage.getItem("token")) {
        mostrarToast("Necesitas iniciar sesión para acceder al recurso.", "danger");
    } else {
        try {
            const response = await fetch("http://localhost:3000/api/v1/articulos", 
                            {headers: {"Authorization": `Bearer ${sessionStorage.getItem("token")}`}});

            const articulos = await response.json();

            const tbody = document.querySelector("tbody");
            tbody.innerHTML = ""; // limpiar tabla

            articulos.forEach(art => {
                const fila = document.createElement("tr");

                const id_articulo = document.createElement("th");
                id_articulo.textContent = art.id_articulo;

                const id_categoria = document.createElement("td");
                id_categoria.textContent = art.id_categoria;
            
                const descripcion = document.createElement("td");
                descripcion.textContent = art.descripcion;

                const accion = document.createElement('td');
                const enlace = document.createElement('a');
                enlace.href = `./nueva-incidencia.html?from=articulos&articulo=${art.id_articulo}`;
                enlace.className = 'btn btn-success btn-sm';
                enlace.textContent = 'Crear incidencia';
                accion.appendChild(enlace);

                fila.appendChild(id_articulo);
                fila.appendChild(id_categoria);
                fila.appendChild(descripcion);
                fila.appendChild(accion);

                tbody.appendChild(fila);

            });
        } catch (error) {
            console.error("Error cargando artículos:", error);
        }
    }
}

cargarArticulos();
        
async function buscarArticulo(idBuscado) {
    if (!sessionStorage.getItem("token")) {
        mostrarToast("Necesitas iniciar sesión para acceder al recurso.", "danger");
    }
    else {
        try {
            const response = await fetch(`http://localhost:3000/api/v1/articulos/${idBuscado}`, 
                            {headers: {"Authorization": `Bearer ${sessionStorage.getItem("token")}`}});
                
            const art = await response.json();
        
            const tbody = document.querySelector("tbody");
            tbody.innerHTML = ""; // limpiar tabla

            const fila = document.createElement("tr");

            const id_articulo = document.createElement("th");
            id_articulo.textContent = art.id_articulo;

            const id_categoria = document.createElement("td");
            id_categoria.textContent = art.id_categoria;
            
            const descripcion = document.createElement("td");
            descripcion.textContent = art.descripcion;

            const accion = document.createElement('td');
            const enlace = document.createElement('a');
            enlace.href = `./nueva-incidencia.html?from=articulos&articulo=${art.id_articulo}`;
            enlace.className = 'btn btn-success btn-sm';
            enlace.textContent = 'Crear incidencia';
            accion.appendChild(enlace);

            fila.appendChild(id_articulo);
            fila.appendChild(id_categoria);
            fila.appendChild(descripcion);
            fila.appendChild(accion);

            tbody.appendChild(fila);
        
        } catch (error) {
            console.error("Error al cargar el artículo:", error);
            mostrarToast("Artículo no encontrado", "danger");
        }
    }
}

const inputId = document.getElementById("input-id");
const btnBusqueda = document.getElementById("btn-busqueda");
btnBusqueda.addEventListener("click", () => {
    const idBuscado = inputId.value;
    buscarArticulo(idBuscado);});

inputId.addEventListener("input", () => {
    if (inputId.value.trim() === "") {
        cargarArticulos();
    }
});

// ===============================
// Ordenar por Descripción: A-Z
// ===============================

// ===============================
// Ordenar por Descripción: Z-A
// ===============================


// ===============================
// TOAST
// ===============================
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
    miToast.show();
}

// ===============================
// Cerrar Sesión
// ===============================
const cerrarSesion = document.getElementById("cerrar-sesion");
cerrarSesion.addEventListener("click", () => {
    sessionStorage.removeItem("token");
});