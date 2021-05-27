import api from '/modules/api.mjs';
const apiClient = new api.ApiClient();

//Change navbar userName
(async function () {

   //Get elements from the DOM
   let nameNavbar = document.getElementsByClassName('user-name-navbar');
   let loadingParents = document.getElementsByClassName('loading');
   let loadingChildren = document.getElementsByClassName('loading-child');
   let collapseItems = document.getElementsByClassName('dont-collapse-sm');
   let notifications = document.getElementById('campana');
   let logoutButtons = document.getElementsByClassName('logout');
   let adminNavbar = document.getElementById('admin-navbar');
   let adminNavbarDivider = document.getElementById('admin-navbar-divider');

   //Array from nodeList
   loadingParents = Array.from(loadingParents);
   loadingChildren = Array.from(loadingChildren);
   collapseItems = Array.from(collapseItems);
   logoutButtons = Array.from(logoutButtons);

   const isAdmin = await (await apiClient.getUserAdmin()).json();
   const userData = await (await apiClient.getUserData()).json();
   nameNavbar[0].innerText = userData.firstName + " " + userData.lastName;

   if (isAdmin.adm !== 0) {
      adminNavbar.classList.remove('collapse');
      adminNavbarDivider.classList.remove('collapse');
   }

   if (location.href === 'http://localhost:3001/admin.html') {
      if (isAdmin.adm !== 1){
         location.href = '/pagina-inicio.html';
      } else {
         showPageElements();
      }
   } else {
      showPageElements();
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

   //Show page elements
   function showPageElements() {
   [].forEach.call(loadingParents, function(p) {
      p.classList.remove("loading");
      p.classList.add("shadow")
   });
   [].forEach.call(loadingChildren, function(c) {
      c.classList.remove("loading-child");
   });
   [].forEach.call(collapseItems, function(c) {
      c.classList.add("collapse");
   });
   }
   console.log(userData);
   console.log(isAdmin);

})();

async function onClickLogout(e) {
   console.log(e.target);
   await apiClient.logOut();
   location.href = '/index.html'   
} 
