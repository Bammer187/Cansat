<template>
  <div class="grid-container">
    <div
      v-for="(chart, index) in chartConfig.charts.value"
      :key="chart.key"
      :class="`chart${index + 1}`"
    >
      <LineChart
        :chartData="chartConfig.chartDataMap.value[chart.key]"
        :chartOptions="chartConfig.chartOptionsMap.value[chart.key]"
      />
    </div>

    <div class="div6"></div>
    <div class="div7"></div>
    <div class="div8">
      <button @click="update = !update">Pause</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import LineChart from "@/components/LineChart.vue";
import * as chartConfig from "@/chartConfig";
import { onMounted, ref } from "vue";
import { UPDATE_TIME } from "@/settings";
import axios from "axios";

const update = ref<boolean>(true);
const data_saved = ref<boolean>(false);

const checkDataSaved = () => {
  axios.get('http://127.0.0.1:5000/check_data_saved')
  .then(response => {
    data_saved.value = response.data
  })
  .catch(error => {
    console.log("Error loading the data: ", error);
  });
  return data_saved.value;
};

onMounted(() => {
  setInterval(() => {
    chartConfig.updateSensorData(update.value);
    checkDataSaved();
  }, UPDATE_TIME);
});
</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 20px;
  width: 100%;
  height: 100%;
  padding: 20px;
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
.div6 {
  grid-area: 3 / 1 / 4 / 2;
  background-color: red;
}
.div7 {
  grid-area: 3 / 2 / 4 / 3;
  background-color: yellow;
}
.div8 {
  grid-area: 3 / 3 / 4 / 4;
  background-color: blue;
}
</style>
