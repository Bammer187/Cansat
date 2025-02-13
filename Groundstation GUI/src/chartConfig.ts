import type { ChartData, ChartOptions } from "chart.js";
import { ref } from "vue";

const dataSize = 10;
const readings = ref<number[]>(new Array(dataSize).fill(0));
const labels = ref<string[]>(new Array(dataSize).fill("0"));

export const chartData = ref<ChartData<'line'>>({
  labels: labels.value,
  datasets: [
    {
      label: "Testdata",
      data: readings.value,
      backgroundColor: "#f87979",
      borderColor: "#f87979",
      borderWidth: 1.2,
      pointBorderColor: "#f87979",
      pointRadius: 0.2,
    },
  ],
});

export const chartOptions = ref<ChartOptions<'line'>>({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      title: {
        display: true,
        text: "Test",
      },
      grid: { display: true },
      min: 0,
      max: 1040,
    },
    x: {
      title: {
        display: true,
        text: "Time (s)",
      },
      grid: { display: true },
      min: 0,
    },
  },
});

let currentTime = 0.0;

export const updateSensorData = () => {
  currentTime++;
  const label = `${currentTime}`
  const newReading = Math.floor(Math.random() * 1024);

  readings.value = [...readings.value, newReading];
  labels.value = [...labels.value, label];

  if (readings.value.length > dataSize) {
    readings.value.shift();
    labels.value.shift();
  }

  chartData.value = {
    labels: labels.value,
    datasets: [
      {
        label: "Testdata",
        data: readings.value,
        backgroundColor: "#f87979",
        borderColor: "#f87979",
        borderWidth: 1.2,
        pointBorderColor: "#f87979",
        pointRadius: 0.2,
      },
    ],
  };
}

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
