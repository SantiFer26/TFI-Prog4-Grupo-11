function volver() {
    const params = new URLSearchParams(window.location.search);
    const from = params.get("from");

    if (from === "articulos") {
        window.location.href = "./empleado-municipal-articulos.html";
    } else {
        window.location.href = "./empleado-municipal-incidencias.html";
    }
}
async function cargarArticulos() {
    try {
        const response = await fetch("http://localhost:3000/api/articulos");
        const articulos = await response.json();

        const tbody = document.querySelector("tbody");
        tbody.innerHTML = ""; // limpiar tabla

        articulos.forEach(art => {
            const fila = document.createElement("tr");

            fila.innerHTML = `
            <th scope="row">${art.id_articulo}</th>
            <td>${art.id_categoria}</td>
            <td>${art.descripcion}</td>
            <td>
            <a href="./nueva-incidencia.html?from=articulos&articulo=${art.id_articulo}" 
            class="btn btn-success btn-sm">
            Crear incidencia
            </a>
            </td>
            `;

            tbody.appendChild(fila);
        });
    } catch (error) {
        console.error("Error cargando artículos:", error);
    }
}

cargarArticulos();
        
async function buscarArticulo(idBuscado) {
    try {
        const response = await fetch(`http://localhost:3000/api/articulos/${idBuscado}`);
                
        const art = await response.json();
        console.log("Respuesta del servidor:", art);
        const tbody = document.querySelector("tbody");
        tbody.innerHTML = ""; // limpiar tabla

        const fila = document.createElement("tr");

        fila.innerHTML = `
        <th scope="row">${art.id_articulo}</th>
        <td>${art.id_categoria}</td>
        <td>${art.descripcion}</td>
        <td>
        <a href="./nueva-incidencia.html?from=articulos&articulo=${art.id_articulo}" 
        class="btn btn-success btn-sm">
        Crear incidencia
        </a>
        </td>
        `;

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