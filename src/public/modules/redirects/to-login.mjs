import api from '/modules/api.mjs';

const apiClient = new api.ApiClient();

(async function () {
    // redirect when logged in
    try {
        await apiClient.checkLoggedIn();
    } catch (err) {
        console.error(err);
        if (
            err instanceof api.ApiRequestError &&
            (err.status == 401 || err.status == 400)
        ) {
            location.href = '/';
        }
    }
})();
