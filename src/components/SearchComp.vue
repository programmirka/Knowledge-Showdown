<script setup>
import { ref } from "vue";

const emits = defineEmits(["searchTerm"]);
const props = defineProps(["noResults", "placeholder", "label"]);

const searchTerm = ref("");
let timeoutId;

function search() {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  timeoutId = setTimeout(() => {
    emits("searchTerm", searchTerm.value.trim());
  }, 1000); //1sec delay
}
</script>
<template>
  <div class="searchDivBack">
    <p v-if="label">
      {{ label }}
    </p>
    <div class="searchDiv">
      <input
        class="searchField"
        :placeholder="placeholder"
        v-model="searchTerm"
        @keydown.enter="search"
        @keyup="search"
        maxlength="50"
      />

      <!-- <button
        class="searchBtn"
        :disabled="!searchTerm.length"
        @keyup="search"
        :class="{ disabledButtonSrch: !searchTerm.length }"
      >
        <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
        Search
      </button> -->
    </div>
  </div>

  <div class="searchMessage" v-if="noResults">
    <p>
      Oops! We couldn't find any results for that term. Please try a different
      keyword or phrase.
    </p>
  </div>
</template>
<style scoped>
.searchDivBack {
  width: 100%;
  margin-left: -20px;
}

.searchDivBack p {
  padding: 0 25px;
  font-size: 1.1em;
  font-weight: 200;
  margin: 10px 0px 0px;
  color: #34495e;
}
.searchField {
  padding: 15px 10px 15px 15px;
  margin: 8px 0 18px;
  font-size: 1.1em;
  width: 500px;
  height: 50px;
  resize: none;
  color: #ecf5fe;
  box-shadow: 0px 2px 5px -1px rgba(0, 0, 0, 0.233);
  overflow: hidden;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
}

.searchField::placeholder {
  color: #ecf5fea4;
}

.searchDiv {
  padding: 10px 20px;
  display: flex;
}

.searchBtn {
  border-radius: 20px;
  height: 50px;
  width: 110px;
  font-size: 18px;
  font-weight: 400;
  color: white;
  background-color: #6287ad;
  cursor: pointer;
  margin: 8px 10px 18px;
}
.searchBtn:hover {
  height: 55px;
  width: 112px;
}
.disabledButtonSrch {
  background-color: #cacaca5e;
  color: rgba(96, 96, 96, 0.566);
  cursor: auto;
}
.disabledButtonSrch:hover {
  height: 50px;
  width: 110px;
}
.searchMessage {
  padding: 15px 10px 20px 10px;
  margin: 20px 0 18px;
  font-style: italic;
  color: grey;
  font-weight: 300;
  width: 500px;
  text-align: center;
  position: fixed;
  top: 190px;
}
</style>
