<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import ReadingList from '../components/ReadingList.vue';
import type { EnrichedReading, Meter } from '../types';
import { enrichReadings } from '../services/stats';
import { db } from '../services/db';
import { getData } from '../services/import';

const meters = ref<Meter[]>([]);
const readings = ref<EnrichedReading[]>([]);

const selectedMeterId = ref(1);
const selectedAverageConsumption = ref(1);

async function loadReadings() {

  const rawReadings = await db.readings
    .where('meterId')
    .equals(selectedMeterId.value)
    .toArray();

  readings.value = enrichReadings(rawReadings).reverse();
}

watch(selectedMeterId, async () => {
  await loadReadings();
});

onMounted(async () => {
  const count = await db.meters.count();

  if (count === 0) {
    await getData();
  }

  meters.value = await db.meters.toArray();

  await loadReadings();
});
</script>

<template>
  <div class="flex h-full flex-col">
    <div class="space-y-4">
      <h1>Readings</h1>

      <div class="flex flex-row space-x-2">
        <select
          v-model="selectedMeterId"
          class="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white"
        >
          <option :value="1">HC</option>
          <option :value="2">HP</option>
        </select>

        <select
          v-model="selectedAverageConsumption"
          class="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white"
        >
          <option :value="1">Per Day</option>
          <option :value="2">Per Month</option>
        </select>
      </div>
    </div>

    <div class="mt-4 min-h-0 max-h-[60vh] flex-1 overflow-y-auto">
      <ReadingList :readings="readings" :selected-average-consumption="selectedAverageConsumption" />
    </div>
  </div>
</template>
