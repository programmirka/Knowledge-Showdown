<script setup>
import FireworksComp from "../components/FireworksComp.vue";
import { ref, onMounted, computed, watch } from "vue";
import GameResource from "@/api/GameResource.js";
import { useRoute } from "vue-router";
import LocalStorage from "../services/LocalStorage";
const route = useRoute();
const allQuestions = ref([]);
const gameId = ref("");
const correctIdFromApi = ref(""); //correct ans id
const isCorrectFromApi = ref(""); //boolean
const numOfAnsQueFromApi = ref(""); //num
const gameTimeFromApi = ref("");
const isBtnDisabled = ref(false);
const chosenId = ref("");
const quizTime = ref(5 * 60); //10min. u sec
let timer = ref(null);
let brojac = ref(0); //za pitanja
const cat_id = computed(() => route.params.cat_id);
let usr_id = LocalStorage.id();
const startGameObj = ref({ cat_id: cat_id, usr_id: usr_id });

//finished game

const scoreFromApi = ref(""); //num procentage, add %
const isGameFinishedFromApi = ref(""); //boolean
const numOfCorrectAnswersFromApi = ref("");

const formattedTime = computed(() => {
  if (formattedTime.minutes == 0 && formattedTime.seconds == 0) {
    stopTimer();
    stopSongs();
    alert("Times up");
  }

  let minutes = Math.floor(quizTime.value / 60);
  let seconds = quizTime.value % 60;
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${minutes}:${seconds}`;
});

function startTimer() {
  timer.value = setInterval(() => {
    if (quizTime.value > 0) {
      quizTime.value--;
    } else {
      stopTimer();
    }
  }, 1000);
}

function restTimer() {
  quizTime.value = 5 * 60;
  //startTimer();
}

function stopTimer() {
  clearInterval(timer.value);
  timer.value = null;
}

watch(
  () => quizTime.value,
  (newTime) => {
    if (newTime <= 0) {
      stopTimer();
      isGameFinishedFromApi.value = true;
    }
  }
);

// fetching all 10 questions from api, starting quiz
async function fetchQuiz() {
  resetSongs();
  restTimer();
  brojac.value = 0;
  isGameFinishedFromApi.value = false;
  isBtnDisabled.value = false;

  const response = await GameResource.startGame(startGameObj.value);

  startTimer();

  allQuestions.value = response.data.question;
  gameId.value = response.data.gameId;
}

const question = computed(() => {
  return allQuestions.value[brojac.value];
});

//primam pitanja, on odgovara tako sto selektuje odgovor koji hoce od 4
//ja onda saljem api da proveri je l tacan i obojim

async function chooseAnswer(id) {
  try {
    const response = await GameResource.checkAnswer({
      que_id: question.value.que_id,
      gam_id: gameId.value,
      ans_id: id,
    });
    isBtnDisabled.value = true;
    chosenId.value = id;

    let apiData = response.data;
    gameTimeFromApi.value = apiData.gameTime;
    correctIdFromApi.value = apiData.correctId;
    isCorrectFromApi.value = apiData.IsCorrect;
    numOfAnsQueFromApi.value = apiData.numOfAnswerdQuestions;
    scoreFromApi.value = apiData.score;
    isGameFinishedFromApi.value = apiData.is_game_finished;
    numOfCorrectAnswersFromApi.value = apiData.numOfCorrectAnswers;

    if (isGameFinishedFromApi.value) {
      stopSongs();
      stopTimer();
      console.log(formattedTime);
    }
  } catch (err) {
    console.error(err);
  }
}

function nextQuestion() {
  correctIdFromApi.value = "";
  brojac.value++;
  isBtnDisabled.value = false;
  chosenId.value = "";
}

function toggleSound() {
  let volumeSlider = document.getElementById("volume");

  let volumePlayer = document.getElementById("myAudio");
  volumeSlider.hidden = !volumeSlider.hidden;

  if (volumeSlider.value == 0) {
    soundPic.value = "../src/assets/muted.png";
  } else {
    soundPic.value = "../src/assets/unmuted.png";
  }

  volumePlayer.volume = volumeSlider.value;
}
function stopSongs() {
  let soundButton = document.getElementById("soundButton");
  let shuffleButton = document.getElementById("shuffleButton");
  soundButton.disabled = true;
  shuffleButton.disabled = true;

  audioSource.value = null;
}
function resetSongs() {
  let soundButton = document.getElementById("soundButton");
  let shuffleButton = document.getElementById("shuffleButton");
  soundButton.disabled = false;
  shuffleButton.disabled = false;

  audioSource.value = playList[0];
}

function shuffleMusic() {
  let randomSong = Math.floor(Math.random() * playList.length);

  if (randomSong === selectedSong.value) {
    shuffleMusic();
    return;
  }
  selectedSong.value = randomSong;

  audioSource.value = playList[randomSong];
}

onMounted(async () => {
  await fetchQuiz();
});
let playList = [
  "../src/assets/Sounds/QuizBackgroundMusic3.mp3",
  "../src/assets/Sounds/ThinkingTime.mp3",
];
const audioSource = ref(playList[0]);
const soundPic = ref("../src/assets/unmuted.png");
const shufflePic = ref("../src/assets/shuffle.png");
const selectedSong = ref(0);
</script>

<template>
  <div>
    <div class="queWrap">
      <div class="ControlPanel">
        <div>
          <button id="shuffleButton" class="soundControl" @click="shuffleMusic">
            <img :src="shufflePic" />
          </button>
        </div>
        <div class="digital-clock">
          <div>
            <span class="time">{{ formattedTime }}</span>
          </div>
        </div>
        <div>
          <button id="soundButton" class="soundControl" @click="toggleSound">
            <img :src="soundPic" />
          </button>
          <input
            class="volumeClass"
            @change="toggleSound"
            type="range"
            hidden
            id="volume"
            name="volume"
            min="0"
            max="1"
            step="0.1"
            value="1"
          />
        </div>
      </div>

      <div class="question" v-if="question">
        {{ brojac + 1 }}/10 {{ question.que_text }}
      </div>
      <div class="ansWrap">
        <button
          :style="[
            correctIdFromApi === answer.ans_id
              ? { backgroundColor: 'rgb(91, 150, 91)', color: 'black' }
              : {},
            chosenId === answer.ans_id && isCorrectFromApi
              ? {
                  backgroundColor: 'rgb(91, 150, 91)',
                  color: 'black',
                  border: '1.5px solid black',
                }
              : {},
            chosenId === answer.ans_id && !isCorrectFromApi
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
        class="btn-base next-question-btn"
        v-if="
          correctIdFromApi &&
          numOfAnsQueFromApi < 10 &&
          isGameFinishedFromApi == null
        "
        @click="nextQuestion()"
      >
        Next Question
        <font-awesome-icon :icon="['fas', 'arrow-right-long']" />
      </button>
      <div class="finished-div" v-if="isGameFinishedFromApi">
        <span v-if="numOfCorrectAnswersFromApi == 10">
          <FireworksComp></FireworksComp>
        </span>
        <p>
          <span v-if="quizTime <= 0">Time is up!</span> You got
          {{ numOfCorrectAnswersFromApi }}
          out of 10 questions correct! That's {{ scoreFromApi }}%!
        </p>

        <div class="finished-btns-div">
          <button @click="fetchQuiz" class="btn-base btn-quiz">
            Play again
          </button>
          <RouterLink :to="{ name: 'home' }">
            <button class="btn-base btn-quiz">
              Change category
            </button></RouterLink
          >
        </div>
      </div>
      <div>
        <audio
          ref="audioPlayer"
          id="myAudio"
          :src="audioSource"
          loop
          autoplay
        ></audio>
      </div>
    </div>
  </div>
</template>

<style scoped>
.volumeClass {
  width: 100px;
  margin-left: 10px;
  margin-right: -110px;
}
.soundControl > img {
  color: white;
  width: 30px;
  height: 30px;
}

.soundControl {
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid #fff;
  border-left: #aaa;
  border-bottom: #aaa;
  color: #fff;
  text-align: center;
  cursor: pointer;
  font-size: 0.8em;
  text-wrap: wrap;
  margin-top: 3vh;
}
.soundControl:hover {
  box-shadow: 0 0 8px #0f0;
}
.soundControl:disabled:hover {
  cursor: no-drop;
  box-shadow: 0 0 8px rgb(255, 0, 0);
}
.ControlPanel {
  gap: 10px;
  display: flex;
}
@font-face {
  font-family: "DigitalClockFont";
  src: url("../assets/Fonts/DigitalClockFont.otf");
}

.queWrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px auto;
}

.ansWrap {
  display: grid;
  grid-template-columns: repeat(1, 1fr); /* creates two columns */
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
}

.next-question-btn:hover {
  background: none;
  box-shadow: 0 0 10px #0f0;
  animation: none;
}

.finished-div {
  text-align: center;
  width: 100%;
  position: relative;
}

.finished-div p {
  font-size: 2em;
  padding: 15px 20px;
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
.btn-quiz {
  margin: 10px;
}

/* digital clock  */
.digital-clock {
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.11);
  border-radius: 10px;
  box-shadow: 5px -5px 1px rgba(146, 111, 146, 0.753);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  margin: 20px auto;
  width: 60px;
  height: 17px;
  border-right: rgba(255, 255, 255, 0.613) solid 1px;
  border-top: rgba(255, 255, 255, 0.536) solid 1px;
  align-self: flex-end;
  font-size: 0.7em;
}

.time {
  color: #ffffff;
  font-family: "DigitalClockFont";
  font-size: 5em;
  text-shadow: 0 0 10px #9bc79c;
  font-weight: normal;
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
