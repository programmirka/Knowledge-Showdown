<script setup>
import { ref, onMounted, computed } from "vue";
import GameResource from "@/api/GameResource.js";
import LoginModal from "@/components/LoginModal.vue";
import RegisterModal from "@/components/RegisterModal.vue";
import { useLoginStore } from "@/stores/login.js";
const loginStore = useLoginStore();
const loginModalVisibility = ref(false);
const registerModalVisibility = ref(false);
const allQuestions = ref([]);
const isBtnDisabled = ref(false);
const chosenId = ref("");
const isCorrect = ref(false);
const correctId = ref("");

// finished game

const score = ref(""); //num procentage, add %
const isGameFinished = ref(""); //boolean
const numOfCorrectAnswers = ref(0);

let brojac = ref(0);

async function fetchBetaBlast() {
  brojac.value = 0;
  isBtnDisabled.value = false;

  const response = await GameResource.betaBlast();

  allQuestions.value = response.data.questions;
}

const question = computed(() => {
  return allQuestions.value[brojac.value];
});

//primam pitanja, on odgovara tako sto selektuje odgovor koji hoce od 4
//onda saljem api da proveri je l tacan i obojim

function chooseAnswer(id) {
  chosenId.value = id;
  isBtnDisabled.value = true;
  for (var i = 0; i < question.value.answers.length; i++) {
    if (question.value.answers[i].ans_correct === 1) {
      correctId.value = question.value.answers[i].ans_id;
      if (question.value.answers[i].ans_id === id) {
        isCorrect.value = true;
        numOfCorrectAnswers.value++;
      }
    }
  }
  if (brojac.value === 9) {
    isGameFinished.value = true;
    score.value = numOfCorrectAnswers.value * 10;
  }
}

function nextQuestion() {
  brojac.value++;
  isBtnDisabled.value = false;
  chosenId.value = "";
  correctId.value = "";
  isCorrect.value = false;
}

function openRegister() {
  loginModalVisibility.value = false;
  registerModalVisibility.value = true;
}

function openLogin() {
  loginModalVisibility.value = true;
  registerModalVisibility.value = false;
}

function loggedInHandler(sessionUserObj) {
  try {
    loginStore.setSessionUser(sessionUserObj);
  } catch (e) {
    alert(new Error(e));
  }
}

onMounted(async () => {
  await fetchBetaBlast();
});
</script>

<template>
  <div class="queWrap">
    <div class="question" v-if="question">
      {{ brojac + 1 }}/10 {{ question.que_text }}
    </div>
    <div class="ansWrap">
      <button
        :style="[
          correctId === answer.ans_id
            ? { backgroundColor: 'rgb(91, 150, 91)', color: 'black' }
            : {},
          chosenId === answer.ans_id && isCorrect
            ? {
                backgroundColor: 'rgb(91, 150, 91)',
                color: 'black',
                border: '1.5px solid black',
              }
            : {},
          chosenId === answer.ans_id && !isCorrect
            ? {
                backgroundColor: 'rgba(190, 53, 53, 0.579)',
                color: 'black',
              }
            : {},
        ]"
        class="answer"
        v-if="question"
        v-for="(answer, i) in question.answers"
        :key="i"
        @click="chooseAnswer(answer.ans_id)"
        :disabled="isBtnDisabled"
      >
        {{ answer.ans_text }}
      </button>
    </div>
    <button
      class="next-question-btn"
      v-if="correctId && brojac < 10"
      @click="nextQuestion"
    >
      Next Question
      <font-awesome-icon :icon="['fas', 'arrow-right-long']" />
    </button>
    <div class="finished-div" v-if="brojac > 9">
      <p>
        You got {{ numOfCorrectAnswers }} out of 10 correct! That's
        {{ score }}%!
      </p>
      <div class="finished-btns-div">
        <div v-if="numOfCorrectAnswers > 7">
          Incredible! You've Conquered the Beta Blast!
        </div>
        <div v-else>Great Effort! You're on Your Way!</div>
        <button
          class="btn-base join-us-btn"
          @click="loginModalVisibility = true"
        >
          🚀 Join Us Now
        </button>
        <div>Keep the Adventure Going!</div>
      </div>
    </div>
  </div>
  <RegisterModal
    @close="registerModalVisibility = false"
    :registerModalVisibility="registerModalVisibility"
    @openLoginModal="openLogin"
  ></RegisterModal>

  <LoginModal
    @openRegister="openRegister"
    @close="loginModalVisibility = false"
    :loginModalVisibility="loginModalVisibility"
    @openedBetaBlast="loginModalVisibility = false"
    @loggedIn="loggedInHandler"
  ></LoginModal>
</template>

<style scoped>
.queWrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px auto;
}

.ansWrap {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 20px;
  font-size: 1.5em;
  width: 100%;
}

.answer {
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid #fff;
  border-left: #aaa;
  border-bottom: #aaa;
  width: 100%;
  color: #fff;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  font-size: 0.8em;
  text-wrap: wrap;
}

.answer:hover {
  box-shadow: 0 0 8px #0f0;
}

.question {
  text-align: center;
  padding: 20px;
  font-size: 2em;
  color: #fff;
  text-shadow: 1px 1px rgb(61, 61, 61);
}
.answer:disabled {
  cursor: no-drop;
}
.answer:disabled:hover {
  box-shadow: none;
}

.next-question-btn {
  border: none;
  border-radius: 10px;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  transition-duration: 0.4s;
  cursor: pointer;
  margin-top: 50px;
  align-self: flex-end;
  box-shadow: 0 0 8px #0f0;
  width: 250px;
  animation: shake 2s infinite;
  background-color: #ffffff00;
}

.next-question-btn:hover {
  background: none;
  box-shadow: 0 0 12px #0f0;
  animation: none;
}
@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-10px);
  }
  50% {
    transform: translateX(10px);
  }
  75% {
    transform: translateX(-10px);
  }
}

.finished-div {
  text-align: center;
  width: 100%;
}

.finished-div p {
  font-size: 2em;
  padding: 20px 40px;
  background-color: #3498db;
  color: white;
  border-radius: 20px;
  margin: 50px;
  margin-bottom: 20px;
  transition: all 0.5s;
  animation: pulse 2s infinite;
  box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.7);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
.finished-btns-div {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 50px;
}

/* ovo ispod nema na kvizu */

.finished-btns-div div {
  color: violet;
  text-shadow: 1px 1px #363636;
  font-size: 1.8em;
  font-weight: 600;
}

.join-us-btn {
  width: 230px;
  box-shadow: -3px 5px 12px -1px rgba(0, 0, 0, 0.559);
  border: 1px solid #fff;
  border-left: #aaa;
  border-bottom: #aaa;
}
.join-us-btn:active {
  box-shadow: 0 0 5px #0f0;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.7;
    box-shadow: 0 0 10px 0 rgba(202, 202, 202, 0.7);
  }
  50% {
    transform: scale(1.02);
    opacity: 1;

    box-shadow: 0 0 20px 10px rgba(0, 255, 0, 0.704);
  }
}

@media (min-width: 640px) {
}

@media (min-width: 768px) {
}

@media (min-width: 1024px) {
  .ansWrap {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 640px) and (orientation: landscape) {
}
</style>
