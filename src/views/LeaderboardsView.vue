<script setup>
import LeaderboardResource from "../api/LeaderboardResource";
import { useLoginStore } from "@/stores/login.js";

const loginStore = useLoginStore();

import { onMounted, ref } from "vue";

const leaderboards = ref([]); //up to 10 best users per category

async function fetchLeaderboards() {
  try {
    const response = await LeaderboardResource.perCategories();
    leaderboards.value = response.data.leaderboard;
  } catch (err) {
    console.error(err);
  }
}

onMounted(async () => {
  await fetchLeaderboards();
});
</script>
<template>
  <div class="back">
    <h1>Leaderboards by Categories</h1>
    <div class="leaderboard-wrapper">
      <div
        class="leaderboards"
        v-for="(leaderboard, i) in leaderboards"
        :key="i"
      >
        <div
          v-show="leaderboard.userScores[0].usr_id !== null"
          class="leaderboard"
        >
          <img src="@/assets/112.png" alt="Owl" class="hover-image" />

          <h2>{{ leaderboard.cat_name }}</h2>
          <ol>
            <li v-for="user in leaderboard.userScores">
              <img :src="user.ava_img" class="avaImg" />

              <RouterLink
                v-if="loginStore.getSessionUser"
                :to="{ name: 'profile-details', params: { id: user.usr_id } }"
                ><span>{{ user.usr_username }}</span></RouterLink
              >

              <span v-else>{{ user.usr_username }}</span>

              <span class="text-right">{{ user.ave_AverageScore }}</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.avaImg {
  width: 20px;
  height: 20px;
  margin-left: 10px;
  margin-right: 10px;
  border: 0.5px rgba(255, 255, 255, 0.784) solid;
  border-radius: 20%;
  border-width: 2px;
  position: relative;
  top: 4px;
}
.back h1 {
  padding-top: 30px;
  text-shadow: 2px 2px 5px rgba(255, 0, 187, 0.735);
  color: white;
  margin: 20px 10px 10px;
  padding: 10px 20px;
  font-size: 35px;
  font-weight: 600;
  text-align: center;
  font-size: 20px;
}

.leaderboard-wrapper {
  gap: 40px;
  display: grid;
  align-items: center;
  grid-template-columns: repeat(1, 1fr);
}
.leaderboards {
  color: rgba(216, 207, 207, 0.769);
  /* width: 250px; */
  margin: 0px auto;
}

.leaderboard {
  width: 300px;
  height: 450px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: #fff;
  border: 1px solid #fff;
  border-left: #aaa;
  border-bottom: #aaa;
  box-shadow: -3px 5px 12px -1px rgba(0, 0, 0, 0.559);
  position: relative;
  overflow: hidden;
}

.leaderboard:hover {
  box-shadow: -3px 5px 15px -1px rgba(0, 0, 0, 0.664);
  border-right: 1px solid #0f0;
  border-top: 1px solid #0f0;
}

.leaderboard h2 {
  text-align: center;
  padding: 20px 10px 5px;
  background-color: rgba(240, 248, 255, 0.13);
  border-radius: 20px 20px 0px 0px;
  margin: 0px;
  color: #fff;
  text-shadow: none;
}

.leaderboard li {
  font-size: 1.2em;
  padding: 2px;
  padding-right: 20px;
}
.leaderboard li a {
  text-decoration: none;
  color: #fff;
  cursor: pointer;
}

.leaderboard li a:hover {
  color: #0f0;
}

.hover-image {
  position: absolute;
  top: -100%;
  left: 85%;
  transform: translateX(-50%) rotate(180deg);
  transition: top 0.5s ease;
  width: 60px;
}

.leaderboard:hover .hover-image {
  top: -4%; /* On hover, bring the image into view */
}

.text-right {
  float: right;
}

@media (min-width: 768px) {
  .back h1 {
    font-size: 35px;
    margin: 50px 10px 30px;
  }
  .leaderboard-wrapper {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (min-width: 1300px) {
  .leaderboard-wrapper {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
