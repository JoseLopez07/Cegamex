import api from '/modules/api.mjs';
const apiClient = new api.ApiClient();
let chKpi1 = document.getElementById("ChartKpi1").getContext("2d");
const countsfechas = await (await apiClient.getCountFechasIssues()).json();
const data = [countsfechas[0].enero,countsfechas[0].febrero,countsfechas[0].marzo];
const chart1 = new Chart(chKpi1, {
    type: "bar",
    data: {
        labels: ["Enero", "Febrero", "Marzo"],
        datasets: [
            {
            label: "Issues Resueltas",
            backgroundColor: "rgba(0,255,0,0.2)",
            borderColor: "rgb(255,0,0)",
            data: data,
            },
            ],
        },
        options: {},
    });
