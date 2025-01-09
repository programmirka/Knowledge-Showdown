<script setup>
import LoginModal from "./LoginModal.vue";
import RegisterModal from "./RegisterModal.vue";
import { useLoginStore } from "@/stores/login.js";
import { ref } from "vue";

const loginStore = useLoginStore();
const props = defineProps(["name", "id", "img"]);
const loginModalVisibility = ref(false);
const registerModalVisibility = ref(false);

function openRegister() {
  loginModalVisibility.value = false;
  registerModalVisibility.value = true;
}

function openLogin() {
  loginModalVisibility.value = true;
  registerModalVisibility.value = false;
}

function loggedInHandler(sessionUserObj) {
  try {
    loginStore.setSessionUser(sessionUserObj);
  } catch (e) {
    alert(new Error(e));
  }
}
</script>
<template>
  <div title="Click to play">
    <RouterLink
      v-if="loginStore.getSessionUser"
      :to="{ name: 'quiz', params: { cat_id: id } }"
      class="login-btn categoryCardLink"
    >
      <div
        class="categoryCard"
        :style="{ backgroundImage: 'url(' + img + ')' }"
      >
        <p>{{ name }}</p>
      </div>
    </RouterLink>
    <div
      title="Click to play"
      v-else
      @click="loginModalVisibility = true"
      class="login-btn categoryCardLink"
    >
      <div
        class="categoryCard"
        :style="{ backgroundImage: 'url(' + img + ')' }"
      >
        <p>{{ name }}</p>
      </div>
    </div>
  </div>

  <RegisterModal
    @close="registerModalVisibility = false"
    :registerModalVisibility="registerModalVisibility"
    @openLoginModal="openLogin"
  ></RegisterModal>

  <LoginModal
    @openRegister="openRegister"
    @close="loginModalVisibility = false"
    :loginModalVisibility="loginModalVisibility"
    @openedBetaBlast="loginModalVisibility = false"
    @loggedIn="loggedInHandler"
  ></LoginModal>
</template>
<style scoped>
.categoryCard {
  flex-shrink: 0; /* vidi za querije */
  width: 15vw;
  height: 25vh;
  min-height: 300px;
  min-width: 300px;
  overflow: hidden;
  background-size: cover;
  background-repeat: no-repeat;
  background-image: url({{img}});
  border-left: 0.5px rgba(255, 255, 255, 0.459) solid;
  border-bottom: 0.5px rgba(255, 255, 255, 0.514) solid;
  position: relative;
  border-radius: 20px;
  background-position: bottom;
  transition: all 0.5s;
  opacity: 0.8;
  margin: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: -3px 5px 12px -1px rgba(0, 0, 0, 0.559);
  border: #f8f8f8 1px solid;
}

.categoryCard:hover {
  box-shadow: -10px 30px 12px -1px rgba(0, 0, 0, 0.299);
  border: #21f505 1px solid;
}
.categoryCard p {
  font-size: 2em;
  padding: 20px 20px;
  text-align: center;
  text-shadow: 2px 2px #373737;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(10px);
  font-family: "Anton", sans-serif;
  width: 100%;
}

.categoryCardLink {
  color: white;
  text-decoration: none;
  text-shadow: red;
}

.categoryCard a:hover,
.login-btn:hover {
  color: #fff;
}

.startBtn {
  z-index: 100;
  position: absolute;
  bottom: 15px;
  display: none;
}

.login-btn {
  color: white;
  padding: 12px 16px;
  text-decoration: none;
  transition: background-color 0.3s;

  border-radius: 10px;
  cursor: pointer;
}
img {
  margin-top: -40px;
  width: 100px;
  height: 150px;
  filter: drop-shadow(0 0 5px #f8f8f8);
}
.categoryCard:hover img {
  filter: drop-shadow(0 0 5px #21f505);
}
</style>
