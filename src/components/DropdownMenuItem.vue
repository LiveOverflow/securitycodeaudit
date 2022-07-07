<template>
  <div class="relative flex group" @mouseleave="!isTouchDevice ? closeDropdown() : undefined">
    <span
      class="hover:text-opacity-100 cursor-pointer transition border-b-2 text-white px-5 py-2"
      @click="clickDropdown"
      @mouseenter="!isTouchDevice ? openDropdown() : undefined"
      :class="
        $route.matched.some(
          ({ name }) =>
            route_match && name?.toString().indexOf(route_match) != -1
        )
          ? 'border-green text-opacity-100'
          : 'border-dark text-opacity-50'
      "
      >{{ title }}</span
    >
    <div
      class="absolute z-50 w-auto opacity-0 shadow-2xl transition bg-dark mt-10 rounded-b-lg overflow-hidden"
      :class="{ 'opacity-100 ': dropDownShown, 'pointer-events-none': !dropDownShown }"
    >
      <div class="border-t-4 border-green  pt-3 whitespace-nowrap">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, toRefs } from "vue";
import { useRouter, onBeforeRouteLeave, onBeforeRouteUpdate } from "vue-router";
const router = useRouter();

const props = defineProps<{
  to?: object;
  route_match?: string;
  title: string;
}>();

const { to } = toRefs(props);

const dropDownShown = ref(false);

const isTouchDevice =
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.maxTouchPoints > 0;

const closeDropdown = () => {
  console.log("reset focus.");
  dropDownShown.value = false;
document.removeEventListener('click', closeDropdown);
};

onBeforeRouteUpdate((to, from) => {
  console.log("onBeforeRouteUpdate");
  closeDropdown();
});

const clickDropdown = (event: MouseEvent) => {
  

  if (dropDownShown.value) {
    closeDropdown();
    if (props.to) {
        router.push(props.to);
    }
  } else if (isTouchDevice && !dropDownShown.value) {

    openDropdown();
    console.log("touch click");
    setTimeout(() =>document.addEventListener('click', closeDropdown), 200);

  } 
};

const openDropdown = () => {
  dropDownShown.value = true;
};
</script>
