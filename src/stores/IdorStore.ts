import { defineStore } from "pinia";

// useStore could be anything like useUser, useCart
// the first argument is a unique id of the store across your application
export const useIdorStore = defineStore("idorStore", {
  // state
  state: () => {
    return {
      length: 6,
      max_length: 32,
      nr_requests: 3000,
      notify_victim: false,
      online: true,
      alphabet: "0123456789",
      start_value_str: "",
      correct_guesses: 1n,
      target_certainty: 0.95,
      threat_multiplier: 1,
      lockout: false,
    };
  },
  // actions

  // getters
});
