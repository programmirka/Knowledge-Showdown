import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useBetaStore = defineStore("beta", () => {
  const key = ref(null);

  const setKey = () => {
    key.value = 0;
  };

  const getKey = computed(() => {
    return key.value;
  });

  const increment = () => {
    key.value++;
  };

  return {
    setKey,
    getKey,
    increment,
  };
});
