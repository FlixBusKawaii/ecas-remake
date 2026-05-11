<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { importData } from '../services/import';
import { db } from '../services/db';
import type { EnrichedReading, Meter } from '../types';
import { enrichReadings } from '../services/stats';
import ReadingList from '../components/ReadingList.vue';

const meters = ref<Meter[]>([]);
const readings = ref<EnrichedReading[]>([]);

const selectedMeterId = ref(1);

async function loadReadings() {

  const rawReadings = await db.readings
    .where('meterId')
    .equals(selectedMeterId.value)
    .toArray();

  readings.value =
    enrichReadings(rawReadings).reverse();
}

watch(selectedMeterId, async () => {
  await loadReadings();
});

onMounted(async () => {
  const count = await db.meters.count();

  if (count === 0) {
    await importData();
  }

  meters.value = await db.meters.toArray();

  await loadReadings();
});
</script>

<template>
  <div>
    <h1>Test Import</h1>

    <h2>Compteurs</h2>
    <ul>
      <li v-for="m in meters" :key="m.id">
        {{ m.name }} ({{ m.unit }})
      </li>
    </ul>

    <h2>Relevés</h2>
    <select v-model="selectedMeterId">

      <option :value="1">
        HC
      </option>

      <option :value="2">
        HP
      </option>

    </select>

    <ReadingList :readings="readings" />
  </div>
</template>