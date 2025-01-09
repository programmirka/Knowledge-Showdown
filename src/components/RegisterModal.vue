<script setup>
import Validation from "@/services/Validation.js";
import RegisterResource from "@/api/RegisterResource.js";
import { ref, watch, onMounted } from "vue";
import CountryResource from "@/api/CountryResource.js";

const props = defineProps(["registerModalVisibility"]);
const emits = defineEmits(["close", "openLoginModal"]);

function closeModal() {
  emits("close");
}

async function registerApi() {
  // return RegisterResource.register(user.value);
  return RegisterResource.register({
    cou_id: user.value.cou_id,
    fullname: user.value.fullname.trim(),
    email: user.value.email.trim(),
    password: user.value.password.trim(),
    rePassword: user.value.rePassword.trim(),
    username: user.value.username.trim(),
  });
}

async function register() {
  if (
    errors.value.fullname ||
    errors.value.email ||
    errors.value.password ||
    errors.value.rePassword ||
    errors.value.username
  ) {
    return alert("Please finish your form!");
  }
  try {
    user.value.cou_id = selectedItemCou.value.cou_id;

    if (user.value.cou_id == null) {
      return alert("Please finish your form!");
    }

    const response = await registerApi();

    alert(`Registration successful! Your account has been created.
     You can now log in and start playing quizzes!`);
    emits("openLoginModal");

    user.value.fullname = "";
    user.value.email = "";
    user.value.password = "";
    user.value.rePassword = "";
    user.value.username = "";
  } catch (err) {
    if (err.response) {
      if (err.response.status === 401) {
        return alert("Email address already taken");
      }
      if (err.response.status === 402) {
        return alert("Username already exists");
      }
    }
  }
}

const user = ref({
  cou_id: "",
  fullname: "",
  email: "",
  password: "",
  rePassword: "",
  username: "",
});

const errors = ref({
  fullname: "",
  email: "",
  password: "",
  rePassword: "",
  username: "",
  cou_id: "",
});

watch(
  () => user.value.fullname,
  (newVal) => {
    if (newVal) {
      errors.value.fullname = Validation.name(newVal);
    }
  }
);

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

watch(
  () => user.value.rePassword,
  (newVal) => {
    if (newVal) {
      errors.value.rePassword = Validation.rePassword(
        user.value.password,
        newVal
      );
    }
  }
);
watch(
  () => user.value.username,
  (newVal) => {
    if (newVal) {
      errors.value.username = Validation.username(newVal);
    }
  }
);

const isOpenCou = ref(false);
const selectedItemCou = ref({ cou_name: "Chose a country" });
const allCountries = ref([]);

function toggleDropdownCou() {
  isOpenCou.value = !isOpenCou.value;
}
function selectItemCou(item) {
  selectedItemCou.value = item;
  isOpenCou.value = false;
}
async function fetchAllCountries() {
  try {
    const response = await CountryResource.getAll();

    allCountries.value = response.data.countries;
  } catch (err) {
    console.error(err);
  }
}

onMounted(async () => {
  await fetchAllCountries();
});
</script>
<template>
  <div class="modal" v-if="registerModalVisibility">
    <div class="register">
      <div class="registerTitle">
        <span class="close" @click="closeModal"> &times</span>
        <h1>Register</h1>
      </div>
      <form @submit.prevent="register">
        <BaseInput
          v-model="user.fullname"
          label="Name"
          type="text"
          :error="errors.fullname"
          required
        ></BaseInput>
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
        <BaseInput
          v-model="user.rePassword"
          label="Re-enter Password"
          type="password"
          :error="errors.rePassword"
          required
        ></BaseInput>
        <BaseInput
          v-model="user.username"
          label="Username"
          type="text"
          :error="errors.username"
        ></BaseInput>
        <div>
          <div>
            <label>
              <span style="font-size: larger">Country</span>
              <span style="color: rgba(245, 245, 245, 0.637)">
                (Click on the "Chose country" to change)</span
              >
            </label>
          </div>
          <div class="dropdownDiv">
            <div class="dropdown-selected" @click="toggleDropdownCou">
              <div>
                {{ selectedItemCou.cou_name }}
                <font-awesome-icon :icon="['fas', 'chevron-down']" />
              </div>
            </div>
            <div class="dropdown-items" v-if="isOpenCou">
              <div
                v-for="item in allCountries"
                :key="item.cou_id"
                @click="selectItemCou(item)"
                class="dropdown-item"
              >
                <div>{{ item.cou_name }}</div>
              </div>
            </div>
          </div>
        </div>

        <button class="btn-base" type="submit">Register</button>
      </form>
    </div>
  </div>
</template>
<style scoped>
.register {
  width: 340px;
  height: 830px;
  background-color: #fff;
  padding: 8px 20px;
  position: relative;
  border-radius: 15px;
  box-sizing: border-box;
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
.registerTitle h1 {
  margin: 0px;
  margin-top: 10px;
  padding: 10px;
  text-align: center;
  color: #ffffff;
  font-size: 1.5em;
}

.btn-base {
  margin: 30px 0 10px;
}

.error {
  font-family: "Montserrat", sans-serif;
  color: rgb(160, 92, 92);
  font-size: 0.8em;
  font-weight: 200;
  padding: 1px;
}

@media (min-height: 900px) and (min-width: 770px) {
  .register {
    height: 770px;
  }
  .registerTitle h1 {
    font-size: 2em;
  }
}

@media (min-width: 640px) {
  .register {
    width: 540px;
    min-height: 570px;
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
.dropdownDiv {
  position: relative;
}
.dropdown-selected {
  cursor: pointer;
}

.icon {
  width: 70px;
  height: 70px;
  padding: 2px;
  border: double 2px #fff;
}

.dropdown-items {
  position: absolute;
  display: flex;
  flex-direction: column;
  background-color: #f7f7f7;
  height: 200px;
  overflow: scroll;
  z-index: 5;
  user-select: none;
}
.dropdown-item {
  cursor: pointer;
  box-sizing: border-box;
  color: black;
}
.dropdown-item:hover {
  background-color: #cacaca;
}
</style>
