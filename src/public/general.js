import api from '/modules/api.mjs';
const apiClient = new api.ApiClient();

let nombreNavbar = document.getElementsByClassName('nombre-navbar');
let parents = document.getElementsByClassName('loading');
let chiquis = document.getElementsByClassName('loading-child');
let collapseItems = document.getElementsByClassName('dont-collapse-sm');

parents = Array.from(parents);
chiquis = Array.from(chiquis);
collapseItems = Array.from(collapseItems);

const userData = await (await apiClient.getUserData()).json();
nombreNavbar[0].innerText = userData.firstName + " " + userData.lastName;

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
