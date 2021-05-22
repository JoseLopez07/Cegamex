import api from '/modules/api.mjs';
const apiClient = new api.ApiClient();
let chKpi1 = document.getElementById("ChartKpi1").getContext("2d");
const marzo = await apiClient.getCountIssuesFromMonth(3);
console.log(marzo);
const data = [12,47,10];
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
