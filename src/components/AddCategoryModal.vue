<script setup>
import Validation from "@/services/Validation.js";
import AdminResource from "@/api/AdminResource.js";
import CategoriesResource from "@/api/CategoriesResource.js";

import { ref, onMounted, watch } from "vue";

const emits = defineEmits(["close", "newCategoryAdded"]);
const props = defineProps(["addCatModalVisibility"]);
const categoriesFromApi = ref([]);

const newCategory = ref({
  cat_name: "",
  cat_description: "",
  file: null,
});

const errors = ref({
  cat_name: "",
  cat_description: "",
  file: null,
});

let isPictureOk = false;
let PictureErrors = ref();
async function submit() {
  if (
    errors.value.cat_name ||
    errors.value.cat_description ||
    isPictureOk === false
  ) {
    return alert("Please finish the form");
  }
  try {
    let formData = new FormData();
    formData.append("cat_name", newCategory.value.cat_name.trim());
    formData.append(
      "cat_description",
      newCategory.value.cat_description.trim()
    );
    formData.append("file", newCategory.value.file);

    const response = await AdminResource.addNewCategory(formData);
    alert("You've successfuly added new category");
    emits("close");
    emits("newCategoryAdded");
    newCategory.value.cat_name = "";
    newCategory.value.cat_description = "";
    newCategory.value.file = null;
  } catch (err) {
    console.log(err);
    if (err.response) {
      if (err.response.status === 500) {
        return alert("Internal server error");
      }
      if (err.response.status === 400) {
        return alert("Bad request, invalid parameters");
      }
    }
  }
}

function closeModal() {
  emits("close");
}

async function fetchCategoriesList() {
  try {
    const response = await CategoriesResource.getAllCategories();
    categoriesFromApi.value = response.data.categories;
  } catch (err) {
    console.error(err.message);
  }
}

//pri citavanju treba da popunim listu kategorija, samo neobrisane

watch(
  () => newCategory.value.cat_name,
  (newVal) => {
    if (newVal) {
      errors.value.cat_name = Validation.cat_name(newVal);
    }
  }
);

watch(
  () => newCategory.value.cat_description,
  (newVal) => {
    if (newVal) {
      errors.value.cat_description = Validation.cat_description(newVal);
    }
  }
);

function handleFileChange(event) {
  let image = event.target.files[0];

  if (image) {
    if (
      image.name.toLowerCase().endsWith(".png") ||
      image.name.toLowerCase().endsWith(".jpg") ||
      image.name.toLowerCase().endsWith(".jpeg")
    ) {
      isPictureOk = true;
      errors.value.file = event.target.files[0];
      newCategory.value.file = event.target.files[0];
    } else {
      return (PictureErrors.value = "Can only accept .png, .jpg, .jpeg files");
    }
    return "";
  } else {
    return (PictureErrors.value = "Empty image");
  }
}

onMounted(() => {
  fetchCategoriesList();
});
</script>
<template>
  <div class="modal" v-show="addCatModalVisibility">
    <div class="addNewCategory">
      <div class="registerTitle">
        <span class="close" @click="closeModal"> &times</span>
        <h1>Add New Category</h1>
      </div>

      <form @submit.prevent="submit" enctype="multipart/form-data">
        <div class="addNewCategoryForm">
          <BaseInput
            v-model="newCategory.cat_name"
            label="Category Name"
            type="text"
            :error="errors.cat_name"
            required
          ></BaseInput>
          <BaseTextarea
            v-model="newCategory.cat_description"
            label="Category Description"
            type="text"
            required
            :error="errors.cat_description"
          ></BaseTextarea>
          <div>
            <div>
              <div>
                <span class="imgTitle">Category Picture</span>
                <span>&nbsp;</span>
                <span class="imgError">{{ PictureErrors }}</span>
              </div>
              <input type="file" ref="fileInput" @change="handleFileChange" />
            </div>
          </div>
        </div>
        <button class="btn-base" type="submit">Submit</button>
      </form>
    </div>
  </div>
</template>
<style scoped>
.imgError {
  font-size: small;
}
.imgTitle {
  font-size: large;
}
.addNewCategory {
  width: 340px;
  min-height: 400px;
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

.addNewCategoryForm {
  width: 300px;
}

* {
  box-sizing: border-box;
}
.registerTitle h1 {
  margin: 0px;
  padding: 10px 0px 30px;
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

@media (min-height: 900px) and (min-width: 640px) {
  .registerTitle h1 {
    font-size: 2em;
  }
}

@media (min-width: 640px) {
  .addNewCategory {
    width: 500px;
  }
  .submit {
    width: 400px;
  }
  .addNewCategoryForm {
    width: 400px;
  }
}

@media (min-width: 768px) {
}

@media (min-width: 1024px) {
  .submit {
    width: 400px;
  }
}

@media (min-width: 640px) and (orientation: landscape) {
}
</style>
