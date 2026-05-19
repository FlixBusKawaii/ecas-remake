<script setup lang="ts">
import { computed } from 'vue';
import { i18n, setLocale } from '../i18n';
import { importData } from '../services/import';
import { exportData } from '../services/export';

async function handleExport() {
  await exportData();
}

async function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (!file) {
    return;
  }

  if (!confirm('This will replace all current data. Continue?')) {
    return;
  }

  await importData(file);
}

const locale = computed({
  get: () => i18n.global.locale.value,
  set: (value: 'fr' | 'en') => setLocale(value)
})
</script>

<template>
  <div class="space-y-4">
    <h1>{{ $t('nav.settings') }}</h1>

    <button @click="handleExport" class="w-full">
      {{$t('actions.exportData')}}
    </button>

    <label
      for="import"
      class="mb-1 block text-sm font-medium text-slate-300"
    >{{$t('actions.importData')}}
    </label>
    <input
      id="import"
      type="file"
      accept=".json,application/json"
      @change="handleFileChange"
      class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder-slate-500"
    />

    <label
      for="language"
      class="mb-1 block text-sm font-medium text-slate-300"
    >{{$t('actions.changeLanguage')}}
    </label>
    <select
      id="language"
      v-model="locale"
      class="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white"
    >
      <option value="fr">🇫🇷 Français</option>
      <option value="en">🇬🇧 English</option>
    </select>
  </div>
  <footer class="mt-8 border-t border-slate-700 pt-2">
    <div class="flex flex-col items-center text-xs text-slate-400">
      <img
        src="../assets/avatarfbk.png"
        alt="FlixBusKawaii"
        class="h-12 w-10"
      />

      <span>{{ $t('wording.developped') }}</span>
    </div>
  </footer>
</template>
