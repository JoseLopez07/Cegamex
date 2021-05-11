import api from '/modules/api.mjs';

const boton = document.getElementById('btn-inicio-sesion');

const apiClient = new api.ApiClient();

boton.addEventListener('click', async (event) => {
    event.preventDefault();

    // TODO: validate that entries are not empty
    const correo = document.getElementById('exampleInputEmail') || '';
    const pass = document.getElementById('exampleInputPassword') || '';

    try {
        await apiClient.logIn(correo.value, pass.value);
        location.href = '/pagina-inicio.html';
    } catch (err) {
        console.error(err);
        alert(
            err instanceof api.ApiRequestError && err.status == 403
                ? 'Datos incorrectos'
                : 'Error inesperado'
        );
    }
});
