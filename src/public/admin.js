import api from '/modules/api.mjs';
const apiClient = new api.ApiClient();
const chKpi1 = document.getElementById("ChartKpi1").getContext("2d");
const marzo = await (await apiClient.getCountIssuesFromMonth(03)).json();
const data = [marzo,47,10];
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
