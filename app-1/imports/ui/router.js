import { createRouter, createWebHistory } from 'vue-router'
import Home from './Home.vue'
import About from './About.vue'

export const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/about',
    name: 'about',
    component: About,
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
