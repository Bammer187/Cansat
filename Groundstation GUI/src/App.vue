<template>
  <LineChart :chartData="data" :chartOptions="options"/>
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

</style>