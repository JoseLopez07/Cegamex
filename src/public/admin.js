import api from '/modules/api.mjs';
import utils from '/modules/utils.mjs';

const apiClient = new api.ApiClient();

let chKpi1 = document.getElementById('ChartKpi1').getContext('2d');
let chKpi2 = document.getElementById('ChartKpi2').getContext('2d');
let firstPlace = document.getElementById("firstPlace");
let secondPlace = document.getElementById("secondPlace");
let thirdPlace = document.getElementById("thirdPlace");
let fotoPlace = document.getElementsByClassName("perfil-amigo");
console.log(fotoPlace);

(async function () {
    const isAdmin = await (await apiClient.getUserAdmin()).json();
    //Redirect or show page content
    if (!isAdmin.adm) {
        location.href = '/pagina-inicio.html';
    } else {
        const countsfechas = await (
            await apiClient.getCountFechasIssues()
        ).json();

        const dataEnero = countsfechas[0].enero;
        const dataFebrero = countsfechas[0].febrero;
        const dataMarzo = countsfechas[0].marzo;
        const data = [dataEnero, dataFebrero, dataMarzo];
        const dataResolve = dataEnero + dataFebrero + dataMarzo;
        const dataNotResolve = countsfechas[0].nulls;
        const data2 = [dataResolve, dataNotResolve];

        const chart1 = new Chart(chKpi1, {
            type: 'bar',
            data: {
                labels: ['Enero', 'Febrero', 'Marzo'],
                datasets: [
                    {
                        label: 'Issues resueltas este mes',
                        //Color de las barras
                        backgroundColor: ['#ffdb6d', '#7db5d6', '#ee3a44'],
                        barPercentage: 0.6,
                        data: data,
                    },
                ],
            },
            options: {
                plugins: {
                    legend: {
                        display: false,
                    },
                },
            },
        });

        const chart2 = new Chart(chKpi2, {
            type: 'doughnut',
            data: {
                labels: ['Resueltas', 'Sin resolver'],
                datasets: [
                    {
                        label: 'Issues Resueltas vs sin resolver',
                        //Color de la rueda ["color1", "color2"]
                        backgroundColor: ['#297fba', '#2c5499'],
                        data: data2,
                    },
                ],
            },
            options: {
                cutout: 90,
                plugins: {
                    legend: {
                        position: 'bottom',
                    },
                },
            },
        });

        const topUsers = await (
            await apiClient.getTopUserData()
        ).json();

        console.log(topUsers);

        firstPlace.innerText = topUsers[0].nombre + " " + topUsers[0].apellido + " - Nivel: " + topUsers[0].nivel;
        secondPlace.innerText = topUsers[1].nombre + " " + topUsers[1].apellido + " - Nivel: " + topUsers[1].nivel;
        thirdPlace.innerText = topUsers[2].nombre + " " + topUsers[2].apellido + " - Nivel: " + topUsers[2].nivel;
        for(var i = 0; i < 3; i++){
            if (topUsers[i].foto === null) {
                fotoPlace[i].src = "imagenes\\profile-default.png";
            }
            else{
                fotoPlace[i].src = topUsers[i].foto;
            }
        }

        utils.searchUser();
        utils.focusSearchInput();
        utils.showAdminNavbar();
        utils.showPageElements();
        utils.showNotifications();
        utils.navbarUserName();
        utils.logOutButtons();
    }
})();
