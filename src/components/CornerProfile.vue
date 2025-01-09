<script setup>
//username is taken from pinia
import { ref, onMounted, watch } from "vue";
import LocalStorage from "../services/LocalStorage";
import { useProfileStore } from "../stores/profile";

const emits = defineEmits(["loggedOut"]);
const profileStore = useProfileStore();

const dropdown = ref(false);

function openLogoutMenu() {
  dropdown.value = !dropdown.value;
}
function logout() {
  emits("loggedOut");
}

watch(
  () => profileStore.getProfileInfo,
  (newVal) => {
    if (newVal) {
      username.value = LocalStorage.getUsername();
    }
  }
);

const username = ref(null);
onMounted(() => {
  if (LocalStorage.id()) {
    username.value = LocalStorage.getUsername();
  }
});
</script>
<template>
  <div class="mainCorner">
    <div class="corner" @click="openLogoutMenu">
      <p>
        {{ username }}
        <span> <font-awesome-icon :icon="['fas', 'chevron-down']" /></span>
      </p>
    </div>
    <div class="logOut" v-show="dropdown" @click="logout">Log Out</div>
  </div>
</template>
<style scoped>
.mainCorner {
  position: relative;
}
.corner {
  position: relative;
  margin-right: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50%;
  user-select: none;
}
.corner:hover {
  cursor: pointer;
}

.corner p {
  font-size: 1.1em;
  color: #fff;
  margin: 0px;
}
.corner span {
  color: #fff;
  font-size: 1.3em;
}

.corner:hover {
  cursor: pointer;
}
.logOut {
  position: absolute;
  padding: 10px 10px;
  width: 100%;
  font-size: large;
  font-weight: 700;
  bottom: -71.5px;
  right: 0px;
  color: aliceblue;
  margin-right: 10px;
  text-align: center;
  cursor: pointer;
  border-radius: 10px;
  border: 1px solid #fff;
  background: rgba(255, 255, 255, 0.024);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  user-select: none;
}
.logOut:hover {
  border: 2px solid #0f0;
  box-shadow: 0 0 5px #0f0;
}
.logOut:active {
  box-shadow: 2px 2px 10px #0f0;
}
</style>
