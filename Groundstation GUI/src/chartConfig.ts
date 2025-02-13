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

export const accelerationData: ChartData<'line'> = {
  labels: ['0s', '1s', '2s', '3s', '4s', '5s', '6s'],
  datasets: [
    {
      label: 'X-Beschleunigung',
      data: [1.2, 2.3, 0.8, 1.1, 2.5, 1.8, 1.2],
      borderColor: 'red',
      backgroundColor: 'red',
      yAxisID: 'y',
    },
    {
      label: 'Y-Beschleunigung',
      data: [0.5, 1.7, 2.1, 1.9, 1.3, 2.4, 1.9],
      borderColor: 'blue',
      backgroundColor: 'blue',
      yAxisID: 'y1',
    },
    {
      label: 'Z-Beschleunigung',
      data: [0.2, 1.1, 1.5, 1.2, 1.8, 1.4, 1.6],
      borderColor: 'green',
      backgroundColor: 'green',
      yAxisID: 'y2',
    },
  ],
};

export const accelerationOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      title: {
        display: true,
        text: 'Zeit (s)',
      },
    },
    y: {
      type: 'linear',
      display: true,
      position: 'right',
      title: {
        display: true,
        text: 'X',
      },
      grid: {
        drawOnChartArea: false,
      },
    },
    y1: {
      type: 'linear',
      display: true,
      position: 'right',
      title: {
        display: true,
        text: 'Y',
      },
      grid: {
        drawOnChartArea: false,
      },
    },
    y2: {
      type: 'linear',
      display: true,
      position: 'right',
      title: {
        display: true,
        text: 'Z',
      },
      grid: {
        drawOnChartArea: false,
      },
    },
  },
};
