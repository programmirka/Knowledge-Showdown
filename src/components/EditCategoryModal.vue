<script setup>
import Validation from "@/services/Validation.js";
import AdminResource from "@/api/AdminResource.js";
import CategoriesResource from "@/api/CategoriesResource.js";

import { ref, onMounted, watch } from "vue";

const emits = defineEmits(["close", "categoryEdited"]);
const props = defineProps(["editCatModalVisibility", "category_id"]);
const categoryFromApi = ref("");
const editCategory = ref({});

let isPictureOk = false;
let PictureErrors = ref();

const errors = ref({
  cat_name: "",
  cat_description: "",
  file: null,
});

async function submit() {
  if (errors.value.cat_name || errors.value.cat_description) {
    return alert("Please finish the form");
  }
  try {
    let formData = new FormData();
    formData.append("cat_name", editCategory.value.cat_name.trim());
    formData.append(
      "cat_description",
      editCategory.value.cat_description.trim()
    );
    formData.append("file", editCategory.value.cat_img);
    formData.append("cat_id", editCategory.value.cat_id);

    const response = await AdminResource.editCategory(formData);
    emits("categoryEdited");
    emits("close");
  } catch (err) {
    console.log(err);
  }
}

async function fetchCategoryFromApi() {
  try {
    const response = await AdminResource.getCategoryForEdit(props.category_id);
    categoryFromApi.value = response.data.category[0];
  } catch (err) {
    console.error(err.message);
  }
}

function closeModal() {
  emits("close");
}

watch(
  () => editCategory.value.cat_name,
  (newVal) => {
    if (newVal) {
      errors.value.cat_name = Validation.cat_name(newVal);
    }
  }
);

watch(
  () => editCategory.value.cat_description,
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
      errors.value.cat_img = event.target.files[0];
      editCategory.value.cat_img = event.target.files[0];
    } else {
      return (PictureErrors.value = "Can only accept .png, .jpg, .jpeg files");
    }
    return "";
  } else {
    return (PictureErrors.value = "Empty image");
  }
}

onMounted(async () => {
  await fetchCategoryFromApi();
  editCategory.value = {
    cat_name: categoryFromApi.value.cat_name,
    cat_description: categoryFromApi.value.cat_description,
    cat_id: categoryFromApi.value.cat_id,
    cat_img: categoryFromApi.value.cat_img,
  };
});
</script>
<template>
  <div class="modal" v-show="editCatModalVisibility">
    <div class="addNewCategory">
      <div class="registerTitle">
        <span class="close" @click="closeModal"> &times</span>
        <h1>Edit Category</h1>
      </div>
      <form @submit.prevent="submit">
        <div class="addNewCategoryForm">
          <BaseInput
            v-model="editCategory.cat_name"
            label="Category Name"
            type="text"
            :error="errors.cat_name"
            required
          ></BaseInput>
          <BaseTextarea
            v-model="editCategory.cat_description"
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
