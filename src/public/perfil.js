import api from '/modules/api.mjs';

(async function () {
    const apiClient = new api.ApiClient();

    let nameProfile = document.getElementById('user-name-profile');
    let email = document.getElementById('user-email');
    let profileImage = document.getElementsByClassName('user-profile-image');
    let twitterAccount = document.getElementById('user-twitter-acc');
    let position = document.getElementById('user-position');
    let trophies = document.getElementById('trophies');
    let trophiesSummary = document.getElementById('trophies-summary');

    const userData = await (await apiClient.getUserData()).json();
    const achievements = await (await apiClient.getAchievements()).json();

    nameProfile.innerText = userData.firstName + ' ' + userData.lastName;
    email.innerText = userData.email;
    twitterAccount.innerText = userData.twitter;
    position.innerText = userData.companyRole;
    profileImage[0].src = userData.picture;

    [].forEach.call(achievements,function(a){
        let newAchievementContainer = document.createElement('div');
        let newAchievementContainerSummary = document.createElement('div');
        let newAchievementImage = document.createElement('img');
        let newAchievementImageSummary = document.createElement('img');
        let newAchievementName = document.createElement('div');

        newAchievementContainer.classList.add('text-center','col-auto', 'mx-auto');
        newAchievementContainerSummary.classList.add('margin-trophy');
        newAchievementImage.classList.add('trofeo');
        newAchievementImage.src = 'imagenes\\trofeo.png';
        newAchievementImageSummary.classList.add('trofeo');
        newAchievementImageSummary.src = 'imagenes\\trofeo.png';
        newAchievementName.classList.add('texto-normal-pequeno', 'mt-1');
        newAchievementName.innerText = a.name;

        newAchievementContainer.appendChild(newAchievementImage);
        newAchievementContainer.appendChild(newAchievementName);
        trophies.appendChild(newAchievementContainer);

        newAchievementContainerSummary.appendChild(newAchievementImageSummary);
        trophiesSummary.appendChild(newAchievementContainerSummary);
    });    

    console.log(userData);
    console.log(achievements);
    console.log(gameData)

})();
