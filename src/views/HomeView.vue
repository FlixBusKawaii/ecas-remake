<script setup lang="ts">
import { onMounted, ref } from 'vue';
import MeterSummaryCard from '../components/MeterSummaryCard.vue';
import { getMeterSummaries, type MeterSummary } from '../services/home';

const summaries = ref<MeterSummary[]>([]);

onMounted(async () => {
  summaries.value = await getMeterSummaries();
});
</script>

<template>
  <div class="space-y-4">
    <h1>Home</h1>

    <MeterSummaryCard
      v-for="summary in summaries"
      :key="summary.meter.id"
      :summary="summary"
    />

    <div class="grid grid-cols-2 gap-3">
      <button disabled>
        Add Reading
      </button>

      <button disabled>
        Export Data
      </button>
    </div>
  </div>
</template>
