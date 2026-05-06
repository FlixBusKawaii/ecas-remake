import { createRouter, createWebHistory } from 'vue-router';
import TestImport from './views/TestImport.vue';

const routes = [
  {
    path: '/',
    redirect: '/test'
  },
  {
    path: '/test',
    component: TestImport
  }
];

export const router = createRouter({
  history: createWebHistory(),
  routes
});