import api from '/modules/api.mjs';

const apiClient = new api.ApiClient();

const button = document.getElementById('register-button');

const firstName = document.getElementById('firstName-input');
const lastName = document.getElementById('lastName-input');
const userName = document.getElementById('userName-input');
const email = document.getElementById('email-input');
const password = document.getElementById('password-input');

button.addEventListener('click', async (event) => {
    event.preventDefault();
    register();
});

async function register() {
    try {
        await apiClient.register({
            firstName: firstName.value,
            lastName: lastName.value,
            userName: userName.value,
            email: email.value,
            password: password.value,
        });
        location.href = '/index.html';
    } catch (err) {
        console.error(err);
        alert('Error inesperado');
    }
}
