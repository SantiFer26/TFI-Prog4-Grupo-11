const formLogin = document.getElementById('formulario-login');

formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(formLogin);

    const datos = Object.fromEntries(formData);

    try {
        const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
        });

        const data = await response.json();

        if (!response.ok) {
            mostrarToast('Nombre de usuario y/o contraseña incorrectos');
            return;
        }
        
        sessionStorage.setItem("token", data.token);

        switch (data.rol) {
            case 1: 
                window.location.href = "../empleado-municipal/empleado-municipal.html";
                break;

            case 2: 
                window.location.href = "../empleado-sistemas/empleado-sistemas.html";
                break; 

            case 3: 
                window.location.href = "../director/director-sistemas.html";
                break; 
        }
    }
    catch (error) {
        console.error("Error del servidor");
        mostrarToast("Error al autenticar. Intente de nuevo más tarde.");
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