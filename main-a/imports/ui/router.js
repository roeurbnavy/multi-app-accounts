import { ref } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import Home from "./views/Home.vue";
import About from "./views/About.vue";

// Reactive flag indicating whether the remote application routes have loaded successfully
export const isRemoteLoaded = ref(false);

// 1. Create the router with host routes only
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
  ],
});

// 2. Dynamically load remote routes and register them if app1 is running
import("app1/router")
  .then(({ routes: remoteRoutes }) => {
    remoteRoutes.forEach((route) => {
      router.addRoute({
        path: `/remote${route.path === "/" ? "" : route.path}`,
        name: `remote-${route.name}`,
        component: route.component,
      });
    });
    isRemoteLoaded.value = true;
    console.log("Successfully loaded and registered remote routes from app1.");
  })
  .catch((err) => {
    console.warn(
      "Could not load remote 'app1'. Running main-a standalone without remote routes.",
      err
    );
  });
