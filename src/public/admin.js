import api from '/modules/api.mjs';
const apiClient = new api.ApiClient();
let chKpi1 = document.getElementById("ChartKpi1").getContext("2d");
let chKpi2 = document.getElementById("ChartKpi2").getContext("2d");
const countsfechas = await (await apiClient.getCountFechasIssues()).json();

console.log(userData);
const dataEnero = countsfechas[0].enero;
const dataFebrero = countsfechas[0].febrero;
const dataMarzo = countsfechas[0].marzo;
const data = [dataEnero,dataFebrero,dataMarzo];
const dataResolve = dataEnero+dataFebrero+dataMarzo;
const dataNotResolve = countsfechas[0].NULLS;
const data2 = [dataResolve, dataNotResolve];
const chart1 = new Chart(chKpi1, {
    type: "bar",
    data: {
        labels: ["Enero", "Febrero", "Marzo"],
        datasets: [
            {
            label: "Issues Resueltas",
            //Color de las barras
            backgroundColor: "rgba(0,255,0,0.2)",
            borderColor: "rgb(255,0,0)",
            data: data,
            },
            ],
        },
        options: {},
    }
);

const chart2 = new Chart(chKpi2, {
    type: "doughnut",
    data: {
        labels: ["Resueltas", "Sin resolver"],
        datasets: [
            {
            label: "Issues Resueltas vs sin resolver",
            //Color de la rueda ["color1", "color2"]
            backgroundColor: ["rgba(0,255,0,0.2)", "red"],
            borderColor: "rgb(255,0,0)",
            data: data2,
            },
            ],
        },
        options: {},
    }
);
