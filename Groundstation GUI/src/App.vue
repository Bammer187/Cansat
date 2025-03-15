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

    <div class="dataTableDiv">
      <DataTable
        :value="dbEntrys"
        scrollable
        scrollHeight="334.33px"
        stripedRows
        size="small"
        class="datable"
      >
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

    <div class="controlPanel">
      <Badge
        class="div1"
        size="xlarge"
        value="Update sensorcharts:"
        style="height: 100%"
      ></Badge>

      <Button
        :label="statusTextPause"
        :severity="pauseButtonClass"
        @click="update = !update"
        class="div2"
      ></Button>

      <Badge
        size="xlarge"
        value="Saving to database:"
        class="div3"
        style="height: 100%"
      ></Badge>

      <Badge
        size="xlarge"
        :value="statusTextBadge"
        :severity="badgeClass"
        class="div4"
        style="height: 100%"
      ></Badge>

      <Button
        label="Delete every entry"
        @click="
          http.deleteEntries(1);
          needFullUpdate = true;
        "
        class="div7"
      ></Button>

      <Button
        label="Delete oldest ten entries"
        @click="
          http.deleteEntries(2);
          needFullUpdate = true;
        "
        class="div8"
      ></Button>

      <InputNumber
        v-model="deleteCount"
        inputId="integeronly"
        :min="1"
        showButtons
        class="div5"
      />

      <Button
        :label="buttonCustomDeleteText"
        @click="
          http.deleteCustomEntries(deleteCount);
          needFullUpdate = true;
        "
        class="div9"
      ></Button>

      <Button
        label="Delete last 24 hours"
        @click="
          http.deleteEntries(3);
          needFullUpdate = true;
        "
        class="div10"
      ></Button>

      <div class="div6">
        <a class="icon-link" href="https://github.com/Bammer187/Cansat" target="_blank">
          <Icon icon="mdi-github" width="50px" height="50px" color="currentColor"/>
        </a>
        <a class="icon-link" href="https://www.instagram.com/bluebullbulme/" target="_blank">
          <Icon icon="mdi-instagram" width="50px" height="50px" color="currentColor"/>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import LineChart from "@/components/LineChart.vue";
import * as chartConfig from "@/chartConfig";
import { onMounted, ref, computed } from "vue";
import { UPDATE_TIME } from "@/settings";
import * as http from "@/httpFunctions";
import Button from "primevue/button";
import Badge from "primevue/badge";
import InputNumber from "primevue/inputnumber";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { Icon } from "@iconify/vue";

const update = ref<boolean>(true);
const data_saved = ref<boolean>(false);
const deleteCount = ref<number>(1);
const needFullUpdate = ref<boolean>(true);

const buttonCustomDeleteText = computed(() =>
  deleteCount.value > 1
    ? `Delete ${deleteCount.value} oldest entries`
    : "Delete oldest entry"
);

const pauseButtonClass = computed(() => (update.value ? "warn" : "success"));
const statusTextPause = computed(() => (update.value ? "PAUSE" : "CONTINUE"));

const badgeClass = computed(() => (data_saved.value ? "success" : "danger"));
const statusTextBadge = computed(() => (data_saved.value ? "OK" : "ERROR"));

interface SensorData {
  id: number;
  temperature: number;
  pressure: number;
  humidity: number;
  particle: number;
  x: number;
  y: number;
  z: number;
  time: string;
}

const dbEntrys = ref<SensorData[]>([
  {
    id: 0,
    temperature: 0,
    pressure: 0,
    humidity: 0,
    particle: 0,
    x: 0,
    y: 0,
    z: 0,
    time: "01-01-2000 00:00:00",
  },
]);

const newestEntry = ref<SensorData>({
  id: 0,
  temperature: 0,
  pressure: 0,
  humidity: 0,
  particle: 0,
  x: 0,
  y: 0,
  z: 0,
  time: "01-01-2000 00:00:00",
});

onMounted(async () => {
  setInterval(async () => {
    //await chartConfig.updateSensorData(update.value);
    //data_saved.value = await http.checkDataSaved();

    if (needFullUpdate.value) {
      //dbEntrys.value = await http.getAllDbEntries();
      needFullUpdate.value = false;
    }

    if (data_saved.value) {
      //newestEntry.value = await http.getNewestDbEntry();

      const exists = dbEntrys.value.some(
        (entry) => entry.id === newestEntry.value.id
      );

      if (!exists) {
        dbEntrys.value.push(newestEntry.value);
      }
    }
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

.dataTableDiv {
  grid-area: 3 / 1 / 4 / 2;
}

.div1 {
  grid-area: 1 / 1 / 2 / 2;
}
.div2 {
  grid-area: 1 / 2 / 2 / 3;
}
.div3 {
  grid-area: 2 / 1 / 3 / 2;
}
.div4 {
  grid-area: 2 / 2 / 3 / 3;
}
.div5 {
  grid-area: 3 / 1 / 4 / 3;
}
.div6 {
  grid-area: 4 / 1 / 5 / 3;
}
.div7 {
  grid-area: 1 / 3 / 2 / 4;
}
.div8 {
  grid-area: 2 / 3 / 3 / 4;
}
.div9 {
  grid-area: 3 / 3 / 4 / 4;
}
.div10 {
  grid-area: 4 / 3 / 5 / 4;
}

.datatable {
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

.controlPanel {
  grid-area: 3 / 3 / 4 / 4;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(4, 1fr);
  grid-column-gap: 10px;
  grid-row-gap: 10px;
}

.badge {
  background-color: inherit;
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
}

.icon-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  transition: #3C3D37 0.3s ease;
  color: black;
}

.icon-link:hover {
  background-color: #3C3D37;
  border-radius: 8px;
  color: white;
}
</style>
