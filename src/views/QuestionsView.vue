<script setup>
import AdminResource from "../api/AdminResource";
import LocalStorage from "../services/LocalStorage";
import SearchComp from "../components/SearchComp.vue";
import AddQuestionModal from "../components/AddQuestionModal.vue";
import EditQuestionModal from "../components/EditQuestionModal.vue";
import Permissions from "../services/Permissions";
import { ref, onMounted, computed } from "vue";

const user_all_check = ref(false);
const user_all = 5;

//for loggedin user
let role = LocalStorage.getUser().rol_name;
let id = LocalStorage.id();

const questions = ref([]);
const searchPlaceholder = ref("Type in to search...");
const addQueModalVisibility = ref(false);
const editQueModalVisibility = ref(false);
const idQuestionForEdit = ref("");
const quideVisibility = ref(false);

async function openEdit(id) {
  idQuestionForEdit.value = id;
  editQueModalVisibility.value = true;
}

const colors = ref([
  "rgba(129, 199, 132, 0.7)",
  "rgba(135, 206, 235, 0.7)",
  "rgba(255, 182, 193, 0.7)",
  "rgba(230, 190, 255, 0.7)",
  "rgba(255, 218, 185, 0.7)",
  "rgba(255, 250, 205, 0.7)",
]);
const getColor = (index) => {
  return colors.value[index % colors.value.length];
};

async function searchQuestions(term) {
  if (term.trim().length < 1) {
    fetchQuestionList();
    return;
  }
  try {
    const response = await AdminResource.searchQuestions(term.trim());
    questions.value = response.data.question;
  } catch (err) {
    console.error(err.message);
  }
}

async function fetchQuestionList() {
  try {
    const response = await AdminResource.getAllQuestions();
    questions.value = response.data.questions;
  } catch (err) {
    console.error(err.message);
  }
}

async function switchDelete(id) {
  try {
    const response = await AdminResource.switchDeleteQ(id);

    fetchQuestionList();
  } catch (err) {
    console.error(err);
  }
}

onMounted(() => {
  fetchQuestionList();
  user_all_check.value = Permissions.checkPermission(user_all);
});
</script>
<template>
  <div class="admin-wrapper">
    <div class="mainAdmin">
      <div v-show="user_all_check" class="back">
        <RouterLink :to="{ name: 'admin' }">
          <font-awesome-icon
            :icon="['fas', 'arrow-left-long']"
            style="color: #ffffff"
          />
        </RouterLink>
      </div>
      <div class="title">
        <h1>Admin Panel - All Questions</h1>

        <div
          class="add-new"
          title="Add New Question"
          @click="addQueModalVisibility = true"
        >
          +
        </div>
      </div>

      <h2 @click="quideVisibility = !quideVisibility">
        Quick Guide for Question Management
        <span v-if="quideVisibility === false">
          (click to unhide) <font-awesome-icon :icon="['far', 'eye']" /></span
        ><span v-else>
          (click to hide) <font-awesome-icon :icon="['far', 'eye-slash']"
        /></span>
      </h2>
      <transition name="fade">
        <div class="guide" v-show="quideVisibility">
          <p>
            The Question Management Dashboard is your comprehensive tool for
            curating the question database.
          </p>
          <h3>Managing Questions</h3>
          <ul>
            <li>
              Viewing Questions: All questions are listed with their text,
              answers, and associated categories.
            </li>
            <li>
              Delete: Use the switch next to each question to delete it from the
              system.
            </li>
            <li>
              Edit: Click the pencil icon beside a question to launch the edit
              modal. Here, you can:
              <ul>
                <li>Modify the question text.</li>
                <li>Change the answers.</li>
                <li>Update the question's categories.</li>
              </ul>
            </li>
          </ul>
          <h3>Searching Questions</h3>
          <ul>
            <li>Utilize the search bar to locate questions by their text.</li>
          </ul>
          <h3>Adding Questions</h3>
          <ul>
            <li>
              Select the 'Create New Question' button at the top right to open
              the question modal, identical to the edit modal, to input a new
              question and its details.
            </li>
          </ul>
          <p>
            Note: Edits and deletions will immediately reflect across the
            platform.
          </p>
        </div>
      </transition>
      <search-comp
        @searchTerm="searchQuestions"
        :placeholder="searchPlaceholder"
      ></search-comp>
    </div>
    <div class="searchResults">
      <table>
        <tr>
          <th></th>
          <th>Question</th>
          <th class="hidden unhidden">Correct Answer</th>
          <th class="hidden unhidden">False Answer #1</th>
          <th class="hidden unhidden">False Answer #2</th>
          <th class="hidden unhidden">False Answer #3</th>
          <th class="hidden unhidden">Category</th>
          <th>Delete</th>
          <th>Edit</th>
        </tr>
        <tr v-show="questions == null">
          <td colspan="4">
            Oops! We couldn't find any results for that term. Please try a
            different keyword or phrase.
          </td>
        </tr>
        <tr
          v-for="(question, i) in questions"
          :key="i"
          :class="{ grey: i % 2 }"
        >
          <td style="white-space: nowrap">{{ i + 1 }}.</td>
          <td>{{ question.que_text }}</td>

          <td
            class="hidden unhidden"
            v-for="(answer, i) in question.answers"
            :key="i"
          >
            {{ answer.ans_text }}
          </td>

          <td class="hidden unhidden">
            <span v-for="(category, i) in question.categories" :key="i">
              <span
                class="categoryItem"
                :style="{ backgroundColor: getColor(i) }"
                v-if="category.cat_id != null"
                >{{ category.cat_name }}</span
              >
            </span>
          </td>
          <td class="center">
            <label class="switch">
              <input
                :checked="question.que_is_deleted !== null"
                @change="switchDelete(question.que_id)"
                type="checkbox"
                :id="questions.length + i"
                :disabled="role === 'Admin'"
              />
              <span
                class="slider"
                :class="{
                  disabledBtn: role === 'Admin',
                }"
              ></span>
            </label>
          </td>
          <td>
            <font-awesome-icon
              :icon="['fas', 'pen-to-square']"
              size="2xl"
              @click="openEdit(question.que_id)"
              class="editBtn"
            />
          </td>
        </tr>
      </table>
      <AddQuestionModal
        :addQueModalVisibility="addQueModalVisibility"
        @close="addQueModalVisibility = false"
        @newQuestionAdded="fetchQuestionList"
      ></AddQuestionModal>
      <Suspense>
        <EditQuestionModal
          v-if="editQueModalVisibility"
          :editQueModalVisibility="editQueModalVisibility"
          @close="editQueModalVisibility = false"
          @questionEdited="fetchQuestionList"
          :que_id="idQuestionForEdit"
        ></EditQuestionModal
      ></Suspense>
    </div>
  </div>
</template>

<style scoped>
.guide ul li,
.guide p {
  font-size: 1em;
  font-weight: 200;
  color: #c1c1c1;
}

.editBtn {
  margin-left: 5px;
  margin-right: 5px;
  cursor: pointer;
}
.editInput {
  height: 100px;
  width: 200px;
  padding: 5px;
  box-sizing: border-box;
  margin: 0px;
}

.categoryItem {
  padding: 3px 5px;
  border-radius: 10px;
  display: inline-block;
  color: #fff;
  margin: 3px;
  font-weight: 700;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}

@media (max-width: 1600px) {
  .hidden {
    display: none;
  }
}
</style>
