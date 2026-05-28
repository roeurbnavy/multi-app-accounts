<script setup>
import { title } from "node:process";
import { onMounted, ref } from "vue";
import { getRemoteConnection } from "../utils/ddp";

const connection = getRemoteConnection("app1", 4000);

const links = ref([]);
const form = ref({
  title: "",
  url: "",
});

const addDataRemote = () => {
  connection.call(
    "api/insert",
    {
      title: "From Host",
      url: "https://test.com",
    },
    (err, res) => {
      if (err) {
        console.log(err);
      } else {
        // console.log(res);
        alert("Data inserted successfully");
      }
    },
  );
};

const fetchData = () => {
  Meteor.call("links.find", (err, res) => {
    if (err) {
      console.log(err);
    } else {
      links.value = res;
    }
  });
};

const deleteItem = (id) => {
  Meteor.call("links.delete", id, (err, res) => {
    if (err) {
      console.log(err);
    } else {
      fetchData();
    }
  });
};

const insertItem = () => {
  form.value.createdAt = new Date();

  Meteor.call("links.insert", form.value, (err, res) => {
    if (err) {
      console.log(err);
    } else {
      form.value = {
        title: "",
        url: "",
      };
      fetchData();
    }
  });
};

const editItem = (id) => {
  Meteor.call("links.findId", id, (err, res) => {
    if (err) {
      console.log(err);
    } else {
      form.value = res;
      console.log("form", form.value);
    }
  });
};

const updateItem = () => {
  Meteor.call("links.update", form.value, (err, res) => {
    if (err) {
      console.log(err);
    } else {
      form.value = {
        title: "",
        url: "",
      };
      fetchData();
    }
  });
};

onMounted(() => {
  fetchData();
});
</script>

<template>
  <h2 class="text-xl my-6 font-semibold">Learn Meteor!</h2>
  <button
    @click="addDataRemote()"
    class="bg-green-700 hover:bg-green-900 text-white py-2 px-4 rounded mb-3"
  >
    Add Data Remote
  </button>
  <div class="flex gap-4 mb-4">
    <input
      type="text"
      v-model="form.title"
      placeholder="Title"
      class="border border-gray-300 rounded px-4 py-2"
    />
    <input
      type="text"
      v-model="form.url"
      placeholder="URL"
      class="border border-gray-300 rounded px-4 py-2"
    />
    <button
      @click="form._id ? updateItem() : insertItem()"
      class="bg-green-700 hover:bg-green-900 text-white py-2 px-4 rounded"
    >
      {{ form._id ? "Update" : "Insert" }}
    </button>
  </div>

  <ul class="list-disc underline">
    <li v-for="link of links" :key="link._id" class="hover:text-green-700">
      <a :href="link.url" target="_blank">{{ link.title }}</a>
      <button
        class="bg-red-700 hover:bg-red-900 text-white py-2 px-4 rounded ml-2"
        @click="deleteItem(link._id)"
      >
        Delete
      </button>
      <button
        class="bg-blue-700 hover:bg-blue-900 text-white py-2 px-4 rounded ml-2"
        @click="editItem(link._id)"
      >
        Update
      </button>
    </li>
  </ul>
</template>
