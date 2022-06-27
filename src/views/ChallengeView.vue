<template>
  <div class="content">
    <h1>This is an challenge page for {{ path }} on page {{ page }}</h1>
    <div>
      <router-link
        :to="{ name: 'path', params: { path: 'python', page: 'Python1' } }"
      >
        Python1
      </router-link>
      <router-link
        :to="{ name: 'path', params: { path: 'python', page: 'Python2' } }"
      >
        Python2
      </router-link>
    </div>
    <div v-if="challenge">
      <pre>{{ challenge.code }}</pre>
      <button
        v-for="func in challenge.solve"
        :key="func.name"
        class="bg-green px-4 py-1 rounded rounded-sm"
      >
        {{ func.name }}: {{ args(func) }}
      </button>
    </div>
  </div>
  <RouterView />
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from "vue";
import hljs from "highlight.js";
import type { Challenge } from "@/types/Challenge";

export default defineComponent({
  props: {
    path: {
      type: String,
      required: true,
    },
    page: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const challenge = ref<Challenge | undefined>(undefined);

    const fetchChallenge = () => {
      import(`../paths/${props.path}/${props.page}.ts`)
        .then((val) => {
          // val is a Module has default
          challenge.value = val.default;
        })
        .catch(() => {
          challenge.value = undefined;
        });
    };

    watch(
      () => props.page + props.path,
      async (newVal, oldVal) => {
        fetchChallenge();
      }
    );

    var args = (func: Function) => {
      const regex = new RegExp(
        "(?:" + func.name + "\\s*|^)\\s*\\((.*?)\\)"
      ).exec(func.toString().replace(/\n/g, ""));
      if (regex?.length && regex?.length > 1) {
        const params = regex[1].replace(/\/\*.*?\*\//g, "").replace(/ /g, "");
        if (params.length > 0) return params.split(",");
      }
      return [];
    };

    fetchChallenge();

    return { challenge, args };
  },
});
</script>
