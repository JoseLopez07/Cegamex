import api from '/modules/api.mjs';


(async function (){
    const apiClient = new api.ApiClient();

    let nameProfile = document.getElementById('user-name-profile');
    let email = document.getElementById('user-email');
    let profileImage = document.getElementsByClassName('user-profile-image');
    let twitterAccount = document.getElementById('user-twitter-acc');
    let position = document.getElementById('user-position');
    let trophies = document.getElementById('trophies');

    const userData = await (await apiClient.getUserData()).json();
    const achievements = await (await apiClient.getAchievements()).json(); 

    nameProfile.innerText = userData.firstName + " " + userData.lastName;
    email.innerText = userData.email;
    twitterAccount.innerText = userData.twitter;
    position.innerText = userData.companyRole;
    profileImage[0].src = userData.picture;

    console.log(userData);
    console.log(achievements);

})();




