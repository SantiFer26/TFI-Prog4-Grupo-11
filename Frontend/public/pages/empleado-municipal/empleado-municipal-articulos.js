
async function cargarArticulos() {
    try {
        const response = await fetch("http://localhost:3000/api/v1/articulos");
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

cargarArticulos();
        
async function buscarArticulo(idBuscado) {
    try {
        const response = await fetch(`http://localhost:3000/api/v1/articulos/${idBuscado}`);
                
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
        console.error("Error cargando artículos:", error);
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

