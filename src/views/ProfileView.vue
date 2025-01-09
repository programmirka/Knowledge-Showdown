<script setup>
import { useRoute } from "vue-router";
import { computed, ref, onMounted, watch } from "vue";
import ProfileResource from "@/api/ProfileResource.js";
import ProfileInfoModal from "../components/ProfileInfoModal.vue";
import EditPasswordModal from "../components/EditPasswordModal.vue";
import { useProfileStore } from "@/stores/profile.js";
import LocalStorage from "../services/LocalStorage";
import CategoriesResource from "../api/CategoriesResource";
const route = useRoute();

// const id = computed(() => route.params.id);
const profileStore = useProfileStore(); //for user Info - pinia, because of editing

const userHistory = ref([]); //array
const userRank = ref([]); //array

const profileInfoVisibility = ref(false);
const editPasswordVisibility = ref(false);

const isClassAdded = ref(false);
async function fetchProfileFromApi() {
  try {
    const response = await ProfileResource.getProfile(route.params.id);

    profileStore.setProfileInfo(response.data.user[0]);

    userHistory.value = response.data.userGames;
    userRank.value = response.data.userRank;
  } catch (err) {
    console.error(err);
  }
}

function editPasswordModal() {
  editPasswordVisibility.value = true;
  profileInfoVisibility.value = false;
}
function resetClass() {
  isClassAdded.value = false;
  console.log(isClassAdded.value);
}
function toggleClass() {
  isClassAdded.value = true;

  let a = setTimeout(resetClass, 4000);
}

const categoriesArray = ref([]);

async function fetchAllCategories() {
  try {
    const response = await CategoriesResource.getAllCategories();

    categoriesArray.value = response.data.categories;
  } catch (err) {
    console.log(err);
  }
}

const extraRows = computed(() => {
  const numberOfRows = 10 - userHistory.value.length;
  return Array.from({ length: numberOfRows }, (_, i) => i);
});

const extraRowsRank = computed(() => {
  const numberOfRows = categoriesArray.value.length - userRank.value.length;
  return Array.from({ length: numberOfRows }, (_, i) => i);
});

watch(
  () => route.params.id,
  async (newVal) => {
    if (newVal) {
      await fetchProfileFromApi();
    }
  }
);

watch(route, (to, from) => {
  if (to.params.id !== from.params.id) {
    fetchUserData();
  }
});

// function profileEditedHandler() {
//   profileInfoVisibility.value = false;
//   // await fetchProfileFromApi();
// }
onMounted(async () => {
  await fetchProfileFromApi();
  await fetchAllCategories();
});
</script>
<template>
  <div class="total-wrapper">
    <div class="top-wrapper">
      <div
        class="profile"
        @click="toggleClass()"
        :class="{ 'new-class': isClassAdded }"
      >
        <img :src="profileStore.getProfileInfo.ava_imge" alt="avatar image" />
        <p class="italic">
          username: <br />
          <span class="lighter username"
            >{{ profileStore.getProfileInfo.usr_username }}
          </span>
          <span>
            <img :src="profileStore.getProfileInfo.cou_imge" class="flag" />
          </span>
        </p>
      </div>
      <div class="edit-btns" v-if="route.params.id == LocalStorage.id()">
        <button @click="profileInfoVisibility = true">Profile Info</button>
      </div>
    </div>
    <hr />
    <div class="bottom-wrapper">
      <div class="rank history">
        <h2>History of the last 10 Games</h2>
        <table>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Finished</th>
            <th>Duration</th>
            <th>Score</th>
          </tr>
          <tr v-for="(game, i) in userHistory.slice(0, 10)" :key="i">
            <td>{{ game.game_created }}</td>
            <td>{{ game.cat_name }}</td>
            <td v-if="game.gam_status === true">finished</td>
            <td v-else>unfinished</td>
            <td v-if="game.Duration !== null">{{ game.Duration }}</td>
            <td v-else>/</td>
            <td v-if="game.gam_score">{{ game.gam_score }}</td>
            <td v-else>/</td>
          </tr>
          <tr
            v-show="userHistory.length < 10"
            v-for="(row, i) in extraRows"
            :key="i"
          >
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
          </tr>
        </table>
      </div>
      <div class="rank global">
        <h2>Global Rank by Category</h2>
        <table>
          <tr>
            <th>Category</th>
            <th>Average Score</th>
            <th>Rank</th>
          </tr>
          <tr v-for="(rank, i) in userRank" :key="i">
            <td>{{ rank.cat_name }}</td>
            <td v-if="rank.ave_AverageScore !== null">
              {{ rank.ave_AverageScore }}
            </td>
            <td v-else>-</td>
            <td v-if="rank.ave_AverageScore !== null">{{ rank.rank }}</td>
            <td v-else>-</td>
          </tr>
          <tr
            v-show="userRank.length < 6"
            v-for="(row, l) in extraRowsRank"
            :key="l"
          >
            <td>-</td>
            <td>-</td>
            <td>-</td>
          </tr>
        </table>
      </div>
    </div>
  </div>

  <ProfileInfoModal
    :profileInfoVisibility="profileInfoVisibility"
    @close="profileInfoVisibility = false"
    @editPassword="editPasswordModal"
    @saved="profileInfoVisibility = false"
    :userId="route.params.id"
    :key="route.params.id"
  ></ProfileInfoModal>

  <EditPasswordModal
    :editPasswordVisibility="editPasswordVisibility"
    @close="editPasswordVisibility = false"
    @saved="editPasswordVisibility = false"
    :userId="route.params.id"
    :key="route.params.id"
  ></EditPasswordModal>
