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
    <div class="logoDiv">
      <img src="/logo.jpeg"/>
    </div>
    <div class="div8">
      <button @click="update = !update">Pause</button>
      <div :class="badgeClass" class="badge px-3 py-1 rounded-lg text-white font-semibold">
        {{ statusText }}
      </div>
      <button @click="deleteEntries(1)">All</button>
      <button @click="deleteEntries(2)">10</button>
      <button @click="deleteEntries(3)">24h</button>
      <input v-model="deleteCount" type="number" min="1" placeholder="Number of Entries" />
      <button @click="deleteCustomEntries(deleteCount)">Delete</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import LineChart from "@/components/LineChart.vue";
import * as chartConfig from "@/chartConfig";
import { onMounted, ref, computed } from "vue";
import { UPDATE_TIME } from "@/settings";
import axios from "axios";

const update = ref<boolean>(true);
const data_saved = ref<boolean>(false);
const deleteCount = ref<number>(0);

const badgeClass = computed(() => data_saved.value ? 'bg-green-500' : 'bg-red-500');
const statusText = computed(() => data_saved.value ? 'OK' : 'ERROR');

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
    .catch(error => {
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

.bg-green-500 {
  background-color: #10b981 !important;
}

.bg-red-500 {
  background-color: #ef4444 !important;
}
</style>
