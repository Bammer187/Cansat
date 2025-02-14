import type { ChartData, ChartDataset, ChartOptions } from "chart.js";
import { ref } from "vue";
import * as settings from "@/settings";

const dataSize: number = settings.NUMBER_POINTS;
const labels = ref<string[]>(new Array(dataSize).fill("0"));

export const charts = ref([
  {
    title: "Temperature",
    key: "Temperature",
    color: settings.TEMP_COLOR,
    yLabel: "°C",
  },
  {
    title: "Humidity",
    key: "Humidity",
    color: settings.HUMI_COLOR,
    yLabel: "%",
  },
  {
    title: "Air pressure",
    key: "Air pressure",
    color: settings.AIRP_COLOR,
    yLabel: "hPa",
  },
  {
    title: "Particle concentration",
    key: "Particle concentration",
    color: settings.PART_COLOR,
    yLabel: "µg/m³",
  },
  {
    title: "Acceleration",
    key: "acceleration",
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
              borderWidth: settings.LINE_THICKNESS,
              pointBorderColor: color,
              pointRadius: settings.POINT_SIZE / 2,
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
        borderColor: settings.ACCX_COLOR,
        backgroundColor: settings.ACCX_COLOR,
        yAxisID: "y",
        pointRadius: settings.POINT_SIZE / 2,
        borderWidth: settings.LINE_THICKNESS,
      },
      {
        label: "Y-Accleration",
        data: new Array(dataSize).fill(0),
        borderColor: settings.ACCY_COLOR,
        backgroundColor: settings.ACCY_COLOR,
        yAxisID: "y1",
        pointRadius: settings.POINT_SIZE / 2,
        borderWidth: settings.LINE_THICKNESS,
      },
      {
        label: "Z-Accleration",
        data: new Array(dataSize).fill(0),
        borderColor: settings.ACCZ_COLOR,
        backgroundColor: settings.ACCZ_COLOR,
        yAxisID: "y2",
        pointRadius: settings.POINT_SIZE / 2,
        borderWidth: settings.LINE_THICKNESS,
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
  currentTime = currentTime + settings.UPDATE_TIME / 1000;
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
