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
   let inputElements = [searchButtons[0].previousElementSibling, searchButtons[1].previousElementSibling];

   searchButtons[0].addEventListener('click', async (e) => {
      const inputValue = inputElements[0].value;
      let search = await (await apiClient.getUserData(null,inputValue)).json();

      validateSearch(search,inputValue,inputElements)
   });

   searchButtons[1].addEventListener('click', async (e) => {
      const inputValue = inputElements[1].value;
      let search = await (await apiClient.getUserData(null,inputValue)).json();

      validateSearch(search,inputValue, inputElements)
   });

   searchButtons[0].previousElementSibling.addEventListener('keyup', async ({ key }) => {
      if (key === 'Enter') {
         const inputValue = inputElements[0].value;
         let search = await (await apiClient.getUserData(null,inputValue)).json();
   
         validateSearch(search,inputValue, inputElements)
      }
   });

   searchButtons[1].previousElementSibling.addEventListener('keyup', async ({ key }) => {
      if (key === 'Enter') {
         const inputValue = inputElements[1].value;
         let search = await (await apiClient.getUserData(null,inputValue)).json();
   
         validateSearch(search,inputValue, inputElements)
      }
   });
}

function validateSearch(search,inputValue,inputElements) {

   if (Object.keys(search).length === 0) {
      $("#invalidSearch").modal('show');

      $("#invalidSearch").on("hidden.bs.modal", function () {
         inputElements[0].value = "";
         inputElements[1].value = "";
         inputElements[0].focus();
         inputElements[1].focus();
         inputElements[0].select();
         inputElements[1].select();
     });

   }
   else {
      const url = new URL(`${window.location.protocol}//${window.location.host}/perfil.html?userid=${inputValue}`);
      location.href = url;
   }
}

function focusSearchInput() {
   let navbarSearch = document.getElementById('search-navbar');
   let navbarMobileButton = document.getElementById('navbutton');

   navbarSearch.addEventListener('click', focusInput);
   navbarMobileButton.addEventListener('click', focusInput);
}

function focusInput() {
   let searchButtons = document.getElementsByClassName('button-search');
   searchButtons = Array.from(searchButtons);
   let inputElements = [searchButtons[0].previousElementSibling, searchButtons[1].previousElementSibling];

   $(document).ready(function() {
      inputElements[0].focus();
      inputElements[1].focus();
      inputElements[0].select();
      inputElements[1].select();
   });
}

// Logged user data
let loggedUser = apiClient.getUserData();

export default { showPageElements , showNotifications ,
               navbarUserName , logOutButtons , showAdminNavbar , searchUser , loggedUser , focusSearchInput};