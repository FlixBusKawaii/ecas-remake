<script setup lang="ts">
import type { MonthlyStat } from '../types';
import { i18n } from '../i18n';
import { formatMonth } from '../utils/date';
import { nextTick, ref, watch } from 'vue';

const props = defineProps<{
  stats: MonthlyStat[];
  latestReadingDate: string | null;
}>();

const tableContainer = ref<HTMLElement | null>(null);

function getMonthName(month: number): string {
  return formatMonth(month, i18n.global.locale.value);
}

async function scrollToLatestReading() {
  if (!props.latestReadingDate) {
    return;
  }

  const date = new Date(props.latestReadingDate);

  const target = `${date.getFullYear()}-${date.getMonth() + 1}`;

  await nextTick();

  const row = tableContainer.value?.querySelector(
    `[data-month="${target}"]`
  );

  row?.scrollIntoView({
    behavior: 'auto',
    block: 'center',
  });
}

watch(
  () => props.latestReadingDate,
  async () => {
    await scrollToLatestReading();
  },
  { immediate: true }
);
</script>

<template>
  <div
    ref="tableContainer"
    class="min-h-0 max-h-[65vh] overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900"
  >
    <table class="w-full">
      <thead class="sticky top-0 z-10 border-b border-slate-800 bg-slate-800">
        <tr>
          <th class="px-2 py-1.5 text-left font-semibold text-lg text-slate-300">
            {{$t('wording.month')}}
          </th>

          <th class="px-2 py-1.5 text-left font-semibold text-lg text-slate-300">
            Cons.
          </th>

          <th class="px-2 py-1.5 text-left font-semibold text-lg text-slate-300">
            {{$t('wording.prev')}}
          </th>

          <th class="px-2 py-1.5 text-left font-semibold text-lg text-slate-300">
            Diff.
          </th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="stat in props.stats"
          :key="`${stat.year}-${stat.month}`"
          :data-month="`${stat.year}-${stat.month}`"
          class="border-b border-slate-800 last:border-b-0"
        >
          <td class="px-2 py-1 text-base">
            {{ getMonthName(stat.month) }} {{ stat.year }}
          </td>

          <td class="px-2 py-1 text-base tabular-nums">
            {{
              stat.consumption !== null
                ? `${stat.consumption.toFixed(1)}`
                : '-'
            }}
          </td>

          <td class="px-2 py-1 text-base tabular-nums text-slate-400">
            {{
              stat.previousYear !== null
                ? `${stat.previousYear.toFixed(1)}`
                : '-'
            }}
          </td>

          <td
            class="px-2 py-1 text-base tabular-nums"
            :class="
              stat.difference === null
                ? 'text-slate-500'
                : stat.difference > 0
                  ? 'text-red-400'
                  : stat.difference < 0
                    ? 'text-green-400'
                    : 'text-slate-300'
            "
          >
            <template v-if="stat.difference !== null">
              <div>
                {{ stat.difference > 0 ? '+' : '' }}
                {{ stat.difference.toFixed(1) }}
              </div>

              <div class="text-[10px] leading-none opacity-80">
                (
                {{ stat.percentage! > 0 ? '+' : '' }}
                {{ stat.percentage!.toFixed(1) }}%
                )
              </div>
            </template>

            <template v-else>
              -
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
