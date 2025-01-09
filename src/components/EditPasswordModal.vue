<template>
  <div class="modal" v-if="editPasswordVisibility">
    <div class="register">
      <div class="registerTitle">
        <span class="close" @click="closeModal"> &times</span>
        <h1>Change Password</h1>
      </div>
      <p>
        To change the password, please enter old password, then enter new
        password two times.
      </p>
      <form @submit.prevent="changePassword">
        <BaseInput
          v-model="newPassword.usr_password_old"
          label="Old Password"
          type="password"
          :error="errors.oldPassword"
          required
        ></BaseInput>
        <BaseInput
          v-model="newPassword.usr_password_new"
          label="New Password"
          type="password"
          :error="errors.password"
          required
        ></BaseInput>
        <BaseInput
          v-model="newPassword.usr_password_new_re"
          label="Re-enter New Password"
          type="password"
          :error="errors.rePassword"
          required
        ></BaseInput>

        <br />
        <button class="btn-base" type="submit">Save</button>
      </form>
    </div>
  </div>
</template>
<script setup>
import Validation from "@/services/Validation.js";

import { ref, watch } from "vue";
import ProfileResource from "../api/ProfileResource";

const props = defineProps(["editPasswordVisibility", "userId"]);
const emits = defineEmits(["close", "saved"]);

function closeModal() {
  emits("close");
}

const newPassword = ref({
  usr_id: props.userId,
  usr_password_old: "",
  usr_password_new: "",
  usr_password_new_re: "",
});

async function changePassword() {
  if (errors.value.password || errors.value.rePassword) {
    return alert("Please finish your form!");
  }
  try {
    const response = await ProfileResource.editPassword({
      usr_id: newPassword.value.usr_id,
      usr_password_old: newPassword.value.usr_password_old.trim(),
      usr_password_new: newPassword.value.usr_password_new.trim(),
      usr_password_new_re: newPassword.value.usr_password_new_re.trim(),
    });

    alert(`Successfully subbmited! Your password is changed!`);
    emits("saved");

    newPassword.value.usr_password_old = "";
    newPassword.value.usr_password_new = "";
    newPassword.value.usr_password_new_re = "";
  } catch (err) {
    console.log(err);
    if (err.response) {
      if (err.response.status === 400) {
        return alert("Bad parameters");
      }
      if (err.response.status === 403) {
        return alert("Forbidden action");
      }
      if (err.response.status === 404) {
        return alert("User not found");
      }
      if (err.response.status === 405) {
        return alert("Password is not strong enough");
      }
      if (err.response.status === 406) {
        return alert("New password can`t match old password");
      }
      if (err.response.status == 402) {
        return alert("Provided old password doesn't match old password");
      }
    }
  }
}

const errors = ref({
  oldPassword: "",
  password: "",
  rePassword: "",
});

watch(
  () => newPassword.value.usr_password_old,
  (newVal) => {
    if (newVal) {
      errors.value.oldPassword = Validation.password(newVal);
    }
  }
);

watch(
  () => newPassword.value.usr_password_new,
  (newVal) => {
    if (newVal) {
      errors.value.password = Validation.password(newVal);
    }
  }
);

watch(
  () => newPassword.value.usr_password_new_re,
  (newVal) => {
    if (newVal) {
      errors.value.rePassword = Validation.rePassword(
        newPassword.value.usr_password_new,
        newVal
      );
    }
  }
);
</script>
<style scoped>
.register {
  width: 340px;
  height: 630px;
  padding: 8px 20px;
  position: relative;
  border-radius: 15px;
  box-sizing: border-box;
  box-shadow: -3px 5px 12px -1px rgba(0, 0, 0, 0.559);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid #fff;
  border-left: #aaa;
  border-bottom: #aaa;
  margin-left: -35px;
  margin-top: -20px;
}
.registerTitle h1 {
  margin-top: 10px;
  padding: 10px;
  text-align: center;
  color: #fff;
  font-size: 1.5rem;
}

.register p {
  font-size: 1.1em;
  font-style: italic;
  color: rgb(232, 232, 232);
  font-weight: 700;
  margin-bottom: 25px;
}

@media (min-height: 850px) and (min-width: 640px) {
  .registerTitle h1 {
    font-size: 2em;
  }
}
@media (min-width: 640px) {
  .register {
    width: 540px;

    margin-top: 50px;
    padding: 8px 70px;
  }

  .btn-base {
    width: 400px;
  }
}

@media (min-width: 768px) {
}

@media (min-width: 1024px) {
}

@media (min-width: 640px) and (orientation: landscape) {
}
</style>
