<script setup lang="ts">
import { onMounted, ref } from 'vue';
import MeterSummaryCard from '../components/MeterSummaryCard.vue';
import { getMeterSummaries, type MeterSummary } from '../services/home';
import AddReadingModal from '../components/AddReadingModal.vue';

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

      <button disabled>
        Export Data
      </button>
    </div>

    <AddReadingModal
      v-model="showModal"
      :latest-reading-id="latestReadingId"
      @saved="handleSaved"
    />
  </div>
</template>
