<script setup>
import Validation from "@/services/Validation.js";
import AdminResource from "@/api/AdminResource.js";

import { ref, onMounted, watch } from "vue";

const emits = defineEmits(["close", "newQuestionAdded"]);
const props = defineProps(["addQueModalVisibility"]);
const categoriesFromApi = ref([]);

const newQuestion = ref({
  que_text: "",
  categories: [],
  answer_correct: "",
  answer_false1: "",
  answer_false2: "",
  answer_false3: "",
});

const errors = ref({
  que_text: "",
  selectedCategories: "",
  answer_correct: "",
  answer_false1: "",
  answer_false2: "",
  answer_false3: "",
});

async function submit() {
  if (
    errors.value.que_text ||
    errors.value.answer_correct ||
    errors.value.answer_false1 ||
    errors.value.answer_false2 ||
    errors.value.answer_false3
  ) {
    return alert("Please finish the form");
  }
  try {
    const response = await AdminResource.addNewQuestion({
      que_text: newQuestion.value.que_text.trim(),
      categories: newQuestion.value.categories,
      answer_correct: newQuestion.value.answer_correct.trim(),
      answer_false1: newQuestion.value.answer_false1.trim(),
      answer_false2: newQuestion.value.answer_false2.trim(),
      answer_false3: newQuestion.value.answer_false3.trim(),
    });
    alert("You've successfuly added new question");
    emits("close");
    emits("newQuestionAdded");
    newQuestion.value.que_text = "";
    newQuestion.value.categories = [];
    newQuestion.value.answer_correct = "";
    newQuestion.value.answer_false1 = "";
    newQuestion.value.answer_false2 = "";
    newQuestion.value.answer_false3 = "";
  } catch (err) {
    console.log(err);
    if (err.response.status === 409) {
      return alert("Question already exists");
    }
  }
}

function closeModal() {
  emits("close");
}

async function fetchCategoriesList() {
  try {
    const response = await AdminResource.getAllCategories();
    categoriesFromApi.value = response.data.categories;
  } catch (err) {
    console.error(err.message);
  }
}

//pri citavanju treba da popunim listu kategorija, samo neobrisane

watch(
  () => newQuestion.value.que_text,
  (newVal) => {
    if (newVal) {
      errors.value.que_text = Validation.question(newVal);
    }
  }
);

watch(
  () => newQuestion.value.answer_correct,
  (newVal) => {
    if (newVal) {
      errors.value.answer_correct = Validation.answer(newVal);
    }
  }
);
watch(
  () => newQuestion.value.answer_false1,
  (newVal) => {
    if (newVal) {
      errors.value.answer_false1 = Validation.answer(newVal);
    }
  }
);
watch(
  () => newQuestion.value.answer_false2,
  (newVal) => {
    if (newVal) {
      errors.value.answer_false2 = Validation.answer(newVal);
    }
  }
);
watch(
  () => newQuestion.value.answer_false3,
  (newVal) => {
    if (newVal) {
      errors.value.answer_false3 = Validation.answer(newVal);
    }
  }
);

onMounted(() => {
  fetchCategoriesList();
});
</script>
<template>
  <div class="modal" v-show="addQueModalVisibility">
    <div class="addNewQuestion">
      <div class="registerTitle">
        <span class="close" @click="closeModal"> &times</span>
        <h1>Add New Question</h1>
      </div>
      <form @submit.prevent="submit">
        <div class="addNewQuestionForm">
          <div>
            <BaseTextarea
              v-model="newQuestion.que_text"
              label="Question text"
              type="text"
              required
              :error="errors.que_text"
            ></BaseTextarea>
            <label>Select categories:</label>
            <div class="checkbox-list">
              <div v-for="category in categoriesFromApi" :key="category.id">
                <label :for="category.cat_id">
                  <input
                    type="checkbox"
                    :value="category.cat_id"
                    :id="category.cat_id"
                    v-model="newQuestion.categories"
                    :error="errors.cat_id"
                    :disabled="category.cat_id === 23"
                  />
                  {{ category.cat_name }}</label
                >
              </div>
            </div>
          </div>
          <div>
            <BaseInput
              v-model="newQuestion.answer_correct"
              label="Correct answer"
              type="text"
              :error="errors.answer_correct"
              required
            ></BaseInput>
            <BaseInput
              v-model="newQuestion.answer_false1"
              label="False answer #1"
              type="text"
              :error="errors.answer_false1"
              required
            ></BaseInput>
            <BaseInput
              v-model="newQuestion.answer_false2"
              label="False answer #2"
              type="text"
              :error="errors.answer_false2"
              required
            ></BaseInput>
            <BaseInput
              v-model="newQuestion.answer_false3"
              label="False answer #3"
              type="text"
              :error="errors.answer_false3"
              required
            ></BaseInput>
          </div>
        </div>

        <button class="btn-base" type="submit">Submit</button>
      </form>
    </div>
  </div>
</template>
<style scoped>
.addNewQuestion {
  width: 340px;
  min-height: 590px;
  padding: 8px 20px;
  position: relative;
  border-radius: 15px;
  box-shadow: -3px 5px 12px -1px rgba(0, 0, 0, 0.559);
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: #fff;
  border: 1px solid #fff;
  border-left: #aaa;
  border-bottom: #aaa;
}

.addNewQuestionForm {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.addNewQuestion form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

* {
  box-sizing: border-box;
}
.registerTitle h1 {
  margin: 0px;
  padding: 10px;
  text-align: center;
  color: #ffffff;
  font-size: 1.5em;
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

.checkbox-list {
  display: flex;
  flex-wrap: wrap; /* Allow wrapping */
  width: 300px;
}

.checkbox-list > div {
  flex: 50%; /* Take up half the container width */
  box-sizing: border-box;
}

@media (min-height: 900px) and (min-width: 640px) {
  .registerTitle h1 {
    font-size: 2em;
  }
}

@media (min-width: 640px) {
  .addNewQuestion {
    width: 500px;
  }

  .checkbox-list {
    width: 400px;
  }
}

@media (min-width: 768px) {
}

@media (min-width: 1024px) {
  .addNewQuestionForm {
    flex-direction: row;
    gap: 50px;
  }
  .addNewQuestion {
    margin-top: 10px;
    width: 1000px;
  }
}

@media (min-width: 640px) and (orientation: landscape) {
  .addNewQuestionForm {
    flex-direction: row;
    gap: 50px;
  }
  .addNewQuestion {
    width: 920px;
  }
}
</style>
