import type { ChartData, ChartOptions } from "chart.js";
import { ref } from "vue";

const dataSize = 10;
const labels = ref<string[]>(new Array(dataSize).fill("0"));

export const charts = ref([
  {
    title: "Temperature",
    key: "Temperature",
    color: "red",
    yLabel: "°C",
  },
  {
    title: "Humidity",
    key: "Humidity",
    color: "blue",
    yLabel: "%",
  },
  {
    title: "Air pressure",
    key: "Air pressure",
    color: "green",
    yLabel: "hPa",
  },
  {
    title: "Particle concentration",
    key: "Particle concentration",
    color: "orange",
    yLabel: "µg/m³",
  },
]);

export const chartDataMap = ref<Record<string, ChartData<"line">>>(
  Object.fromEntries(
    charts.value.map(({ key, color }) => [
      key,
      {
        labels: labels.value,
        datasets: [
          {
            label: key,
            data: new Array(dataSize).fill(0),
            backgroundColor: color,
            borderColor: color,
            borderWidth: 1.2,
            pointBorderColor: color,
            pointRadius: 0.2,
          },
        ],
      },
    ])
  )
);

export const chartOptionsMap = ref<Record<string, ChartOptions<"line">>>(
  Object.fromEntries(
    charts.value.map(({ key, yLabel }) => [
      key,
      {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            title: {
              display: true,
              text: yLabel || "",
            },
            grid: { display: true },
          },
          x: {
            title: {
              display: true,
              text: "Time (s)",
            },
            grid: { display: true },
          },
        },
      },
    ])
  )
);


let currentTime = 0;

export const updateSensorData = () => {
  currentTime++;
  const label = `${currentTime.toFixed(1)}`;

  labels.value = [...labels.value, label];
  if (labels.value.length > dataSize) {
    labels.value.shift();
  }

  charts.value.forEach(({ key }) => {
    const newReading = Math.floor(Math.random() * 1024);

    // Update the `data` array
    const dataset = chartDataMap.value[key].datasets[0];
    dataset.data = [...dataset.data, newReading];
    if (dataset.data.length > dataSize) {
      dataset.data.shift();
    }

    // Reasing chartDataMap so that Vue recognizes the update
    chartDataMap.value[key] = {
      ...chartDataMap.value[key],
      labels: [...labels.value],
      datasets: [{ ...dataset }],
    };
  });
};

export const accelerationData: ChartData<"line"> = {
  labels: ["0s", "1s", "2s", "3s", "4s", "5s", "6s"],
  datasets: [
    {
      label: "X-Beschleunigung",
      data: [1.2, 2.3, 0.8, 1.1, 2.5, 1.8, 1.2],
      borderColor: "red",
      backgroundColor: "red",
      yAxisID: "y",
    },
    {
      label: "Y-Beschleunigung",
      data: [0.5, 1.7, 2.1, 1.9, 1.3, 2.4, 1.9],
      borderColor: "blue",
      backgroundColor: "blue",
      yAxisID: "y1",
    },
    {
      label: "Z-Beschleunigung",
      data: [0.2, 1.1, 1.5, 1.2, 1.8, 1.4, 1.6],
      borderColor: "green",
      backgroundColor: "green",
      yAxisID: "y2",
    },
  ],
};

export const accelerationOptions: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      title: {
        display: true,
        text: "Zeit (s)",
      },
    },
    y: {
      type: "linear",
      display: true,
      position: "right",
      title: {
        display: true,
        text: "X",
      },
      grid: {
        drawOnChartArea: false,
      },
    },
    y1: {
      type: "linear",
      display: true,
      position: "right",
      title: {
        display: true,
        text: "Y",
      },
      grid: {
        drawOnChartArea: false,
      },
    },
    y2: {
      type: "linear",
      display: true,
      position: "right",
      title: {
        display: true,
        text: "Z",
      },
      grid: {
        drawOnChartArea: false,
      },
    },
  },
};
