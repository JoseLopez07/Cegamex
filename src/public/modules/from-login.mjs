import api from '/modules/api.mjs';

const apiClient = new api.ApiClient();

(async function () {
    // redirect when logged in
    try {
        await apiClient.checkLoggedIn();
        location.href = '/pagina-inicio.html';
    } catch (err) {
        console.error(err);
    }
})();
