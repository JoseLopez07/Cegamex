import api from '/modules/api.mjs';

const button = document.getElementById('login-button');

const apiClient = new api.ApiClient();

const email = document.getElementById('email-input');
const pass = document.getElementById('password-input');
const form = [email, pass];
const rememberMe = document.getElementById('remember-check');

// listen for button press or enter key on inputs to log in
button.addEventListener('click', async (event) => {
    event.preventDefault();
    inputColor(false);
    logIn();
});
form.forEach((input) => {
    input.addEventListener('keyup', async ({ key }) => {
        inputColor(false);
        if (key === 'Enter') {
            logIn();
        }
    });
});

async function logIn() {
    // don't continue on empty fields
    if (!validate()) {
        return;
    }

    try {
        await apiClient.logIn(email.value, pass.value, rememberMe.checked);
        location.href = '/pagina-inicio.html';
    } catch (err) {
        console.error(err);
        if (err instanceof api.ApiRequestError && err.status == 403) {
            inputColor(true)
        } else {
            alert ('Error inesperado')
        } 
    }
}

function validate() {
    return form.every((input) => !!input.value);
}

function inputColor (invalido){
    if (invalido === true) {
        email.classList.add('input-invalido');
        pass.classList.add('input-invalido');
    }
    else {
        email.classList.remove('input-invalido');
        pass.classList.remove('input-invalido');        
    }
}