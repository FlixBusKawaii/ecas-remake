
<script setup lang="ts">
import type { MonthlyStat } from '../types';
import { i18n } from '../i18n';
import { formatMonth } from '../utils/date';
import {
  computeRollingYearConsumption,
} from '../services/monthlyStats';
import { computed, nextTick, ref, watch } from 'vue';

type DisplayMode = 'monthly' | 'rollingYear';

const props = defineProps<{
  stats: MonthlyStat[];
  latestReadingDate: string | null;
  displayMode: DisplayMode;
}>();

const tableContainer = ref<HTMLElement | null>(null);

function getMonthName(month: number): string {
  return formatMonth(month, i18n.global.locale.value);
}

const tableRows = computed(() =>
  props.stats.map((stat) => ({
    ...stat,
    rollingYear: computeRollingYearConsumption(
      props.stats,
      stat.year,
      stat.month
    ),
  }))
);

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
          <th class="px-4 py-1.5 text-left text-lg font-semibold text-slate-300">
            {{ $t('wording.month') }}
          </th>

          <th class="px-2 py-1.5 text-left text-lg font-semibold text-slate-300">
            Cons.
          </th>

          <template v-if="props.displayMode === 'monthly'">
            <th class="px-2 py-1.5 text-left text-lg font-semibold text-slate-300">
              {{ $t('wording.prev') }}
            </th>

            <th class="px-2 py-1.5 text-left text-lg font-semibold text-slate-300">
              Diff.
            </th>
          </template>

          <th
            v-else
            class="px-2 py-1.5 text-left text-lg font-semibold text-slate-300"
          >
            {{ $t('wording.rollingYear') }}
          </th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="row in tableRows"
          :key="`${row.year}-${row.month}`"
          :data-month="`${row.year}-${row.month}`"
          class="border-b border-slate-800 last:border-b-0"
        >
          <td class="px-4 py-1 text-base">
            {{ getMonthName(row.month) }} {{ row.year }}
          </td>

          <td class="px-2 py-1 text-base tabular-nums">
            {{
              row.consumption !== null
                ? row.consumption.toFixed(1)
                : '-'
            }}
          </td>

          <template v-if="props.displayMode === 'monthly'">
            <td class="px-2 py-1 text-base tabular-nums text-slate-400">
              {{
                row.previousYear !== null
                  ? row.previousYear.toFixed(1)
                  : '-'
              }}
            </td>

            <td
              class="px-2 py-1 text-base tabular-nums"
              :class="
                row.difference === null
                  ? 'text-slate-500'
                  : row.difference > 0
                    ? 'text-red-400'
                    : row.difference < 0
                      ? 'text-green-400'
                      : 'text-slate-300'
              "
            >
              <template v-if="row.difference !== null">
                <div>
                  {{ row.difference > 0 ? '+' : '' }}
                  {{ row.difference.toFixed(1) }}
                </div>

                <div class="text-[10px] leading-none opacity-80">
                  (
                  {{ row.percentage !== null && row.percentage > 0 ? '+' : '' }}
                  {{ row.percentage !== null ? `${row.percentage.toFixed(1)}%` : '-' }}
                  )
                </div>
              </template>

              <template v-else>-</template>
            </td>
          </template>

          <td v-else class="px-2 py-2 text-base tabular-nums font-bold">
            <div>{{ row.rollingYear.total?.toFixed(1) ?? '-'}}</div>

            <div
              v-if="row.rollingYear.missingMonths.length > 0"
              class="text-[10px] leading-tight text-amber-400"
            >
              {{ $t('wording.missingData') }}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
