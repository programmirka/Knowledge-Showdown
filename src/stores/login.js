import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useLoginStore = defineStore("login", () => {
  const sessionUser = ref(null);
  const sid = ref(null);

  const setSessionUser = (data) => {
    sessionUser.value = data;
  };

  const getSessionUser = computed(() => {
    return sessionUser.value;
  });

  const setSid = (data) => {
    sid.value = data;
  };

  const getSid = computed(() => {
    return sid.value;
  });

  return {
    setSessionUser,
    getSessionUser,
    setSid,
    getSid,
  };
});
