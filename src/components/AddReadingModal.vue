<script setup lang="ts">
import { ref } from 'vue';
import { db } from '../services/db';

const selectedMeterId = ref(1);
const value = ref<number | null>(null);

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  saved: [];
}>();

const props = defineProps<{
  modelValue: boolean;
  latestReadingId: number;
}>();

async function save() {
  if (value.value === null || value.value <= 0) {
    return;
  }

  await db.readings.add({
    id: props.latestReadingId + 1,
    meterId: selectedMeterId.value,
    value: value.value,
    date: new Date().toISOString(),
  });

  emit('saved');
  emit('update:modelValue', false);

  selectedMeterId.value = 1;
  value.value = null;
}

function close() {
  emit('update:modelValue', false);
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
    >
      <div
        class="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl"
      >
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-lg font-semibold">{{$t('actions.addReading')}}</h2>
        </div>

        <div class="space-y-4">
          <div>
              <label
                for="meter"
                class="mb-1 block text-sm font-medium text-slate-300"
              >
              {{$t('options.meterType')}}
              </label>

              <select
                id="meter"
                v-model="selectedMeterId"
                class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white"
              >
              <option :value="1">{{$t('meters.hc')}}</option>
              <option :value="2">{{$t('meters.hp')}}</option>
              </select>
          </div>

          <div>
              <label
                for="value"
                class="mb-1 block text-sm font-medium text-slate-300"
              >
              {{$t('options.value')}}
              </label>

              <input
                id="value"
                v-model.number="value"
                type="number"
                min="0"
                step="1"
                :placeholder="$t('wording.enterValue')"
                class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder-slate-500"
              />
          </div>
        </div>

        <div class="mt-6 flex gap-3">
          <button
            class="flex-1 bg-slate-600 rounded-lg border border-slate-700 px-4 py-2"
            @click="close"
          >
            {{$t('common.cancel')}}
          </button>

          <button
            class="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="value === null || value <= 0"
            @click="save"
          >
            {{$t('common.save')}}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
