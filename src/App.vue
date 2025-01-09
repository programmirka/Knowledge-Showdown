<script setup>
import { RouterView } from "vue-router";
import { onMounted } from "vue";
import Header from "@/components/HeaderComp.vue";
import LocalStorage from "./services/LocalStorage";
import { useLoginStore } from "@/stores/login.js";
import { useRouter } from "vue-router";
import SessionResource from "./api/SessionResource";
import { useBetaStore } from "./stores/betaBlast";

const betaStore = useBetaStore();

const loginStore = useLoginStore();
const router = useRouter();

onMounted(async () => {
  if (LocalStorage.getUser()) {
    loginStore.setSessionUser(LocalStorage.getUser());
    loginStore.setSid(LocalStorage.getSid);
    if (LocalStorage.getSid == null) {
      LocalStorage.removeUser();
      LocalStorage.removeSid();
      LocalStorage.removeUsername();
      loginStore.setSessionUser(null);
      router.push({ name: "home" });
    }
  } else {
    loginStore.setSid(null);
  }
});

async function checkSession() {
  try {
    let response = await SessionResource.sessionCheck(LocalStorage.id());
    LocalStorage.setUser(response.data.sessionUser);
    LocalStorage.setSid(response.data.sid);
    LocalStorage.setUsername(response.data.sessionUser.usr_username);
  } catch (err) {
    alert("User is logged out");
    LocalStorage.removeUser();
    LocalStorage.removeSid();
    LocalStorage.removeUsername();
    loginStore.setSessionUser(null);
    router.push({ name: "home" });
  }
}

setInterval(async () => {
  if (LocalStorage.id()) {
    await checkSession();
  }
}, 10 * 60 * 1000);
</script>

<template>
  <div class="app">
    <Header></Header>
    <main class="mainDiv">
      <RouterView :key="betaStore.getKey" />
    </main>
  </div>
</template>

<style>
/* namerno nije scoped kako bi ovi stilovi bili dostupni globalno u aplikaciji */

@import url("https://fonts.googleapis.com/css2?family=Anton&family=Orbitron:wght@400;500;600&family=Playfair+Display:wght@400;500;600&family=Red+Hat+Display:ital,wght@0,300;0,400;0,600;0,700;0,800;0,900;1,300;1,400&display=swap");
/* font-family: 'Anton', sans-serif;
font-family: 'Playfair Display', serif;
font-family: 'Red Hat Display', sans-serif; */

* {
  font-family: "Red Hat Display", sans-serif;
}
.app {
  padding: 15px;
  background-image: url("@/assets/back.jpeg");
  background-size: cover; /* Cover the entire area */
  background-position: bottom center; /* Center the image */
  background-repeat: no-repeat;
  background-attachment: fixed;
  min-height: 100vh;
}

.mainDiv {
  margin: 100px 5px auto;
  z-index: 5;
  display: flex;
  justify-content: center;
}
/* padding: 15px;
  background-image: url("@/assets/back.jpeg");
  background-size: cover; /* Cover the entire area */
/* background-position: bottom center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  min-height: 100vh;
  width: 100%;
} */

body {
  font-family: "Montserrat", sans-serif;
  line-height: 1.6;
  margin: 0;
  min-height: 100vh;
}
.modal {
  position: fixed;
  z-index: 9001;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  min-height: 100vh;
  width: 100%;

  /* background-color: rgba(0, 0, 0, 0.154); */
  background-color: rgba(0, 0, 0, 0.127);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 20px;
}
.close {
  color: #aaa;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
  position: absolute;
  top: 0px;
  right: 15px;
}

.close:hover {
  color: black;
  cursor: pointer;
}

.dropbtn {
  background-color: rgba(255, 255, 255, 01.2em);
  border: 2px solid rgba(255, 255, 255, 01.2em);
  color: #fff;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s;
  user-select: none;
  position: relative;
}

.btn-base {
  padding: 13px 20px;
  font-size: 17px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: #fff;
  border: 1px solid #fff;
  cursor: pointer;
  margin: 10px 0 10px;
  width: 300px;
  font-weight: 700;
}

