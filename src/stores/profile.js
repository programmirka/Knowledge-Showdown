import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useProfileStore = defineStore("Profile", () => {
  const profileInfo = ref({});

  const setProfileInfo = (data) => {
    profileInfo.value = data;
  };

  const getProfileInfo = computed(() => {
    return profileInfo.value;
  });

  return {
    setProfileInfo,
    getProfileInfo,
  };
});
