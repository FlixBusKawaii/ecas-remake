<script setup lang="ts">
import type { MonthlyStat } from '../types';

defineProps<{
  stats: MonthlyStat[];
}>();
</script>

<template>
  <div class="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900">
    <table class="w-full text-[11px]">
      <thead class="border-b border-slate-800 bg-slate-800/50">
        <tr>
          <th class="px-2 py-1.5 text-left font-semibold text-slate-300">
            Month
          </th>

          <th class="px-2 py-1.5 text-left font-semibold text-slate-300">
            Cons.
          </th>

          <th class="px-2 py-1.5 text-left font-semibold text-slate-300">
            Prev.
          </th>

          <th class="px-2 py-1.5 text-left font-semibold text-slate-300">
            Diff.
          </th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="stat in stats"
          :key="stat.month"
          class="border-b border-slate-800 last:border-b-0"
        >
          <td class="px-2 py-1.5">
            {{ stat.month }}
          </td>

          <td class="px-2 py-1.5 tabular-nums">
            {{
              stat.consumption !== null
                ? `${stat.consumption.toFixed(1)}`
                : '-'
            }}
          </td>

          <td class="px-2 py-1.5 tabular-nums text-slate-400">
            {{
              stat.previousYear !== null
                ? `${stat.previousYear.toFixed(1)}`
                : '-'
            }}
          </td>

          <td
            class="px-2 py-1.5 tabular-nums"
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

              <div class="text-[9px] leading-none opacity-80">
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
