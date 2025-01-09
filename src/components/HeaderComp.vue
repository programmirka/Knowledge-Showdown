<script setup>
import RegisterModal from "@/components/RegisterModal.vue";
import LoginModal from "@/components/LoginModal.vue";
import CornerProfile from "./CornerProfile.vue";
import LoginResource from "@/api/LoginResource.js";
import LocalStorage from "../services/LocalStorage";
import SidebarComp from "./SidebarComp.vue";
import { useLoginStore } from "@/stores/login.js";
import { useProfileStore } from "@/stores/profile.js";
import { ref } from "vue";
import { useRouter } from "vue-router";

const emits = defineEmits(["updateKey"]);

const loginStore = useLoginStore();
const profileStore = useProfileStore();
const router = useRouter();
const loginModalVisibility = ref(false);
const registerModalVisibility = ref(false);

const sideBarViewability = ref(false);

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

async function logoutApi() {
  return LoginResource.logout();
}

async function loggedOutHandler() {
  try {
    const response = await logoutApi();

    loginStore.setSessionUser(null);
    profileStore.setProfileInfo(null);

    LocalStorage.removeUser();
    LocalStorage.removeSid();
    LocalStorage.removeUsername();

    router.push({ name: "home" });
  } catch (err) {
    console.error(err);
  }
}

function updateKey() {
  emits("updateKey");
}
</script>
<template>
  <header class="header">
    <div class="dropdown">
      <div
        @click="sideBarViewability = !sideBarViewability"
        @mouseenter="sideBarViewability = true"
        class="bars dropbtn"
      >
        <font-awesome-icon :icon="['fas', 'bars']" size="xl" />
      </div>
        <div>
           <SidebarComp
        :sideBarViewability="sideBarViewability"
        @updateKey="updateKey"
      ></SidebarComp>
        </div>
     
    </div>
    <p class="logo">
      <img src="@/assets/112.png" />
      <a href="#">
        Knowledge <br />
        Showdown</a
      >
      <img src="@/assets/112.png" />
    </p>
    <CornerProfile
      v-if="loginStore.getSessionUser"
      @loggedOut="loggedOutHandler"
    />
    <div v-else class="signIn" @click="loginModalVisibility = true">
      <p><font-awesome-icon :icon="['fas', 'user']" /> LOG IN</p>
    </div>
  </header>
  <RegisterModal
    @close="registerModalVisibility = false"
    :registerModalVisibility="registerModalVisibility"
    @openLoginModal="openLogin"
  ></RegisterModal>

  <LoginModal
    @openRegister="openRegister"
    @close="loginModalVisibility = false"
    :loginModalVisibility="loginModalVisibility"
    @loggedIn="loggedInHandler"
    @openedBetaBlast="loginModalVisibility = false"
  ></LoginModal>
</template>
<style scoped>
* {
  box-sizing: border-box;
}

.header {
  position: fixed;
  top: 10px;
  left: 10px;
  right: 10px;
  height: 80px;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0px auto;
}
.signIn {
  color: aliceblue;
  padding: 10px 15px;
  border-radius: 10px;
  margin-right: 10px;
  text-align: center;
  cursor: pointer;
  border: 2px solid #ffffff6c;
  background: rgba(255, 255, 255, 0.024);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
.signIn:hover {
  border: 2px solid #0f0;
  box-shadow: 0 0 5px #0f0;
  transition: box-shadow 2s, transform 3s;
}
.signIn p {
  margin: 0px;
}
ul {
  margin: 0;
  padding: 0;
  list-style: none;
}
h2,
h3,
a {
  color: #fff;
}
a {
  text-decoration: none;
}
.logo {
  margin: 0;
  font-size: 1.3em;
  line-height: 20px;
  letter-spacing: 0px;
  text-shadow: 2px 2px 5px rgba(255, 0, 187, 0.735);
  position: relative;
}
.logo a {
  text-align: center;
  display: block;
  font-family: "Playfair Display", serif;
}

.logo img {
  display: none;
}

.logo img:first-child {
  width: 50px;
  position: absolute;
  top: -40%;
  left: -45%;
  transform: rotate(-7deg);
}
.logo img:last-child {
  width: 50px;
  position: absolute;
  top: -40%;
  right: -45%;
  transform: rotate(7deg);
}

a.routher-link {
  color: #34495e;
  font-size: 0.99em;
}

.bars {
  margin: 15px;
  cursor: pointer;
}

@media (min-width: 640px) {
  .header {
    padding: 20px;
  }
  .logo img {
    display: block;
  }

  .logo {
    letter-spacing: 2px;
  }
}

@media (min-width: 768px) {
  .header {
    padding: 20px;
  }
}

@media (min-width: 1024px) {
  .header {
    box-sizing: border-box;
    max-width: 2500px;
  }
  .signIn {
    border: 2px solid #fff;
  }
}

@media (min-width: 640px) and (orientation: landscape) {
}
</style>
