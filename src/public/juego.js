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

function timeout() {
  window.localStorage.setItem('token_exp', parseJwt(apiClient.token).exp);
  setTimeout(function () {
      apiClient.refreshTokens();
      timeout();
  }, (parseJwt(apiClient.token).exp * 1000 - Date.now()) * 2/3);
};

timeout();
utils.searchUser();
utils.focusSearchInput();
utils.showAdminNavbar();
utils.showPageElements(false);
utils.showNotifications();
utils.navbarUserName();
utils.logOutButtons();
