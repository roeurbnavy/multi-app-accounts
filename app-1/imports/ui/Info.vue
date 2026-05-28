<script setup>
import { ref } from "vue";
import { getRemoteConnection } from "./utils/ddp";

const connection = getRemoteConnection("app1", 4000);

const links = ref([]);
const fetchData = async () => {
  const data = await connection.callAsync("api/find");
  links.value = data;
};

const addLink = async () => {
  await connection.callAsync("api/insert");
  fetchData();
};

const updateLink = async (id) => {
  await connection.callAsync("api/update", id);
  fetchData();
};

const removeLink = async (id) => {
  await connection.callAsync("api/remove", id);
  fetchData();
};

fetchData();
</script>

<template>
  <h2 class="text-xl my-6 font-semibold">Learn Meteor!</h2>
  <ul class="list-disc underline">
    <li v-for="link of links" :key="link._id" class="hover:text-green-700 pb-1">
      <a :href="link.url" target="_blank">{{ link.title }}</a>
      <button
        class="bg-green-700 hover:bg-green-900 text-white py-2 px-4 rounded mx-1"
        @click="updateLink(link._id)"
      >
        Update
      </button>
      <button
        class="bg-red-700 hover:bg-red-900 text-white py-2 px-4 rounded"
        @click="removeLink(link._id)"
      >
        Remove
      </button>
    </li>
  </ul>
  <button
    class="bg-blue-700 hover:bg-blue-900 text-white py-2 px-4 rounded"
    @click="addLink"
  >
    Add
  </button>
</template>
