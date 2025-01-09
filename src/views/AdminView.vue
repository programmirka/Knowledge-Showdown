<script setup>
import AdminResource from "../api/AdminResource";
import LocalStorage from "../services/LocalStorage";
import SearchComp from "../components/SearchComp.vue";
import Permissions from "../services/Permissions";
import { ref, onMounted, computed } from "vue";

const user_search = 6;
const user_delete = 7;
const user_admin = 8;
const que_all = 16;
const cat_all = 10;

const user_search_check = ref(false);
const user_delete_check = ref(false);
const user_admin_check = ref(false);
const que_all_check = ref(false);
const cat_all_check = ref(false);

//for loggedin user
let role = LocalStorage.getUser().rol_name;
let id = LocalStorage.id();

const users = ref([]);
const searchPlaceholder = ref("Type in to search...");
const guideVisibility = ref(false);

async function searchUsers(term) {
  if (term.trim().length < 1) {
    await fetchUserList();
    return;
  }
  try {
    const response = await AdminResource.searchUsers(term.trim());
    users.value = response.data.searchDB;
  } catch (err) {
    console.error(err.message);
  }
}

async function fetchUserList() {
  try {
    const response = await AdminResource.getAllUsers();
    users.value = response.data.users;
  } catch (err) {
    console.error(err.message);
  }
}

async function switchAdmin(id) {
  try {
    const response = await AdminResource.switchAdmin(id);
    fetchUserList();
  } catch (err) {
    console.error(err);
  }
}

async function switchDelete(id) {
  try {
    const response = await AdminResource.switchDelete(id);
    fetchUserList();
  } catch (err) {
    console.error(err);
    //alert za usera koji nema permisju sa ovako nesto
  }
}

onMounted(async () => {
  await fetchUserList();
  user_search_check.value = Permissions.checkPermission(user_search);
  user_delete_check.value = Permissions.checkPermission(user_delete);
  user_admin_check.value = Permissions.checkPermission(user_admin);
  que_all_check.value = Permissions.checkPermission(que_all);
  cat_all_check.value = Permissions.checkPermission(cat_all);
});
</script>
<template>
  <div class="admin-wrapper">
    <div class="mainAdmin">
      <div class="title">
        <h1>Admin Panel - All Users</h1>

        <div>
          <RouterLink :to="{ name: 'questions' }" v-show="que_all_check">
            <div>
              Questions Panel
              <font-awesome-icon :icon="['fas', 'arrow-right-long']" /></div
          ></RouterLink>
          <RouterLink :to="{ name: 'categories' }" v-show="cat_all_check">
            <div>
              Categories Panel
              <font-awesome-icon :icon="['fas', 'arrow-right-long']" /></div
          ></RouterLink>
        </div>
      </div>

      <h2 @click="guideVisibility = !guideVisibility">
        User Management Quick Guide
        <span v-if="guideVisibility === false">
          (click to unhide) <font-awesome-icon :icon="['far', 'eye']" /></span
        ><span v-else>
          (click to hide) <font-awesome-icon :icon="['far', 'eye-slash']"
        /></span>
      </h2>
      <transition name="fade">
        <div class="guide" v-show="guideVisibility">
          <h3>Managing Users</h3>
          <ul>
            <li>
              Delete: Toggle the switch next to a user in "Deleted" column to
              delete their account.
            </li>
            <li>
              Promote: Toggle the switch next to a user in "Admin" column to
              elevate a user to admin status.
            </li>
          </ul>
          <h3>Searching Users</h3>
          <ul>
            <li>
              Use the search bar to filter users by name, username, or email.
            </li>
          </ul>
          <h3>Quick Navigation</h3>
          <ul>
            <li>
              Click 'Categories Panel' or 'Questions Panel' at the top right to
              manage quizzes.
            </li>
          </ul>
        </div>
      </transition>

      <search-comp
        @searchTerm="searchUsers"
        :placeholder="searchPlaceholder"
        v-if="user_search_check"
      ></search-comp>
    </div>
    <div class="searchResults">
      <table>
        <tr>
          <th class="no-wrap"></th>
          <th>Name</th>
          <th>Username</th>
          <th>Email</th>
          <th>Deleted</th>
          <th>Admin</th>
        </tr>
        <tr
          v-if="users.length"
          v-for="(user, i) in users"
          :key="i"
          :class="{ grey: i % 2 }"
        >
          <td class="no-wrap" style="white-space: nowrap">{{ i + 1 }}.</td>

          <td>
            <RouterLink
              :to="{ name: 'profile-details', params: { id: user.usr_id } }"
              >{{ user.usr_fullname }}
            </RouterLink>
          </td>

          <td>
            <RouterLink
              :to="{ name: 'profile-details', params: { id: user.usr_id } }"
              >{{ user.usr_username }}
            </RouterLink>
          </td>
          <td>{{ user.usr_email }}</td>
          <td class="center">
            <label class="switch">
              <input
                :checked="user.usr_is_deleted !== null"
                @change="switchDelete(user.usr_id)"
                type="checkbox"
                :id="users.length + i"
                :disabled="id === user.usr_id || !user_delete_check"
              />
              <span
                class="slider"
                :class="{
                  disabledBtn: id === user.usr_id || !user_delete_check,
                }"
              ></span>
            </label>
          </td>
          <td class="center">
            <label class="switch">
              <input
                :checked="user.rol_name === 'Admin'"
                @change="switchAdmin(user.usr_id)"
                type="checkbox"
                :id="users.length * 2 + i"
                :disabled="id === user.usr_id || !user_admin_check"
              />
              <span
                class="slider"
                :class="{
                  disabledBtn: id === user.usr_id || !user_admin_check,
                }"
              ></span>
            </label>
          </td>
        </tr>
        <tr v-else>
          <td colspan="6">
            Oops! We couldn't find any results for that term. Please try a
            different keyword or phrase.
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<style>
/* dovde */

.mainAdmin a,
.searchResults a {
  text-decoration: none;
  color: rgba(255, 255, 255, 0.833);
  cursor: pointer;
}

.mainAdmin a:hover,
.searchResults a:hover {
  color: rgba(255, 255, 255, 0.833);
  font-weight: 400;
  text-decoration: underline;
}

@media (min-width: 640px) {
  .searchResults td,
  .searchResults th {
    font-size: 1rem;
  }
}

@media (min-width: 768px) {
}

@media (min-width: 1024px) {
}

@media (min-width: 640px) and (orientation: landscape) {
}
</style>
