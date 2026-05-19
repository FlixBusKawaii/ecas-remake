<script setup lang="ts">
import type { EnrichedReading } from '../types';

defineProps<{
  readings: EnrichedReading[];
  selectedAverageConsumption: number;
}>();

function formatDate(date: string): string {
  return new Date(date).toLocaleString('fr-FR', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
}
</script>

<template>
  <ul class="space-y-3 overflow-auto">
    <li
      v-for="r in readings"
      :key="r.id"
      class="rounded-2xl border border-slate-800 bg-slate-900 p-4"
    >
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="text-xs text-slate-400">
            {{ formatDate(r.date) }}
          </p>

          <p class="mt-1 text-lg font-semibold">
            {{ r.value }} kWh
          </p>
        </div>
      </div>

      <template v-if="r.consumption !== undefined">
        <div class="mt-1 grid grid-cols-3 gap-3 text-center">
          <div class="rounded-lg bg-slate-800 p-2">
            <p class="text-xs text-slate-400">{{$t('wording.consumption')}}</p>
            <p class="mt-1 font-medium">
              {{ r.consumption.toFixed(1) }} kWh
            </p>
          </div>

          <div class="rounded-lg bg-slate-800 p-2">
            <p class="text-xs text-slate-400">{{$t('wording.days')}}</p>
            <p class="mt-1 font-medium">
              {{ r.days?.toFixed(1) }}
            </p>
          </div>

          <div class="rounded-lg bg-slate-800 p-2" v-if="selectedAverageConsumption == 1">
            <p class="text-xs text-slate-400">{{$t('period.day')}}</p>
            <p class="mt-1 font-medium">
              {{ r.perDay?.toFixed(1) }} kWh
            </p>
          </div>

          <div class="rounded-lg bg-slate-800 p-2" v-if="selectedAverageConsumption == 2">
            <p class="text-xs text-slate-400">{{$t('period.month')}}</p>
            <p class="mt-1 font-medium">
              {{ r.perMonth?.toFixed(1) }} kWh
            </p>
          </div>
        </div>
      </template>
    </li>
  </ul>
</template>
