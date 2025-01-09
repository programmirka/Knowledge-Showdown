<script setup>
import CategoriesResource from "../api/CategoriesResource";
import CategoryCard from "../components/CategoryCard.vue";

import { ref, onMounted } from "vue";

async function fetchAllCategories() {
  try {
    const response = await CategoriesResource.getAllCategories();
    categories.value = response.data.categories;
  } catch (err) {
    console.log(err);
  }
}

const categories = ref();
onMounted(() => {
  fetchAllCategories();
});
</script>

<template>
  <main class="center">
    <div class="about">
      Pick Your Quiz and Test Your Brilliance in the Ultimate Knowledge
      Showdown!
    </div>
    <div class="cards">
      <CategoryCard
        v-for="(category, i) in categories"
        :key="i"
        :name="category.cat_name"
        :id="category.cat_id"
        :img="category.cat_img"
      ></CategoryCard>
    </div>
  </main>
</template>
<style scoped>
.about {
  text-shadow: 2px 2px 5px rgba(255, 0, 187, 0.735);
  color: white;
  /* margin: 50px 10px 30px; */
  margin: 20px 10px 10px;
  padding: 10px 20px;
  font-size: 35px;
  font-weight: 600;
  text-align: center;
  font-size: 20px;
}

.cards {
  display: grid;
  grid-template-columns: repeat(1, 1fr);

  justify-items: center;
  align-items: center;
  /* display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap; */
  margin: 10px 10px;
}

.center {
  display: flex;
  flex-direction: column;
  /* justify-content: center;
  align-items: center; */
}

@media (min-width: 640px) {
  .register {
    width: 540px;
    min-height: 800px;
    margin-top: 50px;
    padding: 8px 70px;
  }
}

@media (min-width: 768px) {
  .about {
    font-size: 35px;
    margin: 50px 10px 30px;
  }
}

@media (min-width: 900px) {
  .cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1300px) {
  .cards {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 640px) and (orientation: landscape) {
}
</style>
