<script setup lang="ts">
import { onMounted, ref } from 'vue';
import MeterSummaryCard from '../components/MeterSummaryCard.vue';
import { getMeterSummaries, type MeterSummary } from '../services/home';
import AddReadingModal from '../components/AddReadingModal.vue';
import { exportData } from '../services/export';
import { importData } from '../services/import';

const summaries = ref<MeterSummary[]>([]);

const showModal = ref(false);
const latestReadingId = ref<number>(0);

function getLatestReadingId(): number {
  const latestHCid = summaries.value[0].latestReading?.id;
  if(!latestHCid) return 1;
  
  const latestHPid = summaries.value[1].latestReading?.id;
  if(!latestHPid) return 1;

  if(latestHCid > latestHPid) return latestHCid;;
  return latestHPid;
}

async function handleSaved() {
  showModal.value = false;
  summaries.value = await getMeterSummaries();
  latestReadingId.value = getLatestReadingId();
}

async function handleExport() {
  await exportData();
}

async function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (!file) {
    return;
  }

  if (!confirm('This will replace all current data. Continue?')) {
    return;
  }

  await importData(file);

  summaries.value = await getMeterSummaries();
}

onMounted(async () => {
  summaries.value = await getMeterSummaries();
  latestReadingId.value = getLatestReadingId();
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
      <button @click="showModal = true">
        Add Reading
      </button>

      <button @click="handleExport">
        Export Data
      </button>
    </div>

    <label
      for="import"
      class="mb-1 block text-sm font-medium text-slate-300"
    >Import data
    </label>
    <input
      id="import"
      type="file"
      accept=".json,application/json"
      @change="handleFileChange"
      class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder-slate-500"
    />

    <AddReadingModal
      v-model="showModal"
      :latest-reading-id="latestReadingId"
      @saved="handleSaved"
    />
  </div>
</template>
