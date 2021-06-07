import utils from '/modules/utils.mjs';
import api from '/modules/api.mjs';
const apiClient = new api.ApiClient();

const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

let expTime = parseJwt(apiClient.token).exp;

setTimeout(function() {
    location.reload();
}, (expTime-60000));

utils.searchUser();
utils.focusSearchInput();
utils.showAdminNavbar();
utils.showPageElements(false);
utils.showNotifications();
utils.navbarUserName();
utils.logOutButtons();
