import api from '/modules/api.mjs';
const apiClient = new api.ApiClient();

//Show page elements
function showPageElements(includeShadow) {
   let loadingParents = document.getElementsByClassName('loading');
   let loadingChildren = document.getElementsByClassName('loading-child');
   let collapseItems = document.getElementsByClassName('dont-collapse-sm');

   //Nodelist to array
   loadingParents = Array.from(loadingParents);
   loadingChildren = Array.from(loadingChildren);
   collapseItems = Array.from(collapseItems);

   //Remove classes
   [].forEach.call(loadingParents, function(p) {
      p.classList.remove("loading");

      if (includeShadow !== false) {
      p.classList.add("shadow")
      }
   });
   [].forEach.call(loadingChildren, function(c) {
      c.classList.remove("loading-child");
   });
   [].forEach.call(collapseItems, function(c) {
      c.classList.add("collapse");
   });
}

//Navbar notifications
function showNotifications() {
   let notifications = document.getElementById('campana');

   //Notificactions alert visibility
   if (sessionStorage.getItem('visibilityNotif') !== 'hidden') {
      notifications.firstElementChild.nextElementSibling.style.visibility = 'visible';
      notifications.addEventListener('click',onClick);
   }

   //Notifications alert click event
   function onClick(e) {
      notifications.firstElementChild.nextElementSibling.style.visibility = 'hidden';
      sessionStorage.setItem('visibilityNotif','hidden');
   }
}

//Set event to logout buttons
function logOutButtons() {
   let logoutButtons = document.getElementsByClassName('logout');
   
   logoutButtons = Array.from(logoutButtons);

   [].forEach.call(logoutButtons, function(b) {
      b.addEventListener('click',onClickLogout)
   });
}

async function onClickLogout(e) {
   console.log(e.target);
   await apiClient.logOut();
   location.href = '/index.html';   
}

//Set user name to dropdown menu
async function navbarUserName() {
   let nameNavbar = document.getElementsByClassName('user-name-navbar');
   const userData = await (await apiClient.getUserData()).json();
   
   nameNavbar[0].innerText = userData.firstName + " " + userData.lastName;
}

//Admin access on navbar
async function showAdminNavbar() {
   let adminNavbar = document.getElementById('admin-navbar');
   let adminNavbarDivider = document.getElementById('admin-navbar-divider');
   const isAdmin = await (await apiClient.getUserAdmin()).json();
   
   if (isAdmin.adm !== 0) {
      adminNavbar.classList.remove('collapse');
      adminNavbarDivider.classList.remove('collapse');
   } 
}

function searchUser() {
   let searchButtons = document.getElementsByClassName('button-search');

   searchButtons = Array.from(searchButtons);

   [].forEach.call(searchButtons, function(b) {
      b.addEventListener('click', (e) => {
         const url = new URL(`${window.location.protocol}//${window.location.host}/perfil.html?userid=${b.previousElementSibling.value}`);
         //const params = new URLSearchParams(url.search);
         location.href = url;
     });
   });  
}

export default { showPageElements , showNotifications ,
               navbarUserName , logOutButtons , showAdminNavbar , searchUser };