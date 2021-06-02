import api from '/modules/api.mjs';
import utils from '/modules/utils.mjs';

(async function () {
    const apiClient = new api.ApiClient();

    let params = new URLSearchParams(document.location.search.substring(1));
    let userId = params.get("userid");
    console.log(userId);

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
    let userData;
    let addFriendButton = document.getElementById('btnFriend');
    let onlyUserContent = document.getElementsByClassName('only-user');

    // Get user information
    if (userId != null) {
        console.log(userId);
        userData = await (await apiClient.getUserData(null,userId)).json();
        console.log(userData);
    } else {
        userData = await (await apiClient.getUserData()).json();
        onlyUserContent = Array.from(onlyUserContent);

        [].forEach.call(onlyUserContent, function(elem) {
            elem.style.display = 'initial';
        }); 
    }
    
    const achievements = await (await apiClient.getAchievements()).json();
    const gameData = await (await apiClient.getPetData()).json();
    const userFriends = await (await apiClient.getFriends(userData.userId)).json();

    // Images
    profileImage[0].src = userData.picture;
    levelImage.src = `imagenes\\nivel-${gameData.level}.png`;

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

    // Text
    nameProfile.innerText = userData.firstName + ' ' + userData.lastName;
    email.innerText = userData.email;
    twitterAccount.innerText = userData.twitter;
    position.innerText = userData.companyRole;
    levelMessage.innerText = `¡${100 - gameData.experience} puntos más para nivel ${gameData.level + 1}!`;
    levelMessageNavbar.childNodes[2].nodeValue = `¡Felicidades! Has alcanzado el nivel ${gameData.level}`;
    progressBarColor.style.width = `${gameData.experience}%`;

    // Possible null values
    if (userData.twitter === null) {
        twitterAccount.parentElement.remove();
    }
    if (userData.companyRole === null) {
        position.remove();
        nameProfile.classList.remove('mb-2');
        nameProfile.classList.add('py-3');
        trophiesSummary.classList.add('mt-3');
        nameProfile.parentElement.classList.add('mt-md-3');
    }
    if (userData.picture === null) {
        profileImage[0].src = "imagenes\\profile-default.png";
    }

    // Friends
    (function addFriendsUl () {
        let friendsContainer = document.getElementById('friends-list');

        [].forEach.call(userFriends,function(friend){
            let friendContainerLi = document.createElement('li');
            let friendPhoto = document.createElement('img');
            let friendName = document.createElement('span');
            let friendLink = new URL(`${window.location.protocol}//${window.location.host}/perfil.html?userid=${friend.userName}`);
            let friendATag = document.createElement('a');

            // Friend elements (photo, name and li container)
            friendPhoto.classList.add('perfil-amigo');
            friend.picture === null ? friendPhoto.src = "imagenes\\profile-default.png" : friendPhoto.src = friend.picture;
            friendName.classList.add('mx-2', 'texto-normal');
            friendName.innerText = friend.firstName + ' ' + friend.lastName;
            friendContainerLi.classList.add('my-2');
            friendContainerLi.classList.add('not-list-style');
            friendATag.href = friendLink;

            friendATag.appendChild(friendPhoto);
            friendATag.appendChild(friendName);
            friendContainerLi.appendChild(friendATag);

            friendsContainer.appendChild(friendContainerLi);
        });

    })();

    // Show admin access, notifications alert, user name, etc
    utils.searchUser();
    utils.showAdminNavbar();
    utils.showNotifications();
    utils.navbarUserName();
    utils.logOutButtons();

    // Add friend button
    if (userId != null) {
        let isUserFriend = await (await apiClient.isUserFriend(userData.userId)).json();
        // Check if they are friends
        if (isUserFriend.friends) {
            // Friends
            changeFriendButton();
            addFriendButton.style.visibility = 'visible';
            setRemoveFriendEvent();
        } else {
            // Not friends
            initialFriendButton();
            addFriendButton.style.visibility = 'visible';
            setAddFriendEvent();
        }
    }
    // 'Agregar amigo' button style
    function initialFriendButton() {
        if (addFriendButton.firstElementChild != null) {addFriendButton.firstElementChild.remove();}
        addFriendButton.innerHTML = 'Agregar amigo';
    }
    // 'Amigos' button style
    function changeFriendButton () {
        let friendsCheckmark = document.createElement('i');
        
        friendsCheckmark.classList.add('fa', 'fa-check');
        addFriendButton.innerHTML = 'Amigo' + '&nbsp';
        addFriendButton.appendChild(friendsCheckmark);      
    }
    // Change event and style
    function setRemoveFriendEvent () {
        addFriendButton.addEventListener('click', async (e) => {
            await apiClient.removeFriend(userData.userId);  
            initialFriendButton();
            setAddFriendEvent(); 
        });  
    }

    function setAddFriendEvent () {
        addFriendButton.addEventListener('click', async (e) => {
            await apiClient.addFriend(userData.userId);  
            changeFriendButton();
            setRemoveFriendEvent(); 
        });
    }
    
    // Show page content
    utils.showPageElements();

})();
