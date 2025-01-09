<script setup>
import AdminResource from "../api/AdminResource";
import LocalStorage from "../services/LocalStorage";
import SearchComp from "../components/SearchComp.vue";
import AddCategoryModal from "../components/AddCategoryModal.vue";
import EditCategoryModal from "../components/EditCategoryModal.vue";
import Permissions from "../services/Permissions";
import { ref, onMounted, computed } from "vue";

const user_all_check = ref(false);
const user_all = 5;

//for loggedin user
let role = LocalStorage.getUser().rol_name;
let id = LocalStorage.id();

const categories = ref([]);
const searchPlaceholder = ref("Type in to search...");
const addCatModalVisibility = ref(false);
const editCatModalVisibility = ref(false);
const idCategoryForEdit = ref("");
const quideVisibility = ref(false);

async function searchCategories(term) {
  if (term.trim().length < 1) {
    fetchCategoriesList();
    return;
  }
  try {
    const response = await AdminResource.searchCategories(term.trim());
    categories.value = response.data.searchDB;
  } catch (err) {
    console.error(err.message);
  }
}
async function openEdit(id) {
  idCategoryForEdit.value = id;
  editCatModalVisibility.value = true;
}

async function fetchCategoriesList() {
  try {
    try {
      reloadPicture();
    } catch (err) {
      //
    }

    const response = await AdminResource.getAllCategories();
    categories.value = response.data.categories;
  } catch (err) {
    console.error(err.message);
  }
}

async function switchDeleteCat(id) {
  try {
    const response = await AdminResource.switchDeleteCat(id);
    fetchCategoriesList();
  } catch (err) {
    console.error(err);
  }
}
function reloadPicture() {
  let image = document.getElementById("catImage123");
  let currentSrc = image.src;
  image.src = "";
  image.src = currentSrc;
}

onMounted(async () => {
  await fetchCategoriesList();
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
        <h1>Admin Panel - All Categories</h1>

        <div
          class="add-new"
          title="Add New Category"
          @click="addCatModalVisibility = true"
        >
          +
        </div>
      </div>

      <h2 @click="quideVisibility = !quideVisibility">
        Quick Guide for Category Management
        <span v-if="quideVisibility === false">
          (click to unhide) <font-awesome-icon :icon="['far', 'eye']" /></span
        ><span v-else>
          (click to hide) <font-awesome-icon :icon="['far', 'eye-slash']"
        /></span>
      </h2>
      <transition name="fade">
        <div class="guide" v-show="quideVisibility">
          <h3>Adding a New Category</h3>
          <ul>
            <li>Click 'Add Category' at the top.</li>
            <li>Enter the new category name and description.</li>
            <li>Click 'Save'.</li>
          </ul>
          <h3>Editing Categories</h3>
          <ul>
            <li>Click 'Edit' next to the category you want to change.</li>
            <li>Modify the name and/or description.</li>
            <li>Click 'Update' to apply changes.</li>
          </ul>
          <h3>Deleting Categories</h3>
          <ul>
            <li>Press 'Delete' for the unwanted category.</li>
            <li>Confirm the deletion.</li>
          </ul>
          Please Note: Deleting a category is permanent and removes it from user
          options. Ensure that no active quizzes require the category before
          deletion.
        </div>
      </transition>
    </div>
    <search-comp
      @searchTerm="searchCategories"
      :placeholder="searchPlaceholder"
    ></search-comp>

    <div class="searchResults">
      <table>
        <tr>
          <th></th>
          <th>Name</th>
          <th class="hidden unhidden">Description</th>
          <th>Image</th>
          <th>Deleted</th>
          <th>Edit</th>
        </tr>
        <tr
          v-if="categories.length"
          v-for="(category, i) in categories"
          :key="i"
          :class="{ grey: i % 2 }"
        >
          <td style="white-space: nowrap">{{ i + 1 }}.</td>

          <td>
            {{ category.cat_name }}
          </td>

          <td class="hidden unhidden">
            {{ category.cat_description }}
          </td>
          <td>
            <div>
              <img class="catImg" id="catImage123" :src="category.cat_img" />
            </div>
          </td>
          <td class="center small-width">
            <label class="switch">
              <input
                :checked="category.cat_is_deleted !== null"
                @change="switchDeleteCat(category.cat_id)"
                type="checkbox"
                :id="categories.length + i"
              />
              <span class="slider"></span>
            </label>
          </td>
          <td class="small-width">
            <font-awesome-icon
              :icon="['fas', 'pen-to-square']"
              size="2xl"
              @click="openEdit(category.cat_id)"
              class="editBtn"
            />
          </td>
        </tr>
        <tr v-else>
          <td colspan="5">
            Oops! We couldn't find any results for that term. Please try a
            different keyword or phrase.
          </td>
        </tr>
      </table>
      <AddCategoryModal
        :addCatModalVisibility="addCatModalVisibility"
        @close="addCatModalVisibility = false"
        @newCategoryAdded="fetchCategoriesList"
      ></AddCategoryModal>
      <EditCategoryModal
        v-if="editCatModalVisibility"
        :editCatModalVisibility="editCatModalVisibility"
        @close="editCatModalVisibility = false"
        @categoryEdited="fetchCategoriesList"
        :category_id="idCategoryForEdit"
      ></EditCategoryModal>
    </div>
  </div>
</template>

<style scoped>
.catImg {
  height: 9vh;
  border: 0.5px rgba(255, 255, 255, 0.784) solid;
  border-radius: 10px;
  padding: 10px;
  box-shadow: -3px 5px 6px -1px rgba(0, 0, 0, 0.204);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}

.editBtn {
  margin-left: 5px;
  margin-right: 5px;
  cursor: pointer;
}

.small-width {
  width: 5%;
}

@media (max-width: 1600px) {
  .hidden {
    display: none;
  }
  .catImg {
    padding: 3px;
    overflow: hidden;
    width: 60px;
    height: auto;
  }
}
</style>
