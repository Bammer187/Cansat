<template>
  <LineChart :chartData="data" :chartOptions="options"/>
</template>

<script setup lang="ts">
import LineChart from "@/components/LineChart.vue";
import * as chartConfig from "@/chartConfig";
import { ref } from "vue";
import type { ChartData } from "chart.js";

const options = chartConfig.options;
const data = ref<ChartData<'line'>>({
  datasets: []
});

data.value = chartConfig.data;
</script>

<style scoped>

</style>