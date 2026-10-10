<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import type { Meter, MonthlyStat } from '../types';
import StatisticsTable from '../components/StatisticsTable.vue';
import { db } from '../services/db';
import { computeStats, MIN_STATS_YEAR, MAX_STATS_YEAR } from '../services/monthlyStats';
import { getData } from '../services/import';

type DisplayMode = 'monthly' | 'rollingYear';

const stats = ref<MonthlyStat[]>([]);
const meters = ref<Meter[]>([]);

const selectedMeterId = ref(1);

const latestReadingDate = ref<string | null>(null);

const displayMode = ref<DisplayMode>('monthly')

async function loadStats() {
  const rawReadings = await db.readings
    .where('meterId')
    .equals(selectedMeterId.value)
    .toArray();

  stats.value = computeStats(
    rawReadings,
    MIN_STATS_YEAR,
    MAX_STATS_YEAR
  );

  if (rawReadings.length > 0) {
    const latestReading = rawReadings.reduce((latest, reading) => {
      return new Date(reading.date) > new Date(latest.date)
        ? reading
        : latest;
    });

    latestReadingDate.value = latestReading.date;
  } else {
    latestReadingDate.value = null;
  }
}

watch(selectedMeterId, async () => {
  await loadStats();
});

onMounted(async () => {
  const count = await db.meters.count();

  if (count === 0) {
    await getData();
  }

  meters.value = await db.meters.toArray();

  await loadStats();
});
</script>

<template>
  <div class="flex h-full flex-col">
    <div class="space-y-2">
      <div class="flex flex-row items-center justify-between">
        <h1>{{ $t('nav.statistics') }}</h1>

        <button
          type="button"
          class="rounded-xl bg-slate-700 px-3 py-2 text-center font-semibold text-white"
          @click="displayMode = displayMode === 'monthly' ? 'rollingYear' : 'monthly'"
        >
          {{
            displayMode === 'monthly'
              ? $t('wording.rollingYear')
              : $t('wording.monthly')
          }}
        </button>
      </div>

      <div class="space-x-2">
        <select
          v-model="selectedMeterId"
          class="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white"
        >
          <option :value="1">{{$t('meters.hc')}}</option>
          <option :value="2">{{$t('meters.hp')}}</option>
        </select>
      </div>
      <div class="mt-4 flex-1">
        <StatisticsTable 
          :stats="stats"
          :latest-reading-date="latestReadingDate"
          :display-mode="displayMode"
        />
      </div>
    </div>
  </div>
</template>
