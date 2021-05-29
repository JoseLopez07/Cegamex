import api from '/modules/api.mjs';
import utils from '/modules/utils.mjs';
const apiClient = new api.ApiClient();
let chKpi1 = document.getElementById('ChartKpi1').getContext('2d');
let chKpi2 = document.getElementById('ChartKpi2').getContext('2d');
const countsfechas = await (await apiClient.getCountFechasIssues()).json();
const isAdmin = await (await apiClient.getUserAdmin()).json();

const dataEnero = countsfechas[0].enero;
const dataFebrero = countsfechas[0].febrero;
const dataMarzo = countsfechas[0].marzo;
const data = [dataEnero, dataFebrero, dataMarzo];
const dataResolve = dataEnero + dataFebrero + dataMarzo;
const dataNotResolve = countsfechas[0].NULLS;
const data2 = [dataResolve, dataNotResolve];
const chart1 = new Chart(chKpi1, {
    type: 'bar',
    data: {
        labels: ['Enero', 'Febrero', 'Marzo'],
        datasets: [
            {
                label: 'Issues resueltas este mes',
                //Color de las barras
                backgroundColor: ['#ffdb6d','#7db5d6','#ee3a44'],
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
        plugins: {
            legend: {
                position: 'bottom',
            },
        },
    },
});

if (isAdmin.adm !== 1) {
    location.href = '/pagina-inicio.html';
} else {
    utils.showAdminNavbar();
    utils.showPageElements();
    utils.showNotifications();
    utils.navbarUserName();
    utils.logOutButtons();
}






