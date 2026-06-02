<script setup>
import { ref } from 'vue'

const count = ref(0)

function increment() {
  count.value++
}

function decrement() {
  count.value--
}
</script>

<template>
  <button @click="increment" class="bg-green-700 hover:bg-green-900 text-white py-2 px-4 rounded">Click Me</button>
  <button @click="decrement" class="bg-red-700 hover:bg-red-900 text-white py-2 px-4 rounded ml-2">Decrement</button>
  <p>
    You've pressed the button <strong>{{ count }}</strong> times.
  </p>
</template>
