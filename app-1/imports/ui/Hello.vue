<script setup>
import { computed } from "vue";
import { store } from "./store";

const count = computed(() => store.state.counter);

function increment() {
  store.commit("increment");
}
const incrementAsync = () => store.dispatch("incrementAsync");
</script>

<template>
  <button
    class="bg-green-700 hover:bg-green-900 text-white py-2 px-4 rounded mr-1"
    @click="increment"
  >
    Increment
  </button>
  <button
    class="bg-green-700 hover:bg-green-900 text-white py-2 px-4 rounded"
    @click="incrementAsync"
  >
    Increment Async (1s)
  </button>
  <p class="text-red-500 font-bold">
    You've pressed the button {{ count }} times.
  </p>
</template>
