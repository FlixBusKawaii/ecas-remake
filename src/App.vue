<script setup lang="ts">
import BottomNavigation from './components/BottomNavigation.vue';
import AppIcon from './components/icons/AppIcon.vue';

</script>

<template>
  <div class="min-h-screen bg-slate-950 text-white">
    <div class="mx-auto flex min-h-screen max-w-lg flex-col">
      <header class="border-b border-slate-800 px-4 py-3">
        <div class="flex items-center gap-3 ">
          <app-icon class="h-8 w-8 shrink-0"/>
          <h1 class="tracking-wide">ECAS</h1>
        </div>
      </header>

      <main class="flex-1 overflow-auto">
        <RouterView />
      </main>

      <bottom-navigation />
    </div>
  </div>
</template>
