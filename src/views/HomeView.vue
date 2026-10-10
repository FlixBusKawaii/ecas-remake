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
  <div class="flex flex-col space-y-4">
    <h1>{{ $t('nav.home') }}</h1>

    <MeterSummaryCard
      v-for="summary in summaries"
      :key="summary.meter.id"
      :summary="summary"
    />

    <button @click="showModal = true" class="w-full mb-12">
      {{$t('actions.addReading')}}
    </button>

    <AddReadingModal
      v-model="showModal"
      :latest-reading-id="latestReadingId"
      @saved="handleSaved"
    />

    <RouterLink
      to="/period-stats"
      class="rounded-xl bg-slate-700 py-2 text-center font-semibold text-white"
    >
      {{$t('wording.sum')}}
    </RouterLink>
  </div>
</template>
