<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import type { MonthlyStat, PeriodConsumption } from '../types';
import {
  computePeriodConsumption,
  computeStats,
  MIN_STATS_YEAR,
  MAX_STATS_YEAR,
  MAX_PERIOD_MONTHS,
} from '../services/monthlyStats';
import { db } from '../services/db';
import { getData } from '../services/import';

const { locale } = useI18n();

const selectedMeterId = ref(1);

const stats = ref<MonthlyStat[]>([]);

const startMonth = ref<number | null>(null);
const startYear = ref<number | null>(null);

const endMonth = ref<number | null>(null);
const endYear = ref<number | null>(null);

const periodResult = ref<PeriodConsumption | null>(null);

function formatMonthName(month: number): string {
  return new Intl.DateTimeFormat(locale.value, {
    month: 'long',
  }).format(new Date(2000, month - 1, 1));
}

function formatMonth(year: number, month: number): string {
  return new Intl.DateTimeFormat(locale.value, {
    month: 'long',
    year: 'numeric',
  }).format(new Date(year, month - 1, 1));
}

const availableStartMonths = computed(() => {
  return [
    ...new Set(
      stats.value
        .filter(stat => stat.consumption !== null)
        .map(stat => stat.month)
    ),
  ].sort((a, b) => a - b);
});

const availableStartYears = computed(() => {
  if (startMonth.value === null) {
    return [];
  }

  return stats.value
    .filter(
      stat =>
        stat.month === startMonth.value &&
        stat.consumption !== null
    )
    .map(stat => stat.year)
    .sort((a, b) => a - b);
});

const availableEndDates = computed(() => {
  if (
    startMonth.value === null ||
    startYear.value === null
  ) {
    return [];
  }

  const startIndex =
    startYear.value * 12 +
    (startMonth.value - 1);

  return stats.value
    .filter(stat => {
      if (stat.consumption === null) {
        return false;
      }

      const index =
        stat.year * 12 +
        (stat.month - 1);

      const numberOfMonths =
        index - startIndex + 1;

      return (
        index > startIndex &&
        numberOfMonths <= MAX_PERIOD_MONTHS
      );
    })
    .map(stat => ({
      year: stat.year,
      month: stat.month,
    }));
});

const availableEndMonths = computed(() => {
  return [
    ...new Set(
      availableEndDates.value.map(date => date.month)
    ),
  ].sort((a, b) => a - b);
});

const availableEndYears = computed(() => {
  if (endMonth.value === null) {
    return [];
  }

  return availableEndDates.value
    .filter(date => date.month === endMonth.value)
    .map(date => date.year)
    .sort((a, b) => a - b);
});

const periodMonthCount = computed(() => {
  if (
    startMonth.value === null ||
    startYear.value === null ||
    endMonth.value === null ||
    endYear.value === null
  ) {
    return null;
  }

  const startIndex =
    startYear.value * 12 +
    (startMonth.value - 1);

  const endIndex =
    endYear.value * 12 +
    (endMonth.value - 1);

  return endIndex - startIndex + 1;
});

function calculateTotal() {
  periodResult.value = null;

  if (
    startMonth.value === null ||
    startYear.value === null ||
    endMonth.value === null ||
    endYear.value === null
  ) {
    return;
  }

  periodResult.value = computePeriodConsumption(
    stats.value,
    startYear.value,
    startMonth.value,
    endYear.value,
    endMonth.value
  );
}

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

  startMonth.value = null;
  startYear.value = null;
  endMonth.value = null;
  endYear.value = null;

  periodResult.value = null;
}

watch(selectedMeterId, async () => {
  await loadStats();
});

watch(startMonth, () => {
  if (
    startYear.value !== null &&
    !availableStartYears.value.includes(startYear.value)
  ) {
    startYear.value = null;
  }

  endMonth.value = null;
  endYear.value = null;

  periodResult.value = null;
});

watch(startYear, () => {
  endMonth.value = null;
  endYear.value = null;

  periodResult.value = null;
});

