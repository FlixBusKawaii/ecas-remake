<script setup lang="ts">
import { ref } from 'vue';
import { db } from '../services/db';
import { useI18n } from 'vue-i18n';

const { t } = useI18n()

const hcValue = ref<number | null>(null);
const hpValue = ref<number | null>(null);

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  saved: [];
}>();

const props = defineProps<{
  modelValue: boolean;
  latestReadingId: number;
}>();

async function save() {
  const readingsToSave: { meterId: number; value: number }[] = [];

  if (hcValue.value !== null && hcValue.value > 0) {
    readingsToSave.push({
      meterId: 1,
      value: hcValue.value,
    });
  }

  if (hpValue.value !== null && hpValue.value > 0) {
    readingsToSave.push({
      meterId: 2,
      value: hpValue.value,
    });
  }

  if (readingsToSave.length === 0) {
    return;
  }

  if (
    readingsToSave.length === 1 &&
    !window.confirm(
      t('wording.singleReadingConfirmation')
    )
  ) {
    return;
  }

  const date = new Date().toISOString();

  await db.transaction('rw', db.readings, async () => {
    for (const [index, reading] of readingsToSave.entries()) {
      await db.readings.add({
        id: props.latestReadingId + index + 1,
        meterId: reading.meterId,
        value: reading.value,
        date,
      });
    }
  });

  emit('saved');
  emit('update:modelValue', false);

  hcValue.value = null;
  hpValue.value = null;
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
          <h2 class="text-lg font-semibold">
            {{ $t('actions.addReading') }}
          </h2>
        </div>

        <div class="space-y-4">
          <div>
            <label
              for="hc-value"
              class="mb-1 block text-sm font-medium text-slate-300"
            >
              {{ $t('meters.hc') }}
            </label>

            <input
              id="hc-value"
              v-model.number="hcValue"
              type="number"
              min="0"
              step="1"
              :placeholder="$t('options.value')"
              class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder-slate-500"
            />
          </div>

          <div>
            <label
              for="hp-value"
              class="mb-1 block text-sm font-medium text-slate-300"
            >
              {{ $t('meters.hp') }}
            </label>

            <input
              id="hp-value"
              v-model.number="hpValue"
              type="number"
              min="0"
              step="1"
              :placeholder="$t('options.value')"
              class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder-slate-500"
            />
          </div>
        </div>

        <div class="mt-6 flex gap-3">
          <button
            class="flex-1 rounded-lg border border-slate-700 bg-slate-600 px-4 py-2"
            @click="close"
          >
            {{ $t('common.cancel') }}
          </button>

          <button
            class="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="
              (hcValue === null || hcValue <= 0) &&
              (hpValue === null || hpValue <= 0)
            "
            @click="save"
          >
            {{ $t('common.save') }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
