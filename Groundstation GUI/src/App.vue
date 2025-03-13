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
        <Column field="temp" header="Temperature"></Column>
        <Column field="press" header="Pressure"></Column>
        <Column field="humi" header="Humidity"></Column>
        <Column field="part" header="Particle concentration"></Column>
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
      <Button label="All" @click="deleteEntries(1)"></Button>
      <Button label="Last 10" @click="deleteEntries(2)"></Button>
      <Button label="24h" @click="deleteEntries(3)"></Button>
      <InputText type="number" v-model:number="deleteCount" />
      <Button
        label="Delete"
        @click="deleteCustomEntries(deleteCount)"
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
import axios from "axios";
import { Button, Badge, InputText, DataTable, Column } from "primevue";

const update = ref<boolean>(true);
const data_saved = ref<boolean>(false);
const deleteCount = ref<number>(0);

const pauseButtonClass = computed(() => (update.value ? "warn" : "success"));
const statusTextPause = computed(() => (update.value ? "PAUSE" : "CONTINUE"));

const badgeClass = computed(() => (data_saved.value ? "success" : "danger"));
const statusTextBadge = computed(() => (data_saved.value ? "OK" : "ERROR"));

const dbEntrys = ref(
      Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        temp: Math.floor(Math.random() * 1024),
        press: Math.floor(Math.random() * 1024),
        humi: Math.floor(Math.random() * 1024),
        part: Math.floor(Math.random() * 1024),
        x: Math.floor(Math.random() * 50),
        y: Math.floor(Math.random() * 50),
        z: Math.floor(Math.random() * 50),
        time: new Date().toLocaleTimeString(),
      }))
    );

/**
 *
 * @param option - What data will be deleted:
 * 1 - Everything,
 * 2 - First 10 entrys
 * 3 - Last 24 hours
 */
const deleteEntries = (option: number) => {
  axios.delete(`http://127.0.0.1:5000/delete_entry/${option}`)
    .then(response => {
      console.log(response.data.message);
    })
    .catch((error) => {
      console.error("Error deleting the data:", error);
    });
}

/**
 *
 * @param entries - How many entrys shall be deleted. The first number of entries specified are deleted.
 */
const deleteCustomEntries = (entries: number) => {
  if (deleteCount.value <= 0) {
    alert("Bitte eine gültige Anzahl eingeben!");
    return;
  }

  axios.delete(`http://127.0.0.1:5000/delete_custom/${entries}`)
    .then(response => {
      console.log(response.data.message);
    })
    .catch(error => {
      console.error("Fehler beim Löschen:", error);
    });
};

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
    //chartConfig.updateSensorData(update.value);
    //checkDataSaved();
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
