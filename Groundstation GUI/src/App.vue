<template>
  <div class="chart-container">
    <div v-for="index in 4" :class="`chart${index}`">
      <LineChart :chartData="data" :chartOptions="options" />
    </div>

    <div class="chart5">
      <LineChart
        :chartData="chartConfig.accelerationData"
        :chartOptions="chartConfig.accelerationOptions"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import LineChart from "@/components/LineChart.vue";
import * as chartConfig from "@/chartConfig";
import { ref, onMounted } from "vue";
import type { ChartData } from "chart.js";

const options = chartConfig.options;
const data = ref<ChartData<"line">>({
  datasets: [],
});

onMounted(() => {
  setInterval(() => {
    data.value = chartConfig.randomData();
  }, 3000);
});
</script>

<style scoped>
.chart-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 20px;
  width: 98%;
  height: 60%;
  margin: 20px;
  position: absolute;
  top: 0;
  left: 0;
}

.chart1 {
  grid-area: 1 / 1 / 2 / 2;
}
.chart2 {
  grid-area: 1 / 2 / 2 / 3;
}
.chart3 {
  grid-area: 2 / 1 / 3 / 2;
}
.chart4 {
  grid-area: 2 / 2 / 3 / 3;
}
.chart5 {
  grid-area: 1 / 3 / 3 / 4;
}
</style>
