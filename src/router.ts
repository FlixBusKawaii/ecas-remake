import { createRouter, createWebHistory } from 'vue-router';
import HomeView from './views/HomeView.vue';
import ReadingsView from './views/ReadingsView.vue';
import StatisticsView from './views/StatisticsView.vue';
import SettingsView from './views/SettingsView.vue';

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
];

export const router = createRouter({
  history: createWebHistory(),
  routes
});