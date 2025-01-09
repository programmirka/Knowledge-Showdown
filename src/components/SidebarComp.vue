<script setup>
import LocalStorage from "../services/LocalStorage";
import Permissions from "../services/Permissions";
import { onBeforeUpdate, ref } from "vue";
import { useLoginStore } from "@/stores/login.js";
import { useBetaStore } from "../stores/betaBlast";
import { useProfileStore } from "../stores/profile";

const betaStore = useBetaStore();
const profileStore = useProfileStore();
const LoginStore = useLoginStore();

const props = defineProps(["sideBarViewability"]);
const emits = defineEmits(["updateKey"]);

const id = ref("");
const user_all = 5;
const que_all = 16;
const cat_all = 10;
const user_all_check = ref(false);
const que_all_check = ref(false);
const cat_all_check = ref(false);

function updateKey() {
  emits("updateKey");
}

onBeforeUpdate(() => {
  user_all_check.value = Permissions.checkPermission(user_all);
  que_all_check.value = Permissions.checkPermission(que_all);
  cat_all_check.value = Permissions.checkPermission(cat_all);

  if (LocalStorage.getUser()) {
    id.value = LocalStorage.id();
  } else {
    id.value = "";
  }
});

// TODO: Dodaj uslove (v-if) za ove rute, kad je auth user kad je admin ili superadmin
</script>
<template>
  <nav v-show="sideBarViewability" class="dropdown-content">
    <li>
      <RouterLink
        class="special-button"
        :to="{ name: 'beta-blast' }"
        @click.native="betaStore.increment"
      >
        Beta Blast</RouterLink
      >
    </li>
    <li>
      <RouterLink :to="{ name: 'home' }">
        <font-awesome-icon :icon="['far', 'lightbulb']" /> Quizzes</RouterLink
      >
    </li>
    <li>
      <RouterLink
        :to="{ name: 'profile-details', params: { id: id } }"
        v-if="LoginStore.getSessionUser !== null"
        ><font-awesome-icon :icon="['fas', 'user']" /> Profile
      </RouterLink>
    </li>
    <li>
      <RouterLink :to="{ name: 'leaderboards' }"
        ><font-awesome-icon :icon="['fas', 'ranking-star']" /> Leaderboards
      </RouterLink>
    </li>
    <li>
      <RouterLink :to="{ name: 'about' }"
        ><font-awesome-icon :icon="['fas', 'circle-info']" /> About
      </RouterLink>
    </li>
    <li v-if="LoginStore.getSessionUser !== null">
      <RouterLink :to="{ name: 'admin' }" v-if="user_all_check">
        <font-awesome-icon :icon="['fas', 'gear']" /> Admin
      </RouterLink>
      <RouterLink
        :to="{ name: 'questions' }"
        v-if="!user_all_check && que_all_check"
      >
        <font-awesome-icon :icon="['fas', 'gear']" /> Admin
      </RouterLink>
      <RouterLink
        :to="{ name: 'categories' }"
        v-if="!user_all_check && !que_all_check && cat_all_check"
      >
        <font-awesome-icon :icon="['fas', 'gear']" /> Admin
      </RouterLink>
      <ul>
        <li v-if="user_all_check && (que_all_check || cat_all_check)">
          <RouterLink :to="{ name: 'admin' }">Users</RouterLink>
        </li>
        <li v-if="que_all_check && (user_all_check || cat_all_check)">
          <RouterLink :to="{ name: 'questions' }">Questions</RouterLink>
        </li>
        <li v-if="cat_all_check && (user_all_check || que)">
          <RouterLink :to="{ name: 'categories' }">Categories</RouterLink>
        </li>
      </ul>
    </li>
  </nav>
</template>
<style scoped>
.dropdown-content {
  position: absolute;
  top: 100%;
  min-width: 160px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 5px;
  z-index: 5000;
}
.dropdown-content li {
  list-style-type: none;
  position: relative;
}

.dropdown-content li a {
  color: #ffffff;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  transition: background-color 0.3s;
}

.dropdown-content a:hover {
  /* background-color: #3498db; */
  background: linear-gradient(135deg, rgba(34, 163, 255, 0.653), #c534dbb1);
  color: #fff;
  border-radius: 5px;
}

.dropdown-content li ul {
  display: none;
  position: absolute;
  top: 0px;
  left: 100%;
  /* background-color: #f4f4f4; */
  padding: 12px 16px;
  padding: 0px;
  margin: 0px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 5px;
}
.dropdown-content li:hover > ul {
  display: block;
}

.special-button {
  background: transparent;
  color: #fff;
  padding: 10px 15px;
  border: 2px solid #0f0;
  border-radius: 5px;
  text-align: center;
  display: block;
  margin: 5px 0;
  text-decoration: none;
  font-weight: bold;
  box-shadow: 0 0 5px #0f0;
  transition: box-shadow 0.3s, transform 0.3s;
  cursor: pointer;
}
.special-button:hover {
  box-shadow: 0 0 8px #0f0;
  transform: translateY(-2px);
}

@media (min-width: 640px) {
}

@media (min-width: 768px) {
}

@media (min-width: 1024px) {
}

@media (min-width: 640px) and (orientation: landscape) {
}
</style>
