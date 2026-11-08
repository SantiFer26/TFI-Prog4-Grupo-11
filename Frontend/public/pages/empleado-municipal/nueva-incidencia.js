const params = new URLSearchParams(window.location.search);
const origen = params.get('from');
const idArticulo = params.get('articulo');
let descripcionArticulo = "";
console.log("JS NUEVA INCIDENCIA CARGADO");
async function buscarDescripcion() {
    try {
        const response = await fetch(`http://localhost:3000/api/v1/articulos/${idArticulo}`,
            {
        headers: {
            "Authorization":
                `Bearer ${sessionStorage.getItem("token")}`
                }
            }
        )

        if (response.ok) {
            const articulo = await response.json();

            descripcionArticulo = articulo.descripcion;
            const inputIdArticulo = document.getElementById('input_id_articulo');
            inputIdArticulo.value = idArticulo;
            const inputDescArticulo = document.getElementById('input_desc_articulo');
            inputDescArticulo.value = descripcionArticulo;
        }
        else {
            throw new Error(`Error del lado del servidor: ${response.status}`);
        }
    }
    catch (error) {
    console.error("Error. No se encontró el artículo.", error);
    }
}
buscarDescripcion();

const formulario = document.getElementById("formulario");
formulario.addEventListener("submit", async(e) => {
    console.log("ENTRE AL SUBMIT");
    e.preventDefault();

    const btnCrearIncidencia = document.getElementById("btn-crear-incidencia");
    btnCrearIncidencia.disabled = true; // para evitar que se cree más de una incidencia por clicks múltiples.

    const formData = new FormData(formulario);
    const datosIncidencia = Object.fromEntries(formData.entries());
    console.log(datosIncidencia);
    try {
    const response = await fetch('http://localhost:3000/api/v1/incidencias', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem("token")}`
        },
        body: JSON.stringify(datosIncidencia)
        });
        if (response.ok) {
            const resultado = await response.json();
            formulario.reset();
            mostrarToast("Incidencia creada con éxito. Volviendo a la pestaña de artículos...", "success");
            setTimeout(() => {
                window.location.href = "./empleado-municipal-articulos.html"
            }, 3000);
        }
        else {
            throw new Error(`Error del lado del servidor: ${response.status}`);
        }
    }
    catch (error) {
        btnCrearIncidencia.disabled = false;
        console.error('Hubo un error al crear la incidencia:', error);
        mostrarToast("Error al crear la incidencia", "danger");
    }
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