watch(endMonth, () => {
  if (
    endYear.value !== null &&
    !availableEndYears.value.includes(endYear.value)
  ) {
    endYear.value = null;
  }

  periodResult.value = null;
});

watch(
  [startMonth, startYear, endMonth, endYear],
  () => {
    calculateTotal();
  }
);

onMounted(async () => {
  const count = await db.meters.count();

  if (count === 0) {
    await getData();
  }

  await loadStats();
});
</script>

<template>
  <div class="flex h-full flex-col gap-4">

    <h1>{{$t('wording.sum')}}</h1>

    <select
      v-model="selectedMeterId"
      class="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white"
    >
      <option :value="1">
        {{ $t('meters.hc') }}
      </option>

      <option :value="2">
        {{ $t('meters.hp') }}
      </option>
    </select>

    <div class="rounded-xl bg-slate-800 p-4">

      <div class="space-y-4">

        <div class="space-y-1">
          <label
            for="start-month"
            class="mb-1 block text-sm text-slate-300"
          >
            {{$t('wording.startingMonth')}}
          </label>

          <select
            v-model="startMonth"
            class="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-white"
          >
            <option :value="null" disabled>
              {{$t('actions.selectMonth')}}
            </option>

            <option
              v-for="month in availableStartMonths"
              :key="month"
              :value="month"
            >
              {{ formatMonthName(month) }}
            </option>
          </select>

          <select
            v-model="startYear"
            :disabled="startMonth === null"
            class="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-white"
          >
            <option :value="null" disabled>
              {{$t('actions.selectYear')}}
            </option>

            <option
              v-for="year in availableStartYears"
              :key="year"
              :value="year"
            >
              {{ year }}
            </option>
          </select>
        </div>

        <div class="space-y-1">
          <label
            for="end-month"
            class="mb-1 block text-sm text-slate-300"
          >
            {{$t('wording.endingMonth')}}
          </label>

          <select 
            v-model="endMonth"
            class="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-white"
          >
            <option :value="null" disabled>
              {{$t('actions.selectMonth')}}
            </option>

            <option
              v-for="month in availableEndMonths"
              :key="month"
              :value="month"
            >
              {{ formatMonthName(month) }}
            </option>
          </select>

          <select
            v-model="endYear"
            :disabled="endMonth === null"
            class="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-white"
          >
            <option :value="null" disabled>
              {{$t('actions.selectYear')}}
            </option>

            <option
              v-for="year in availableEndYears"
              :key="year"
              :value="year"
            >
              {{ year }}
            </option>
          </select>
        </div>

        </div>

        <p class="text-center text-sm mt-2 text-slate-400">
          {{$t('wording.maximumPeriod')}}
        </p>

      </div>

      <p
        v-if="periodMonthCount"
        class="mt-3 text-center text-sm text-slate-400"
      >
        {{ periodMonthCount }} {{$t('wording.month')}}
      </p>

    </div>

    <div
      v-if="periodResult"
      class="rounded-xl bg-slate-800 p-6 text-center text-white"
    >
      <p class="text-sm text-slate-400">
        {{$t('wording.totalConsumption')}}
      </p>

      <p class="mt-2 text-4xl font-bold">
        {{ periodResult.total }}
        <span class="text-xl font-normal">kWh</span>
      </p>

      <div
        v-if="periodResult.missingMonths.length > 0"
        class="mt-4 rounded-lg bg-amber-500/10 p-3 text-left text-sm text-amber-300"
      >
        <p class="font-semibold">
          ⚠️ {{$t('wording.missingData')}}
        </p>

        <p class="mt-1">
          {{$t('wording.unknownData')}}
        </p>

        <ul class="mt-1 list-inside list-disc">
          <li
            v-for="month in periodResult.missingMonths"
            :key="`${month.year}-${month.month}`"
          >
            {{ formatMonth(month.year, month.month) }}
          </li>
        </ul>
      </div>
    </div>

</template>
