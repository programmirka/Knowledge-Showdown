<script setup>
import { useRouter } from "vue-router";

const emits = defineEmits(["close", "openRegister", "loggedIn"]);
const props = defineProps(["loginModalVisibility"]);

const router = useRouter();

function closeModal() {
  emits("close");
}

function openRegister() {
  emits("openRegister");
}
</script>
<template>
  <div class="modal">
    <div class="register">
      <div class="registerTitle">
        <span class="close" @click="closeModal"> &times</span>
        <h1>Log In</h1>
      </div>
      <hr />
      <div class="newToQuizDiv">
        <h3>New to Quiz?</h3>
        <p>Register now to test your knowledge in various categories!</p>
        <button class="submit registerBtn" @click="openRegister">
          Register
        </button>
      </div>
    </div>
  </div>
</template>
<style scoped>
* {
  box-sizing: border-box;
}
.register {
  width: 340px;
  min-height: 570px;
  background-color: #fff;
  padding: 8px 20px;
  margin-top: 10px;
  position: relative;
  border-radius: 15px;
  box-shadow: -3px 5px 12px -1px rgba(0, 0, 0, 0.559);
}

.registerTitle h1 {
  margin: 0px;
  padding: 10px;
  text-align: center;
  color: #34495e;
}

.submit {
  background-color: #b6bdc4;
  padding: 15px 20px;
  border: none;
  font-size: 23px;
  border-radius: 10px;
}
.login {
  margin: 20px 0 10px;
  width: 300px;
}
.registerBtn {
  margin-top: 10px;
  width: 300px;
}

.submit:hover {
  background-color: #6287ad;
}
.submit:active {
  background-color: #397dc1;
}

.newToQuizDiv {
  text-align: center;
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

@media (min-width: 640px) {
  .register {
    width: 540px;
    min-height: 570px;
    margin-top: 50px;
    padding: 8px 70px;
  }
  .login {
    width: 400px;
  }
  .registerBtn {
    width: 400px;
  }
}

@media (min-width: 768px) {
}

@media (min-width: 1024px) {
}

@media (min-width: 640px) and (orientation: landscape) {
  .register {
    width: 540px;
  }
}
</style>
