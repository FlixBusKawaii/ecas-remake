<script setup lang="ts">
import type { MeterSummary } from '../services/home';

defineProps<{
  summary: MeterSummary;
}>();

function formatDate(date: string): string {
  return new Date(date).toLocaleString('fr-FR', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
}
</script>

<template>
  <div class="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-sm">
    <h2>{{ summary.meter.name }}</h2>

    <div v-if="summary.latestReading">
      <p class="mt-2 text-sm text-slate-400">
        {{ formatDate(summary.latestReading.date) }}
      </p>

      <p class="mt-2 text-2xl font-semibold">
        {{ summary.latestReading.value }}
        {{ summary.meter.unit }}
      </p>
    </div>

    <div v-else>
      <p class="mt-2 text-sm text-slate-400">
        Aucun relevé.
      </p>
    </div>
  </div>
</template>