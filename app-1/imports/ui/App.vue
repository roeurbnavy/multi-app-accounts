<script setup>
import AppMenu from './AppMenu.vue'
</script>

<template>
  <div class="min-h-screen w-full bg-slate-950 bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950/70 p-4 md:p-8 text-slate-200 selection:bg-indigo-500/30 selection:text-indigo-200">
    <div class="max-w-6xl mx-auto">
      <AppMenu />
      <main class="w-full">
        <router-view v-slot="{ Component }">
          <transition name="route" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<style>
/* Global route transition animation */
.route-enter-active,
.route-leave-active {
  transition: all 0.25s ease;
}

.route-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.route-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Base custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.6);
}
::-webkit-scrollbar-thumb {
  background: rgba(99, 102, 241, 0.3);
  border-radius: 9999px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(99, 102, 241, 0.5);
}
</style>
