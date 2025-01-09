<script setup>
import Validation from "@/services/Validation.js";
import LoginResource from "@/api/LoginResource.js";
import LocalStorage from "../services/LocalStorage";
import { useProfileStore } from "../stores/profile";
import { useBetaStore } from "@/stores/betaBlast.js";
import client from "@/api/config.js";

import { ref, watch } from "vue";
import { useRouter } from "vue-router";

const profileStore = useProfileStore();

const betaStore = useBetaStore();
betaStore.setKey();

const emits = defineEmits([
  "close",
  "openRegister",
  "loggedIn",
  "openedBetaBlast",
]);
const props = defineProps(["loginModalVisibility"]);

const router = useRouter();

// async function loginApi() {
//   return LoginResource.login(user.value);
// }

async function login() {
  if (errors.value.email || errors.value.password) {
    return alert("Please finish your Sign In form");
  }
  try {
    // const response = await LoginResource.login(user.value);
    const response = await LoginResource.login({
      email: user.value.email.trim(),
      password: user.value.password.trim(),
    });

    alert("Sign in successful!");

    LocalStorage.setUser(response.data.sessionUser);
    LocalStorage.setSid(response.data.sid);
    LocalStorage.setUsername(response.data.sessionUser.usr_username);
    profileStore.setProfileInfo(response.data.sessionUser);

    client.interceptors.request.use(function (config) {
      const sid = LocalStorage.getSid();
      config.headers["X-MARS-SID"] = sid;
      return config;
    });

    emits("loggedIn", LocalStorage.getUser());
    emits("close");
    router.push({ name: "home" }); //kad se uloguje ide na svoj home page
  } catch (err) {
    console.log(err);
    if (err.response) {
      if (err.response.status === 401) {
        //Unauthorized
        return alert("Username or password is incorrect");
      }
      if (err.response.status === 403) {
        //Forbidden
        return alert("User is blocked! Please contact support!");
      }
    }
  }
}

function closeModal() {
  emits("close");
}

function openRegister() {
  emits("openRegister");
}

function betaBlast() {
  emits("openedBetaBlast");
}

const user = ref({
  email: "",
  password: "",
});

const errors = ref({
  password: "",
  email: "",
});

watch(
  () => user.value.email,
  (newVal) => {
    if (newVal) {
      errors.value.email = Validation.email(newVal);
    }
  }
);

watch(
  () => user.value.password,
  (newVal) => {
    if (newVal) {
      errors.value.password = Validation.password(newVal);
    }
  }
);
</script>
<template>
  <div class="modal" v-show="loginModalVisibility">
    <div class="register">
      <div class="registerTitle">
        <span class="close" @click="closeModal"> &times</span>
        <h1>Log In</h1>
      </div>
      <form @submit.prevent="login">
        <BaseInput
          v-model="user.email"
          label="Email"
          type="email"
          :error="errors.email"
          required
        ></BaseInput>
        <BaseInput
          v-model="user.password"
          label="Password"
          type="password"
          :error="errors.password"
          required
        ></BaseInput>
        <button class="btn-base" type="submit">Log In</button>
      </form>
      <hr class="separate-line" />
      <div class="newToQuizDiv">
        <h3>New to Knowledge Showdown?</h3>
        <p>Register now to test your knowledge in various categories!</p>
        <button class="btn-base" @click="openRegister">Register</button>
      </div>
      <hr class="separate-line" />
      <div class="beta-blast-div">
        <h3>Ready for a quick challenge?</h3>
        <RouterLink
          :to="{ name: 'beta-blast' }"
          @click.native="betaStore.increment"
        >
          <button @click="betaBlast" class="beta-blast-btn">
            Play Beta Blast Now!
          </button></RouterLink
        >
        <p class="beta-blast-info">
          Dive into 'Beta Blast'—a thrilling sneak peek of our quiz universe!
          Test your wits with 10 random questions from a galaxy of topics. No
          sign-up needed, just pure brain power. Play now, join the ranks later!
        </p>
      </div>
    </div>
  </div>
</template>
<style scoped>
.register {
  width: 340px;
  min-height: 600px;
  padding: 8px 20px;
  position: relative;
  border-radius: 15px;
  box-shadow: -3px 5px 12px -1px rgba(0, 0, 0, 0.559);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: #fff;
  border: 1px solid #fff;
  border-left: #aaa;
  border-bottom: #aaa;
  margin-left: -20px;
}
* {
  box-sizing: border-box;
}
.registerTitle h1 {
  margin: 0px;
  padding: 5px;
  text-align: center;
  font-size: 1.5em;
}
.separate-line {
  color: #ffffff6a;
}

.submit:hover {
  background-color: #6287ad;
}
.submit:active {
  background-color: #397dc1;
}

.newToQuizDiv,
.beta-blast-div {
  text-align: center;
}

.newToQuizDiv h3 {
  margin: 0px;
}
.newToQuizDiv p {
  display: none;
}

.beta-blast-div h3 {
  color: rgb(200, 115, 200);
  display: flex;
  justify-content: center;
}

.beta-blast-div p {
  color: violet;
  font-size: 0.8em;
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

.beta-blast-info {
  display: none;
}

.beta-blast-btn {
  background: transparent;
  color: #fff;
  padding: 10px 15px;
  border: 2px solid #0f0;
  border-radius: 15px;
  text-align: center;
  margin: 5px 0;
  text-decoration: none;
  font-weight: bold;
  box-shadow: 0 0 5px #0f0;
  transition: box-shadow 0.3s, transform 0.3s;
  cursor: pointer;
  animation: pulse 2s infinite;
  user-select: none;
}
.beta-blast-btn a {
  text-decoration: none;
}
.beta-blast-btn:hover {
  box-shadow: 0 0 8px #0f0;
  transform: translateY(-2px);
  animation: none;
  background: linear-gradient(135deg, rgba(34, 163, 255, 0.653), #c534dbb1);
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
    box-shadow: 0 0 5px 0 rgba(201, 157, 27, 0.784);
  }
  50% {
    transform: scale(1.1);
    opacity: 0.7;
    box-shadow: 0 0 15px 10px rgba(184, 50, 181, 0.7);
  }
}

@media (min-width: 640px) {
  .register {
    width: 540px;
    min-height: 800px;
    margin-top: 50px;
    padding: 8px 70px;
  }
  .btn-base {
    width: 400px;
  }
}

@media (min-height: 900px) and (min-width: 640px) {
  .newToQuizDiv p {
    display: block;
  }
  .beta-blast-info {
    display: block;
  }
  .registerTitle h1 {
    font-size: 2em;
  }
  .newToQuizDiv h3 {
    margin: 15px;
  }
}

@media (min-width: 768px) {
}

@media (min-width: 1024px) {
}

@media (min-width: 640px) and (orientation: landscape) {
}
</style>
