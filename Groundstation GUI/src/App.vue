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

    <div class="div6">
      <DataTable :value="dbEntrys" scrollable scrollHeight="400px" class="datable">
        <Column field="id" header="ID"></Column>
        <Column field="temperature" header="Temperature"></Column>
        <Column field="pressure" header="Pressure"></Column>
        <Column field="humidity" header="Humidity"></Column>
        <Column field="particle" header="Particle concentration"></Column>
        <Column field="x" header="X"></Column>
        <Column field="y" header="Y"></Column>
        <Column field="z" header="Z"></Column>
        <Column field="time" header="Time"></Column>
      </DataTable>
    </div>

    <div class="logoDiv">
      <img src="/logo.jpeg" />
    </div>

    <div class="div8">
      <Button
        :label="statusTextPause"
        :severity="pauseButtonClass"
        @click="update = !update"
      ></Button>
      <Badge
        size="xlarge"
        :value="statusTextBadge"
        :severity="badgeClass"
      ></Badge>
      <Button label="All" @click="http.deleteEntries(1)"></Button>
      <Button label="Last 10" @click="http.deleteEntries(2)"></Button>
      <Button label="24h" @click="http.deleteEntries(3)"></Button>
      <InputText type="number" v-model:number="deleteCount" />
      <Button
        label="Delete"
        @click="http.deleteCustomEntries(deleteCount)"
        raised
      ></Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import LineChart from "@/components/LineChart.vue";
import * as chartConfig from "@/chartConfig";
import { onMounted, ref, computed } from "vue";
import { UPDATE_TIME } from "@/settings";
import * as http from "@/httpFunctions";
import { Button, Badge, InputText, DataTable, Column } from "primevue";

const update = ref<boolean>(true);
const data_saved = ref<boolean>(false);
const deleteCount = ref<number>(0);

const pauseButtonClass = computed(() => (update.value ? "warn" : "success"));
const statusTextPause = computed(() => (update.value ? "PAUSE" : "CONTINUE"));

const badgeClass = computed(() => (data_saved.value ? "success" : "danger"));
const statusTextBadge = computed(() => (data_saved.value ? "OK" : "ERROR"));

const dbEntrys = ref<JSON[]>([]);
const newestEntry = ref<JSON>();

onMounted(async () => {
  dbEntrys.value = await http.getAllDbEntries();
  setInterval(() => {
    chartConfig.updateSensorData(update.value);
    data_saved.value = http.checkDataSaved();
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
}

.datatable {
  max-height: 400px;
  overflow-y: auto;
}

.logoDiv {
  grid-area: 3 / 2 / 4 / 3;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.logoDiv img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.div8 {
  grid-area: 3 / 3 / 4 / 4;
  background-color: blue;
}

.badge {
  background-color: inherit;
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
}
</style>
