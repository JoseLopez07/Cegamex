import api from '/modules/api.mjs';
const apiClient = new api.ApiClient();

//Get elements from the DOM
let nombreNavbar = document.getElementsByClassName('nombre-navbar');
let parents = document.getElementsByClassName('loading');
let chiquis = document.getElementsByClassName('loading-child');
let collapseItems = document.getElementsByClassName('dont-collapse-sm');
let notificaciones = document.getElementById('campana');

//Array from nodeList
parents = Array.from(parents);
chiquis = Array.from(chiquis);
collapseItems = Array.from(collapseItems);

//Change navbar userName
const userData = await (await apiClient.getUserData()).json();
nombreNavbar[0].innerText = userData.firstName + " " + userData.lastName;

//Notificactions alert visibility
if (sessionStorage.getItem('visibilityNotif') !== 'hidden') {
   notificaciones.firstElementChild.nextElementSibling.style.visibility = 'visible';
   notificaciones.addEventListener('click',onClick);
}

//Notifications alert click event
function onClick(e) {
   notificaciones.firstElementChild.nextElementSibling.style.visibility = 'hidden';
   sessionStorage.setItem('visibilityNotif','hidden');
}

//Show page elements
[].forEach.call(parents, function(p) {
   p.classList.remove("loading");
   p.classList.add("shadow")
});
[].forEach.call(chiquis, function(c) {
   c.classList.remove("loading-child");
});
[].forEach.call(collapseItems, function(c) {
    c.classList.add("collapse");
 });
