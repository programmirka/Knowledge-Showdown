<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const current = ref(0);
const timer = ref(null);
const transitionName = ref("fade");
const show = ref(false);
const slides = ref([
  {
    image:
      "https://images.unsplash.com/photo-1568051243858-533a607809a5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80",
    url: "https://images.unsplash.com/photo-1568051243858-533a607809a5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80",
  },
  {
    image:
      "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80",
    url: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80",
  },
  {
    image:
      "https://images.unsplash.com/photo-1520903433380-0422514dee1c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80",
    url: "https://images.unsplash.com/photo-1520903433380-0422514dee1c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80",
  },
]);

function next() {
  transitionName.value = "slide-next";
  current.value = (current.value + 1) % slides.value.length;
}

function prev() {
  transitionName.value = "slide-prev";
  current.value =
    (current.value - 1 + slides.value.length) % slides.value.length;
}

function startRotation() {
  stopRotation(); // Ensure any existing timer is cleared
  timer.value = setInterval(next, 4000);
}

function stopRotation() {
  if (timer.value) {
    clearInterval(timer.value);
    timer.value = null;
  }
}

onMounted(() => {
  show.value = true;
  startRotation();
});

onBeforeUnmount(() => {
  stopRotation();
});
</script>
<template>
  <div class="gallery-div">
    <h2>GALERIJA PROJEKATA</h2>
    <div class="slider-wrapper">
      <div class="slider">
        <Transition :name="transitionName">
          <div
            v-if="show"
            :key="slides[current].url"
            class="slider__item"
            :style="{
              'background-image': 'url(' + slides[current].image + ')',
            }"
            @mouseover="stopRotation"
            @mouseout="startRotation"
          >
            <a :href="slides[current].url" target="_blank" class="slider__link">
            </a>
          </div>
        </Transition>
      </div>
      <div
        class="btn btn-prev"
        @click="prev"
        @mouseover="stopRotation"
        @mouseout="startRotation"
      >
        <i class="fa fa-arrow-left"></i>
      </div>
      <div
        class="btn btn-next"
        @click="next"
        @mouseover="stopRotation"
        @mouseout="startRotation"
      >
        <i class="fa fa-arrow-right"></i>
      </div>
    </div>
  </div>
</template>

<style>
/* Ne rade */

/* Fade transition */
.fade-enter-active {
  transition: opacity 1s;
}
.fade-enter {
  opacity: 0;
}

/* Slide-next transition */
.slide-next-leave-active {
  transition: transform 1.5s ease-in-out;
}
.slide-next-enter-active {
  transition: transform 0.5s ease-in-out;
}
.slide-next-enter {
  transform: translateX(100%);
}
.slide-next-leave-to {
  transform: translateX(-100%);
}

/* Slide-prev transition */
.slide-prev-leave-active {
  transition: transform 1.5s ease-in-out;
}
.slide-prev-enter-active {
  transition: transform 0.5s ease-in-out;
}
.slide-prev-enter {
  transform: translateX(-100%);
}
.slide-prev-leave-to {
  transform: translateX(100%);
}

.slider {
  width: 80%;
  overflow: hidden;
  position: relative;
  /* Maintain aspect ratio with padding-top trick */
  padding-top: 56.25%; /* 16:9 aspect ratio */
}

.slider__item {
  background-size: cover;
  background-position: center;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slider__link {
  display: block;
  width: 100%;
  height: 100%;
  text-align: center;
  text-decoration: none;
  color: inherit;
}

.btn {
  z-index: 10;
  cursor: pointer;
  border: 3px solid red;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  position: absolute;
  top: 50%;
  left: 3%;
  border-radius: 50%;
  transform: translateY(-50%);
  transition: opacity 0.3s;
  user-select: none;
  color: #fff;
  opacity: 0.5;
}
.btn-next {
  left: auto;
  right: 3%;
}
.btn-prev {
  right: auto;
  left: 3%;
}
.btn:hover {
  color: #fff;
  opacity: 1;
}

.gallery-div {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.gallery-div h2 {
  align-self: flex-start;
}

.slider-wrapper {
  display: flex;
  justify-content: center;
  position: relative;
  width: 100%;
}
</style>
