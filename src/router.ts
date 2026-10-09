import { createRouter, createWebHistory } from 'vue-router';
import HomeView from './views/HomeView.vue';
import ReadingsView from './views/ReadingsView.vue';
import StatisticsView from './views/StatisticsView.vue';
import SettingsView from './views/SettingsView.vue';
import PeriodStatsView from './views/PeriodStatsView.vue';

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    component: HomeView
  },
  {
    path: '/reads',
    component: ReadingsView
  },
  {
    path: '/stats',
    component: StatisticsView
  },
  {
    path: '/settings',
    component: SettingsView
  },
  {
    path: '/period-stats',
    component: PeriodStatsView
  }
];

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});
