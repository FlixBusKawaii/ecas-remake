<script setup lang="ts">
import HomeIcon from './icons/HomeIcon.vue';
import ReadingsIcon from './icons/ReadingsIcon.vue';
import StatsIcon from './icons/StatsIcon.vue';
</script>

<template>
  <nav class="border-t border-slate-800 bg-slate-900">
    <ul class="grid grid-cols-3">
      <li>
        <RouterLink
          to="/home"
          class="flex flex-col items-center gap-1 px-2 py-3 text-xs border-r border-r-white"
        >
          <HomeIcon class="h-6 w-6 text-white" />
          <span>Home</span>
        </RouterLink>
      </li>

      <li>
        <RouterLink
          to="/reads"
          class="flex flex-col items-center gap-1 px-2 py-3 text-xs border-r border-r-white"
        >
          <ReadingsIcon class="h-6 w-6" />
          <span>Readings</span>
        </RouterLink>
      </li>

      <li>
        <RouterLink
          to="/stats"
          class="flex flex-col items-center gap-1 px-2 py-3 text-xs"
        >
          <StatsIcon class="h-6 w-6" />
          <span>Stats</span>
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>
