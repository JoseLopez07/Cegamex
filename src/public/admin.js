const chKpi1 = document.getElementById("ChartKpi1").getContext("2d");
const data = [30,47,55];
const chart1 = new Chart(chKpi1, {
    type: "bar",
    data: {
        labels: ["Enero", "Febrero", "Marzo"],
        datasets: [
            {
            label: "Wenas",
            backgroundColor: "rgba(0,255,0,0.2)",
            borderColor: "rgb(255,0,0)",
            data: data,
            },
            ],
        },
        options: {},
    });
