<script setup>
import Validation from "@/services/Validation.js";
import ProfileResource from "@/api/ProfileResource.js";
import AvatarResource from "@/api/AvatarResource.js";
import CountryResource from "@/api/CountryResource.js";
import { ref, watch, onMounted } from "vue";
import { useProfileStore } from "../stores/profile";
import LocalStorage from "../services/LocalStorage";

const props = defineProps(["profileInfoVisibility", "userId"]);
const emits = defineEmits(["close", "editPassword", "saved"]);
const profileStore = useProfileStore();

const user = ref({});

const userEdited = ref({});

function editPassword() {
  emits("editPassword");
}

//custom select for avatar
const isOpen = ref(false);
const selectedItem = ref("");
const allAvatars = ref([]);

function toggleDropdown() {
  isOpen.value = !isOpen.value;
}
function selectItem(item) {
  selectedItem.value = item;
  isOpen.value = false;
}

//custom select for countries
const isOpenCou = ref(false);
const selectedItemCou = ref(null);
const allCountries = ref([]);

function toggleDropdownCou() {
  isOpenCou.value = !isOpenCou.value;
}
function selectItemCou(item) {
  selectedItemCou.value = item;
  isOpenCou.value = false;
}

async function fetchAllAvatars() {
  try {
    const response = await AvatarResource.getAll();
    allAvatars.value = response.data.avatars;
    // selectedItem.value = allAvatars.value[0];
  } catch (err) {
    console.error(err);
  }
}

async function fetchAllCountries() {
  try {
    const response = await CountryResource.getAll();
    allCountries.value = response.data.countries;
  } catch (err) {
    console.error(err);
  }
}

function closeModal() {
  emits("close");
}

async function editProfile() {
  if (errors.value.fullname || errors.value.username) {
    return alert("Please finish your form!");
  }
  try {
    userEdited.value.cou_id = selectedItemCou.value.cou_id;
    userEdited.value.ava_id = selectedItem.value.ava_id;

    // let response = await ProfileResource.editProfile(userEdited.value);
    let response = await ProfileResource.editProfile({
      usr_id: userEdited.value.usr_id,
      usr_fullname: userEdited.value.usr_fullname.trim(),
      usr_username: userEdited.value.usr_username.trim(),
      cou_id: userEdited.value.cou_id,
      ava_id: userEdited.value.ava_id,
    });

    profileStore.setProfileInfo(response.data.user[0]);
    LocalStorage.setUsername(profileStore.getProfileInfo.usr_username);

    alert(`Submit was successful! Your profile information is updated!`);
    emits("saved");
  } catch (err) {
    console.error(err);
    if (err.response) {
      if (err.response.status === 404) {
        return alert("There was an error, please try again");
      }
      if (err.response.status === 400) {
        return alert("Bad parameters. Please try again with valid parameters.");
      }
    }
  }
}

const errors = ref({
  fullname: "",
  username: "",
});

watch(
  () => userEdited.value.usr_fullname,
  (newVal) => {
    if (newVal) {
      errors.value.fullname = Validation.name(newVal);
    }
  }
);
watch(
  () => userEdited.value.usr_username,
  (newVal) => {
    if (newVal) {
      errors.value.username = Validation.username(newVal);
    }
  }
);

onMounted(async () => {
  await fetchAllAvatars();
  await fetchAllCountries();

  selectedItem.value = profileStore.getProfileInfo;
  selectedItemCou.value = profileStore.getProfileInfo;
  user.value = {
    fullname: profileStore.getProfileInfo.usr_fullname,
    username: profileStore.getProfileInfo.usr_username,
    email: profileStore.getProfileInfo.usr_email,
  };

  userEdited.value = {
    usr_id: props.userId,
    usr_fullname: user.value.fullname,
    usr_username: user.value.username,
    cou_id: selectedItemCou.value.cou_id,
    ava_id: selectedItem.value.ava_id,
  };
});
</script>
<template>
  <div class="modal" v-if="profileInfoVisibility">
    <div class="register">
      <div class="registerTitle">
        <span class="close" @click="closeModal"> &times</span>
        <h1>Profile Information</h1>
      </div>
      <form @submit.prevent="editProfile">
        <BaseInput
          v-model="userEdited.usr_fullname"
          label="Name"
          type="text"
          :error="errors.fullname"
          required
        ></BaseInput>
        <BaseInput
          v-model="user.email"
          label="Email"
          type="email"
          :isDisabled="true"
        ></BaseInput>
        <BaseInput
          v-model="userEdited.usr_username"
          label="Username"
          type="text"
          :error="errors.username"
        ></BaseInput>
        <label class="label"
          >Avatar
          <span class="grey">(click on the avatar to change)</span></label
        >
        <div class="dropdownDiv">
          <div class="dropdown-selected" @click="toggleDropdown">
            <img
              :src="selectedItem.ava_imge"
              :alt="selectedItem.ava_name"
              class="icon"
            />
          </div>
          <div class="dropdown-items" v-if="isOpen">
            <div
              v-for="item in allAvatars"
              :key="item.ava_id"
              @click="selectItem(item)"
              class="dropdown-item"
            >
              <img :src="item.ava_imge" :alt="item.ava_name" class="icon" />
            </div>
          </div>
        </div>
        <label class="label"
          >Country
          <span class="grey">(click on the country name to change)</span>
        </label>
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

        <br />
        <button @click="editPassword" class="submit password-btn" type="button">
          Change Password
        </button>
        <button class="submit" type="submit">Save</button>
      </form>
    </div>
  </div>
</template>
<style scoped>
.register {
  width: 340px;
  height: 650px;
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
  margin-left: -35px;
  margin-top: -20px;
}
.registerTitle h1 {
  margin: 0px;
  padding: 10px;
  text-align: center;
  color: #ffffff;
  font-size: 1.5rem;
}
.submit {
  width: 48%;
  height: 50px;
  padding: 5px 15px;
  font-size: 15px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: #fff;
  border: 1px solid #fff;
  cursor: pointer;
  margin: 10px 0 10px;
  font-weight: 700;
}
.submit:hover {
  background: linear-gradient(135deg, rgba(34, 163, 255, 0.653), #c534dbb1);
}
.submit:active {
  border-width: 2px;
}
.password-btn {
  color: #e7e7e7ae;
  margin-right: 2%;
  padding: 5px 5px;
  font-weight: 300;
}
.password-btn:hover {
  color: white;
  font-weight: 600;
}

.error {
  font-family: "Montserrat", sans-serif;
  color: rgb(160, 92, 92);
  font-size: 0.8em;
  font-weight: 200;
  padding: 1px;
}

/* avatars  */
.dropdownDiv {
  position: relative;
}

.dropdown-selected {
  cursor: pointer;
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

.icon {
  width: 70px;
  height: 70px;
  padding: 2px;
  border: double 2px #fff;
}

.label {
  font-size: 1.1em;
  font-weight: 400;
  font-family: "Montserrat", sans-serif;
  margin-top: 20px;
}

.disabled-email input {
  background-color: #34495e;
}

.grey {
  color: rgba(213, 213, 213, 0.576);
  font-weight: 200;
}

@media (min-height: 850px) and (min-width: 640px) {
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

  .submit {
    width: 48%;
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
