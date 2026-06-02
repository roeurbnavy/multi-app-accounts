<script setup>
import { ref, onUnmounted, onMounted } from "vue";
import { Meteor } from "meteor/meteor";
import { Tracker } from "meteor/tracker";
import AppMenu from "./components/AppMenu.vue";
import LoginForm from "./components/LoginForm.vue";
import { getRemoteConnection } from "./utils/ddp.js";

const userId = ref(null);
const username = ref("");
const isLoggingIn = ref(true);

let computation = null;

onMounted(() => {
  // Proactively fetch app1's remote connection to trigger auth sync
  getRemoteConnection("app1", 4000);

  computation = Tracker.autorun(() => {
    userId.value = Meteor.userId();
    isLoggingIn.value = Meteor.loggingIn();
    const user = Meteor.user();
    username.value = user ? user.username : "";
  });
});

onUnmounted(() => {
  if (computation) computation.stop();
});

const handleLogout = () => {
  Meteor.logout();
};
</script>

<template>
  <!-- Loading state -->
  <div
    v-if="isLoggingIn"
    class="fixed inset-0 flex items-center justify-center bg-[#0d0e12] text-white"
  >
    <div class="text-center">
      <svg
        class="animate-spin h-8 w-8 text-purple-500 mx-auto mb-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <span class="text-slate-400 font-medium">Verifying Session...</span>
    </div>
  </div>

  <!-- Authenticated application shell -->
  <div
    v-else-if="userId"
    class="min-h-screen bg-slate-900 text-slate-100 font-sans p-8"
  >
    <header
      class="max-w-7xl mx-auto flex justify-between items-center pb-6 mb-8 border-b border-slate-800"
    >
      <div class="flex items-center gap-6">
        <h1 class="text-xl font-black text-purple-400 tracking-wider">Host Application A (Port 3000)</h1>
        <AppMenu />
      </div>
      <div
        class="flex items-center gap-4 bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700/50"
      >
        <span class="text-sm font-semibold text-slate-300">
          User: <span class="text-purple-400 font-bold">{{ username }}</span>
        </span>
        <button
          @click="handleLogout"
          class="bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold px-3 py-1.5 rounded-lg border border-red-500/20 active:scale-95 transition-all cursor-pointer"
        >
          Logout
        </button>
      </div>
    </header>

    <main class="max-w-7xl mx-auto bg-slate-900">
      <router-view />
    </main>
  </div>

  <!-- Unauthenticated Login Form -->
  <LoginForm v-else />
</template>
