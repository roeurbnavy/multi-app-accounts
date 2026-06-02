<script setup>
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
      title: "From Host B",
      url: "https://test-b.com",
    },
    (err, res) => {
      if (err) {
        console.log(err);
      } else {
        alert("Data inserted successfully in app-1 from Host B!");
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
  <h2 class="text-xl my-6 font-semibold">Links (Database: main-b-db)</h2>
  <button
    @click="addDataRemote()"
    class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4 shadow cursor-pointer active:scale-95 transition-all"
  >
    Add Data to Remote App-1
  </button>
  <div class="flex gap-4 mb-4">
    <input
      type="text"
      v-model="form.title"
      placeholder="Title"
      class="border border-slate-700 bg-slate-800 text-white rounded px-4 py-2"
    />
    <input
      type="text"
      v-model="form.url"
      placeholder="URL"
      class="border border-slate-700 bg-slate-800 text-white rounded px-4 py-2"
    />
    <button
      @click="form._id ? updateItem() : insertItem()"
      class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
    >
      {{ form._id ? "Update" : "Insert" }}
    </button>
  </div>

  <ul class="list-disc underline">
    <li v-for="link of links" :key="link._id" class="hover:text-green-400 mb-2">
      <a :href="link.url" target="_blank">{{ link.title }}</a>
      <button
        class="bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold py-1.5 px-3 rounded ml-4 border border-red-500/20 cursor-pointer"
        @click="deleteItem(link._id)"
      >
        Delete
      </button>
      <button
        class="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-xs font-bold py-1.5 px-3 rounded ml-2 border border-blue-500/20 cursor-pointer"
        @click="editItem(link._id)"
      >
        Update
      </button>
    </li>
  </ul>
</template>