.btn-base:hover {
  background: linear-gradient(135deg, rgba(34, 163, 255, 0.653), #c534dbb1);
}
.btn-base:active {
  border-width: 2px;
}

/* admin css */
.admin-wrapper {
  width: 100%;
}

.mainAdmin {
  width: 100%;
  position: relative;
}
.mainAdmin h1 {
  font-size: 1.5em;
  font-weight: 400;
  color: #ffffff;
}
.mainAdmin h2 {
  font-size: 1em;
  font-weight: 200;
  color: #ffffff;
  cursor: pointer;
}

.mainAdmin h3 {
  font-size: 1.1em;
  font-weight: 200;
  color: #f0f0f0;
}

.guide ul li {
  font-size: 1em;
  font-weight: 200;
  color: #c1c1c1;
}

.searchResults {
  padding: 5px 0px 10px;
  width: 100%;
}
.searchResults table {
  background-color: #bcbcc81a;
  text-align: center;
  border: none;
  font-style: italic;
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  border-radius: 15px;
  overflow: hidden;
  border: 1px solid #fff;
  border-left: #aaa;
  border-bottom: #aaa;
  box-shadow: -3px 5px 12px -1px rgba(0, 0, 0, 0.309);
  flex: 1;
  table-layout: fixed;
}

.searchResults tr:first-of-type {
  border-collapse: collapse;
  background-color: rgba(240, 248, 255, 0.284);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  width: 100%;
  z-index: 2;
  font-style: normal;
}
.searchResults td,
.searchResults th {
  padding: 10px 5px 10px;
  border: 1px rgba(128, 128, 128, 0.159) solid;
  color: rgba(255, 255, 255, 0.833);
  font-size: 0.9rem;
  text-wrap: wrap;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: normal;
}

.searchResults td:first-of-type,
.searchResults th:first-of-type {
  width: 2%;
  text-align: center;
}
.center {
  text-align: center;
}
.grey {
  background-color: rgba(172, 172, 172, 0.074);
}

/* admin switch */

/* The switch - the box around the slider */
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
  z-index: 1;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  z-index: 1;
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #cccccc62;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: 0.4s;
}

/* Checked state */

/* This targets the .slider immediately following any checked input. */
input:checked + .slider {
  background-color: #7259be;
}

/* Targets the ::before pseudo-element of .slider
immediately following any checked input. */
input:checked + .slider:before {
  transform: translateX(26px);
}

.slider.disabledBtn::before {
  background-color: rgba(203, 203, 203, 0.191);
}

input:checked + .disabledBtn {
  background-color: #6287ad3b;
  cursor: auto;
}
.disabledBtn {
  background-color: #cccccc41;
  cursor: auto;
}

.title {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

/* hidden columns admin */

.hidden {
  height: 100px;
  border-color: rgba(255, 255, 255, 0);
}
.hidden td {
  border-color: rgba(255, 255, 255, 0);
}

/* add-new button for Categories and Questions Panel */

.add-new {
  background-color: none;
  border: 1px solid #f0f0f0;
  padding: 5px 7px;
  font-size: 45px;
  font-weight: 700;
  border-radius: 7px;
  margin: 20px 0px 10px;
  width: 40px;
  color: #ffffff;
  text-align: center;
  line-height: 34px;
  height: 34px;
  cursor: pointer;
}

.add-new:hover {
  box-shadow: 0 0 5px #0f0;
}
.add-new:active {
  border: 2px solid #fff;
}

/* media queries */
@media (min-height: 800px) {
  .btn-base {
    padding: 15px 20px;
    font-size: 23px;
    margin: 20px 0 10px;
  }
}

@media (min-width: 640px) {
  .btn-base {
    width: 400px;
  }
  .mainDiv {
    margin: 100px 15% auto;
  }
}

@media (min-width: 768px) {
}

@media (min-width: 1024px) {
}

@media (min-width: 640px) and (orientation: landscape) {
}
</style>
