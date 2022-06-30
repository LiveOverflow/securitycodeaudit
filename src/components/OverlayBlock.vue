<template>
  <div class="fixed z-10 inset-0 overflow-y-auto" @click="$emit('clickClose')">
    <div
      class="flex items-end items-center justify-center min-h-screen p-4 p-0 bg-darker bg-opacity-75"
    >
    <div class="fade-in bg-dark rounded rounded-lg p-5 drop-shadow-[0_15px_15px_rgba(0,0,0,0.3)]" @click.stop>
    <div @click="$emit('clickClose')" class="float-right cursor-pointer text-white text-opacity-50 hover:text-opacity-100 hover:text-red">
        <i class="fa-solid fa-x "></i>
    </div>
        <slot></slot>
        </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from "vue";

export default defineComponent({
  //props: {},
  emits: ['clickClose'],
  setup(props) {
    return {};
  },
  components: {},
});
</script>
