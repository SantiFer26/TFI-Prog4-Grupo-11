function volver() {
    const params = new URLSearchParams(window.location.search);
    const from = params.get("from");

    if (from === "articulos") {
        window.location.href = "./empleado-municipal-articulos.html";
    } else {
        window.location.href = "./empleado-municipal-incidencias.html";
    }
}
