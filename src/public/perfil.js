import api from '/modules/api.mjs';
const apiClient = new api.ApiClient();

let nameProfile = document.getElementById('user-name-profile');
let email = document.getElementById('user-email');
let profileImage = document.getElementsByClassName('user-profile-image');
let twitterAccount = document.getElementById('user-twitter-acc');
let position = document.getElementById('user-position');

const userData = await (await apiClient.getUserData()).json();
nameProfile.innerText = userData.firstName + " " + userData.lastName;

