import api from '/modules/api.mjs';
const apiClient = new api.ApiClient();

//Change navbar userName
(async function () {
   //Get elements from the DOM
   //let logoutButtons = document.getElementsByClassName('logout');
   //let adminNavbar = document.getElementById('admin-navbar');
   //let adminNavbarDivider = document.getElementById('admin-navbar-divider');

   //Array from nodeList
   //logoutButtons = Array.from(logoutButtons);

   //const isAdmin = await (await apiClient.getUserAdmin()).json();
   //const userData = await (await apiClient.getUserData()).json();
/*
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
*/
/*
   [].forEach.call(logoutButtons, function(b) {
      b.addEventListener('click',onClickLogout)
   });
   */

})();
/*
async function onClickLogout(e) {
   console.log(e.target);
   await apiClient.logOut();
   location.href = '/index.html'   
} 
*/