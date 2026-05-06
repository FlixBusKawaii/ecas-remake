<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { importData } from '../services/import';
import { db } from '../services/db';
import type { Meter, Reading } from '../types';

const meters = ref<Meter[]>([]);
const readings = ref<Reading[]>([]);

const limit = ref(10);

onMounted(async () => {
  const count = await db.meters.count();

  if (count === 0) {
    await importData();
  }

  meters.value = await db.meters.toArray();
  readings.value = await db.readings.toArray();
});
</script>

<template>
  <div>
    <h1>Test Import</h1>

    <h2>Compteurs</h2>
    <ul>
      <li v-for="m in meters" :key="m.id">
        {{ m.name }} ({{ m.unit }})
      </li>
    </ul>

    <h2>Relevés</h2>
    <ul>
      <li v-for="r in readings.slice(0, limit)" :key="r.id">
        {{ r.value }} — {{ r.date }}
      </li>
    </ul>
    <button @click="limit += 20">Load more</button>
  </div>
</template>