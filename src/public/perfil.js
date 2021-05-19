import api from '/modules/api.mjs';
const apiClient = new api.ApiClient();

let nombrePerfil = document.getElementById('nombre-perfil');
let nombreNavbar = document.getElementById('nombre-navbar');
let emailText = document.getElementById('email-text')

const userData = await (await apiClient.getUserData()).json();
nombrePerfil.innerText = userData.firstName + " " + userData.lastName;
nombreNavbar.innerText = userData.firstName + " " + userData.lastName;
emailText.innerText = userData.email;

console.log(userData);