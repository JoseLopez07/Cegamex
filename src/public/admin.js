import api from '/modules/api.mjs';

const apiClient = new api.ApiClient();
const chKpi1 = documente.getElementById("ChartKpi1").getContext("2d");

/*Prueba de que funcionen los chars*/
const data = [2,5,6]
const chart1 = new Chart(chKpi1, {
  type = "bar"
  data {
    labels: data,
    datasets: [
      {
      label: ["Enero", "Febrero", "Marzo"],
      backgroundColor: "rgba(0,255,0,0,2)",
      borderColor: "rgb(255,0,0)",
      data: data,
      },
    ],
  },
)
