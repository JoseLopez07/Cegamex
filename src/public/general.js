import api from '/modules/api.mjs';
const apiClient = new api.ApiClient();

//Change navbar userName
(async function () {
   //Get elements from the DOM
   let nameNavbar = document.getElementsByClassName('user-name-navbar');
   let notifications = document.getElementById('campana');
   let logoutButtons = document.getElementsByClassName('logout');
   let adminNavbar = document.getElementById('admin-navbar');
   let adminNavbarDivider = document.getElementById('admin-navbar-divider');

   //Array from nodeList
   logoutButtons = Array.from(logoutButtons);

   const isAdmin = await (await apiClient.getUserAdmin()).json();
   const userData = await (await apiClient.getUserData()).json();
   nameNavbar[0].innerText = userData.firstName + " " + userData.lastName;

   if (isAdmin.adm !== 0) {
      adminNavbar.classList.remove('collapse');
      adminNavbarDivider.classList.remove('collapse');
   }
   
   if (location.href == `${window.location.protocol}//${window.location.host}/admin.html`) {
      if (isAdmin.adm !== 1){
         location.href = '/pagina-inicio.html';
      } else {
         showPageElements();
      }
   }

   //Notificactions alert visibility
   if (sessionStorage.getItem('visibilityNotif') !== 'hidden') {
      notifications.firstElementChild.nextElementSibling.style.visibility = 'visible';
      notifications.addEventListener('click',onClick);
   }

   [].forEach.call(logoutButtons, function(b) {
      b.addEventListener('click',onClickLogout)
   });

   //Notifications alert click event
   function onClick(e) {
      notifications.firstElementChild.nextElementSibling.style.visibility = 'hidden';
      sessionStorage.setItem('visibilityNotif','hidden');
   }

})();

async function onClickLogout(e) {
   console.log(e.target);
   await apiClient.logOut();
   location.href = '/index.html'   
} 

