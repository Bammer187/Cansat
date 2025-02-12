<template>
  <div class="chart-container">
    <LineChart :chartData="data" :chartOptions="options"/>
    <LineChart :chartData="data" :chartOptions="options"/>
    <LineChart :chartData="data" :chartOptions="options"/>
    <LineChart :chartData="data" :chartOptions="options"/>
  </div>
</template>

<script setup lang="ts">
import LineChart from "@/components/LineChart.vue";
import * as chartConfig from "@/chartConfig";
import { ref, onMounted } from "vue";
import type { ChartData } from "chart.js";

const options = chartConfig.options;
const data = ref<ChartData<'line'>>({
  datasets: []
});

onMounted(() => {
  setInterval(() => {
    data.value = chartConfig.randomData()
  }, 3000)
})
</script>

<style scoped>
.chart-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  width: 30vw;
  height: 30vh;
  margin-top: 20px;
  margin-left: 20px;
  position: absolute;
  top: 0;
  left: 0;
}
</style>