</template>
<style scoped>
.new-class > img {
  transition: 4s;
  transform: rotateY(1440deg);
}
.total-wrapper {
  margin: 10px;
  display: flex;
  padding: 10px;
  flex-direction: column;
  border-radius: 15px;
  box-shadow: -3px 5px 12px -1px rgba(0, 0, 0, 0.559);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  width: 100%;
}
.profile > img {
  border: 0.5px rgba(255, 255, 255, 0.784) solid;
  border-radius: 10px;
  width: 30%;
  min-width: 75px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.024);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: -3px 5px 6px -1px rgba(0, 0, 0, 0.204);
}

.profile {
  display: flex;
  align-items: center;
  gap: 20px;
}
.flag {
  height: 12px;
  margin-left: 7px;
}
.lighter {
  color: rgba(255, 255, 255, 0.876);
  font-weight: 700;
  font-style: normal;
}
.total-wrapper hr {
  width: 100%;
  border: 0.2px solid #ffffff67;
  margin: 40px auto 0px;
}
.username {
  font-size: 1.2em;
  font-family: "Playfair Display", serif;
}
.edit-btns button {
  padding: 10px 10px;
  width: 100%;
  font-weight: 700;
  bottom: -71.5px;
  right: 0px;
  color: rgba(240, 248, 255, 0.523);
  margin-right: 10px;
  text-align: center;
  cursor: pointer;
  border-radius: 10px;
  border: 0.5px solid #ffffff68;
  background: rgba(255, 255, 255, 0.024);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  user-select: none;
  box-shadow: -3px 5px 12px -1px rgba(0, 0, 0, 0.107);
}

.edit-btns button:hover {
  color: rgb(240, 248, 255);
  border: 2px solid #0f0;
  box-shadow: 0 0 5px #0f0;
}

.top-wrapper,
.bottom-wrapper {
  display: flex;
}

.top-wrapper {
  justify-content: space-between;
}
.bottom-wrapper {
  justify-content: space-between;
  flex-direction: column;
  width: 100%;
}

.history,
.global {
  width: 100%;
  flex: 1;
}

.rank {
  margin-top: 20px;
  color: rgba(255, 255, 255, 0.833);
  font-weight: 200;
}

.rank table tr:first-of-type {
  background-color: rgba(240, 248, 255, 0.284);
  font-style: normal;
}
.rank table {
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
}
.rank .table tr:first-child th:last-child {
  border-top-right-radius: 15px;
}

.rank .table tr:first-child th:first-child {
  border-top-left-radius: 15px;
}
.rank table th,
.rank table td {
  padding: 5px;
  font-size: 0.8rem;
}

.italic {
  color: rgba(255, 255, 255, 0.275);
  font-weight: 200;
  font-style: italic;
}

@media (min-width: 640px) {
  .username {
    font-size: 1.7em;
  }
  .profile {
    gap: 30px;
  }
  .total-wrapper {
    margin: 10px auto 20px;
    padding: 20px;
  }
}

@media (min-width: 768px) {
  .total-wrapper {
    width: auto;

    padding: 40px;
  }
  .profile {
    gap: 40px;
  }
}

@media (min-width: 1160px) {
  .total-wrapper {
    margin: 10px 0px 20px;
    padding: 80px;
    width: 100%;
  }
  .rank {
    flex-shrink: 0;
  }

  .rank table th,
  .rank table td {
    padding: 10px;
    font-size: 1rem;
  }
  .profile {
    gap: 50px;
  }
}

@media (min-width: 1450px) {
  .bottom-wrapper {
    flex-direction: row;
    gap: 5%;
  }
}

@media (min-width: 640px) and (orientation: landscape) {
}
</style>
