<script setup lang="ts">
import type { EnrichedReading } from '../types';

defineProps<{
  readings: EnrichedReading[];
}>();
</script>

<template>
  <ul>

    <li
      v-for="r in readings"
      :key="r.id"
    >

      <strong>
        {{ r.value }} kWh
      </strong>

      <div>
        {{ r.date }}
      </div>

      <template
        v-if="r.consumption !== undefined"
      >

        <div>
          Consumption:
          {{ r.consumption }} kWh
        </div>

        <div>
          Days:
          {{ r.days?.toFixed(2) }}
        </div>

      </template>

    </li>

  </ul>
</template>