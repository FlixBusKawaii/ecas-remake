<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { importData } from '../services/import';
import { db } from '../services/db';
import type { EnrichedReading, Meter, MonthlyStat } from '../types';
import { enrichReadings } from '../services/stats';
import ReadingList from '../components/ReadingList.vue';
import { computeYearStats } from '../services/monthlyStats';

const meters = ref<Meter[]>([]);
const readings = ref<EnrichedReading[]>([]);
const stats = ref<MonthlyStat[]>([]);

const selectedMeterId = ref(1);

async function loadReadings() {

  const rawReadings = await db.readings
    .where('meterId')
    .equals(selectedMeterId.value)
    .toArray();

  readings.value = enrichReadings(rawReadings).reverse();
  
  stats.value = computeYearStats(rawReadings, 2025);
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

  <h2>Stats</h2>
  <table border="1" cellpadding="6">
    <thead>
      <tr>
        <th>Mois</th>
        <th>Consommation</th>
        <th>Dernière année</th>
        <th>Différence</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="stat in stats" :key="stat.month">
        <td>{{ stat.month }}</td>

        <td>
          {{ stat.consumption !== null
            ? `${stat.consumption} kWh`
            : '-' }}
        </td>

        <td>
          {{ stat.previousYear !== null
            ? `${stat.previousYear} kWh`
            : '-' }}
        </td>

        <td>
          <template v-if="stat.difference !== null">
            {{ stat.difference > 0 ? '+' : '' }}{{ stat.difference }} kWh
            (
            {{ stat.percentage! > 0 ? '+' : '' }}{{ stat.percentage }}%
            )
          </template>

          <template v-else>
            -
          </template>
        </td>
      </tr>
    </tbody>
  </table>
    
</template>