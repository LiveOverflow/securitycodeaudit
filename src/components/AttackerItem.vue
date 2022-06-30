<template>
  <div class="p-3 bg-dark rounded rounded-lg flex flex-col">
    <div class="font-bold text-lg">{{ name }}</div>
    <div class="text-sm text-white text-opacity-50 flex-grow">
      {{ description }}
    </div>
    <div class="mt-2">
      <span v-if="requestsPerMs * 1000 >= 1">
        {{ requestsPerMs * 1000 }} attempts per second
      </span>
      <span v-else> {{ 1 / (requestsPerMs * 1000) }} seconds per attempt </span>
    </div>
    <div
      class="mt-2 transition bg-gradient-to-r rounded rounded-lg py-2 px-3"
      :class="{
        'from-red': withoutReplacementTime < threshold && !notify_victim  && !lockout,
        'from-yellow': withoutReplacementTime < threshold && notify_victim && !lockout,
        'from-green': withoutReplacementTime >= threshold || lockout,
        'via-yellow':
          withReplacementTime < threshold != withoutReplacementTime < threshold && !lockout,
        'to-red': withReplacementTime < threshold && !notify_victim && !lockout,
        'to-yellow': withReplacementTime < threshold && notify_victim && !lockout,
        'to-green': withReplacementTime >= threshold || lockout,
      }"
    >
      <div class="flex-row flex justify-center">
        <div>
          {{
            humanizeDuration(withoutReplacementTime, {
              largest: 1,
              round: true,
            })
          }}
        </div>
        <div class="mx-2">-</div>
        <div>
          {{
            humanizeDuration(withReplacementTime, {
              largest: 1,
              round: true,
            })
          }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from "vue";
import humanizeDuration from "humanize-duration";
import slider from "vue3-slider";

export default defineComponent({
  props: {
    binominal_distribution: {
      type: Number,
      required: true,
    },
    hypergeometric_distribution: {
      type: Number,
      required: true,
    },
    threshold: {
      type: Number,
      required: true,
    },
    target_certainty: {
      type: Number,
      required: true,
    },
    requestsPerMs: {
      type: Number,
      required: true,
    },
    notify_victim: {
      type: Boolean,
      required: true,
    },
    lockout: {
      type: Boolean,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const withoutReplacementTime = computed(() =>
      Math.ceil(props.hypergeometric_distribution / props.requestsPerMs)
    );
    const withReplacementTime = computed(() =>
      Math.ceil(props.binominal_distribution / props.requestsPerMs)
    );
    const tailwindcss = {
      theme: {
        colors: {
          transparent: "transparent",
          current: "currentColor",

          black: "#131A21",
          blacker: "#000000",
          white: "#ffffff",

          red: "#DD4B21",
          green: "#16c1a2",

          yellow: "#D8AD66",
          purple: "#681FC4",
          blue: "#0EC7F0",
          orange: "#FF8A00",
          pink: "#DC2CEC",

          light: "#f5f5f9",

          dark: "#1f2129",
          darker: "#151519",
        },
      },
    };

    return {
      humanizeDuration,
      withoutReplacementTime,
      withReplacementTime,
      tailwindcss,
    };
  },
  components: { slider },
});
</script>
