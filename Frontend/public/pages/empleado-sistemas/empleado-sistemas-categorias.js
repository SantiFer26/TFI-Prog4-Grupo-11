async function cargarCategorias() {
    try {
        const respuesta = await fetch("http://localhost:3000/categorias");
        const categorias = await respuesta.json();

        const tabla = document.getElementById("tabla_categorias");
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

            const boton2 = document.createElement("button");
            boton2.classList.add("btn", "btn-danger", "btn-sm", "me-2");
            boton2.textContent = "Eliminar";

            filaActual.appendChild(idCat);
            filaActual.appendChild(desc);
            filaActual.appendChild(acciones);

            acciones.appendChild(boton1);
            acciones.appendChild(boton2);

            tabla.appendChild(filaActual);
        })

    }
    catch(error) {
        console.error("Error al cargar las categorías.", error);
    }

}

cargarCategorias();