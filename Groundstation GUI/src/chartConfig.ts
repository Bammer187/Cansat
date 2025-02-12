import type { ChartData, ChartOptions } from "chart.js";

function getRandomInt() {
  return Math.floor(Math.random() * (50 - 5 + 1)) + 5;
}

export const randomData = (): ChartData<"line"> => ({
  labels: ["January", "February", "March", "April", "May", "June", "July"],
  datasets: [
    {
      label: "Testing Data",
      backgroundColor: "#f87979",
      borderColor: "#f87979",
      pointBackgroundColor: "#f87979",
      data: [
        getRandomInt(),
        getRandomInt(),
        getRandomInt(),
        getRandomInt(),
        getRandomInt(),
        getRandomInt(),
        getRandomInt(),
      ],
    },
  ],
});

export const options: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,
};
