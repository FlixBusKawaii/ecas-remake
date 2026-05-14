import { createRouter, createWebHistory } from 'vue-router';
import TestImport from './views/TestImport.vue';
import HomeView from './views/HomeView.vue';
import ReadingsView from './views/ReadingsView.vue';
import StatisticsView from './views/StatisticsView.vue';

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/test',
    component: TestImport
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
];

export const router = createRouter({
  history: createWebHistory(),
  routes
});