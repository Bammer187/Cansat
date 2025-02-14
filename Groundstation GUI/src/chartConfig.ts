import type { ChartData, ChartDataset, ChartOptions } from "chart.js";
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
  {
    title: "Acceleration",
    key: "acceleration",
    color: "black",
    yLabel: "m/s²",
  },
]);

const accelerationOptions: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      title: {
        display: true,
        text: "Time (s)",
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

export const chartDataMap = ref<Record<string, ChartData<"line">>>({
  ...Object.fromEntries(
    charts.value
      .filter(({ key }) => key !== "acceleration")
      .map(({ key, color }) => [
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
  ),
  acceleration: {
    labels: labels.value,
    datasets: [
      {
        label: "X-Accleration",
        data: new Array(dataSize).fill(0),
        borderColor: "red",
        backgroundColor: "red",
        yAxisID: "y",
      },
      {
        label: "Y-Accleration",
        data: new Array(dataSize).fill(0),
        borderColor: "blue",
        backgroundColor: "blue",
        yAxisID: "y1",
      },
      {
        label: "Z-Accleration",
        data: new Array(dataSize).fill(0),
        borderColor: "green",
        backgroundColor: "green",
        yAxisID: "y2",
      },
    ],
  },
});

export const chartOptionsMap = ref<Record<string, ChartOptions<"line">>>({
  ...Object.fromEntries(
    charts.value
      .filter(({ key }) => key !== "acceleration")
      .map(({ key, yLabel }) => [
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
  ),
  acceleration: accelerationOptions,
});

let currentTime = 0;

export const updateSensorData = (update: boolean) => {
  currentTime++;
  const label: string = `${currentTime.toFixed(1)}`;

  labels.value = [...labels.value, label];
  if (labels.value.length > dataSize) {
    labels.value.shift();
  }

  charts.value.forEach(({ key }) => {
    if (key === "acceleration") {
      // random values for x, y, z acceleration
      const newReadingX: number = Math.random() * 3 - 1.5;
      const newReadingY: number = Math.random() * 3 - 1.5;
      const newReadingZ: number = Math.random() * 3 - 1.5;

      const datasets: ChartDataset<'line'>[] = chartDataMap.value["acceleration"].datasets;

      // x data update
      datasets[0].data = [...datasets[0].data, newReadingX];
      if (datasets[0].data.length > dataSize) datasets[0].data.shift();

      // y data update
      datasets[1].data = [...datasets[1].data, newReadingY];
      if (datasets[1].data.length > dataSize) datasets[1].data.shift();

      // z data update
      datasets[2].data = [...datasets[2].data, newReadingZ];
      if (datasets[2].data.length > dataSize) datasets[2].data.shift();

      // Reasing chartDataMap so that Vue recognizes the update
      if(update){
        chartDataMap.value["acceleration"] = {
          ...chartDataMap.value["acceleration"],
          labels: [...labels.value],
          datasets: [...datasets],
        };
      }
    } else {
      const newReading: number = Math.floor(Math.random() * 1024);
      // Update the `data` array
      const dataset: ChartDataset<'line'> = chartDataMap.value[key].datasets[0];

      dataset.data = [...dataset.data, newReading];
      if (dataset.data.length > dataSize) {
        dataset.data.shift();
      }
      if(update){
        chartDataMap.value[key] = {
          ...chartDataMap.value[key],
          labels: [...labels.value],
          datasets: [{ ...dataset }],
        };
      }
    }
  });
};
