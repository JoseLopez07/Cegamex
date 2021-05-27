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
    let levelImage = document.getElementById('level-img-profile');
    let levelMessage = document.getElementById('level-message');
    let levelMessageNavbar = document.getElementById('level-message-navbar');
    let progressBarColor = document.getElementById('progress-color');
    let profileImageContainer = document.getElementById('profile-image-container');

    const userData = await (await apiClient.getUserData()).json();
    const achievements = await (await apiClient.getAchievements()).json();
    const gameData = await (await apiClient.getPetData()).json();

    nameProfile.innerText = userData.firstName + ' ' + userData.lastName;
    email.innerText = userData.email;
    twitterAccount.innerText = userData.twitter;
    position.innerText = userData.companyRole;
    profileImage[0].src = userData.picture;

    if (userData.twitter === null) {
        twitterAccount.parentElement.remove();
    }
    if (userData.companyRole === null) {
        position.remove();
        nameProfile.classList.remove('mb-2');
        nameProfile.classList.add('py-3');
        profileImageContainer.classList.remove('mb-2');
    }
    if (userData.picture === null) {
        profileImage[0].src = "imagenes\\profile-default.png";
    }

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

    levelImage.src = `imagenes\\nivel-${gameData.level}.png`;
    levelMessage.innerText = `¡${100 - gameData.experience} puntos más para nivel ${gameData.level + 1}!`;
    levelMessageNavbar.childNodes[2].nodeValue = `¡Felicidades! Has alcanzado el nivel ${gameData.level}`;
    progressBarColor.style.width = `${gameData.experience}%`;

})();
