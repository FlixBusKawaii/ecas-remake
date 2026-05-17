<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import type { Meter, MonthlyStat } from '../types';
import StatisticsTable from '../components/StatisticsTable.vue';
import { db } from '../services/db';
import { computeYearStats } from '../services/monthlyStats';
import { importData } from '../services/import';

const stats = ref<MonthlyStat[]>([]);
const meters = ref<Meter[]>([]);

const selectedMeterId = ref(1);

async function loadStats() {

  const rawReadings = await db.readings
    .where('meterId')
    .equals(selectedMeterId.value)
    .toArray();

  stats.value = computeYearStats(rawReadings, 2025);
}

watch(selectedMeterId, async () => {
  await loadStats();
});

onMounted(async () => {
  const count = await db.meters.count();

  if (count === 0) {
    await importData();
  }

  meters.value = await db.meters.toArray();

  await loadStats();
});
</script>

<template>
  <div class="flex h-full flex-col">
    <div class="space-y-4">
      <h1>Statistics</h1>

      <div class="space-x-2">
        <select
          v-model="selectedMeterId"
          class="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white"
        >
          <option :value="1">HC</option>
          <option :value="2">HP</option>
        </select>
      </div>
      <div class="mt-4 min-h-0 max-h-[60vh] flex-1 overflow-y-auto">
        <StatisticsTable :stats="stats" />
      </div>
    </div>
  </div>
</template>
