<template>
  <div class="chart-container">
    <div v-for="(chart, index) in chartConfig.charts.value" :key="chart.key" :class="`chart${index + 1}`">
      <LineChart
        :chartData="chartConfig.chartDataMap.value[chart.key]"
        :chartOptions="chartConfig.chartOptions.value"
      />
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
import { onMounted } from "vue";

onMounted(() => {
  setInterval(() => {
    chartConfig.updateSensorData();
  }, 1000);
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
