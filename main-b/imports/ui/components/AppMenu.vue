<script setup>
import { isRemoteLoaded } from "../router.js";
</script>

<template>
  <nav class="flex items-center text-sm font-medium">
    <router-link :to="{ name: 'home' }" class="mr-4 text-slate-300 hover:text-green-400 transition-colors">Home</router-link>
    <router-link :to="{ name: 'about' }" class="mr-4 text-slate-300 hover:text-green-400 transition-colors">About</router-link>
    <template v-if="isRemoteLoaded">
      <router-link :to="{ name: 'remote-home' }" class="mr-4 text-blue-400 hover:text-blue-300 transition-colors">Remote Home</router-link>
      <router-link :to="{ name: 'remote-about' }" class="mr-4 text-blue-400 hover:text-blue-300 transition-colors">Remote About</router-link>
      <router-link :to="{ name: 'remote-federation' }" class="mr-4 text-blue-400 hover:text-blue-300 transition-colors">Remote Federation</router-link>
      <router-link :to="{ name: 'remote-todos' }" class="mr-4 text-blue-400 hover:text-blue-300 transition-colors">Remote Todo List</router-link>
    </template>
  </nav>
</template>
