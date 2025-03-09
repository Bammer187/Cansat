<template>
  <Line :data="chartData" :options="chartOptions" />
</template>

<script setup lang="ts">
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Line } from "vue-chartjs";
import type { ChartData, ChartOptions } from "chart.js";

defineProps<{
  chartData: ChartData<'line'>;
  chartOptions: ChartOptions<'line'>;
}>();

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  CategoryScale,
  LinearScale
);
</script>
