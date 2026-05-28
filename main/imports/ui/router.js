import { createRouter, createWebHistory } from "vue-router";
import Home from "./views/Home.vue";
import About from "./views/About.vue";

// 1. Import the remote routes array
import { routes as remoteRoutes } from "app1/router";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/about",
      name: "about",
      component: About,
    },
    // 2. Map and append remote routes (prefixed with '/remote')
    ...remoteRoutes.map((route) => ({
      path: `/remote${route.path === "/" ? "" : route.path}`,
      name: `remote-${route.name}`,
      component: route.component,
    })),
  ],
});
