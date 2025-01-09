<script setup>
import Validation from "@/services/Validation.js";
import AdminResource from "@/api/AdminResource.js";

import { ref, onMounted, watch } from "vue";

const emits = defineEmits(["close", "questionEdited"]);
const props = defineProps(["editQueModalVisibility", "que_id"]);
const questionFromApi = ref("");
const categoriesFromApi = ref([]);
const editQuestion = ref({});

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
    const response = await AdminResource.editQuestion({
      question: {
        que_text: editQuestion.value.question.que_text.trim(),
        que_id: editQuestion.value.question.que_id,
      },
      categories: editQuestion.value.categories,
      answer_correct: {
        ans_text: editQuestion.value.answer_correct.ans_text.trim(),
        ans_id: editQuestion.value.answer_correct.ans_id,
      },
      answer_false1: {
        ans_text: editQuestion.value.answer_false1.ans_text.trim(),
        ans_id: editQuestion.value.answer_false1.ans_id,
      },
      answer_false2: {
        ans_text: editQuestion.value.answer_false2.ans_text.trim(),
        ans_id: editQuestion.value.answer_false2.ans_id,
      },
      answer_false3: {
        ans_text: editQuestion.value.answer_false3.ans_text.trim(),
        ans_id: editQuestion.value.answer_false3.ans_id,
      },
    });
    emits("close");
    emits("questionEdited");
    alert("Question is successfully edited!");
  } catch (err) {
    console.log(err);
  }
}

async function fetchQuestionFromApi() {
  try {
    const response = await AdminResource.getQuestionForEdit(props.que_id);
    questionFromApi.value = response.data.question[0];
  } catch (err) {
    console.error(err.message);
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

await fetchCategoriesList();
await fetchQuestionFromApi();
editQuestion.value = {
  question: {
    que_text: questionFromApi.value.que_text,
    que_id: questionFromApi.value.que_id,
  },
  categories: questionFromApi.value.categories,
  answer_correct: {
    ans_text: questionFromApi.value.answers[0].ans_text,
    ans_id: questionFromApi.value.answers[0].ans_id,
  },
  answer_false1: {
    ans_text: questionFromApi.value.answers[1].ans_text,
    ans_id: questionFromApi.value.answers[1].ans_id,
  },
  answer_false2: {
    ans_text: questionFromApi.value.answers[2].ans_text,
    ans_id: questionFromApi.value.answers[2].ans_id,
  },
  answer_false3: {
    ans_text: questionFromApi.value.answers[3].ans_text,
    ans_id: questionFromApi.value.answers[3].ans_id,
  },
};

watch(
  () => editQuestion.value.question.que_text,
  (newVal) => {
    if (newVal) {
      errors.value.que_text = Validation.question(newVal);
    }
  }
);

watch(
  () => editQuestion.value.answer_correct.ans_text,
  (newVal) => {
    if (newVal) {
      errors.value.answer_correct = Validation.answer(newVal);
    }
  }
);
watch(
  () => editQuestion.value.answer_false1.ans_text,
  (newVal) => {
    if (newVal) {
      errors.value.answer_false1 = Validation.answer(newVal);
    }
  }
);
watch(
  () => editQuestion.value.answer_false2.ans_text,
  (newVal) => {
    if (newVal) {
      errors.value.answer_false2 = Validation.answer(newVal);
    }
  }
);
watch(
  () => editQuestion.value.answer_false3.ans_text,
  (newVal) => {
    if (newVal) {
      errors.value.answer_false3 = Validation.answer(newVal);
    }
  }
);
</script>
<template>
  <div class="modal" v-show="editQueModalVisibility">
    <div class="addNewQuestion">
      <div class="registerTitle">
        <span class="close" @click="closeModal"> &times</span>
        <h1>Edit Question</h1>
      </div>
      <form @submit.prevent="submit">
        <div class="addNewQuestionForm">
          <div>
            <BaseTextarea
              v-model="editQuestion.question.que_text"
              label="Question text"
              type="text"
              required
              :error="errors.que_text"
            ></BaseTextarea>
            <label>Select categories:</label>
            <div class="checkbox-list">
              <div v-for="category in categoriesFromApi" :key="category.cat_id">
                <input
                  type="checkbox"
                  :value="category.cat_id"
                  :id="category.cat_id"
                  v-model="editQuestion.categories"
                  :error="errors.cat_id"
                  :disabled="category.cat_id === 23"
                />
                <label :for="category.cat_id">{{ category.cat_name }}</label>
              </div>
            </div>
          </div>
          <div>
            <BaseInput
              v-model="editQuestion.answer_correct.ans_text"
              label="Correct answer"
              type="text"
              :error="errors.answer_correct"
              required
            ></BaseInput>
            <BaseInput
              v-model="editQuestion.answer_false1.ans_text"
              label="False answer #1"
              type="text"
              :error="errors.answer_false1"
              required
            ></BaseInput>
            <BaseInput
              v-model="editQuestion.answer_false2.ans_text"
              label="False answer #2"
              type="text"
              :error="errors.answer_false2"
              required
            ></BaseInput>
            <BaseInput
              v-model="editQuestion.answer_false3.ans_text"
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
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: #fff;
  border: 1px solid #fff;
  border-left: #aaa;
  border-bottom: #aaa;
}

* {
  box-sizing: border-box;
}
.registerTitle h1 {
  margin: 0px;
  padding: 10px;
  text-align: center;
  color: #fff;
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
  .submit {
    width: 400px;
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
  .submit {
    width: 400px;
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
