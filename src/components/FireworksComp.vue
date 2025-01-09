<template>
  <div class="fireworksWrapper">
    <div class="pyro">
      <div class="before"></div>
      <div class="after"></div>
    </div>

    <div class="pyro">
      <div class="before"></div>
      <div class="after"></div>
    </div>
    <div class="pyro">
      <div class="before"></div>
      <div class="after"></div>
    </div>

    <div class="pyro left">
      <div class="before"></div>
      <div class="after"></div>
    </div>
  </div>
</template>
<script setup></script>
<style scoped>
body {
  margin: 0;
  padding: 0;

  overflow: hidden;
}
.fireworksWrapper {
  position: absolute;
}

.pyro > .before,
.pyro > .after {
  overflow: visible;
  position: fixed;
  width: 10px;
  height: 5px;
  border-radius: 50%;
  box-shadow: 0 0 #fff;
  animation: 1s bang ease-out infinite backwards,
    1s gravity ease-in infinite backwards, 5s position linear infinite backwards;
}

.pyro > .after {
  animation-delay: 1.25s;
  animation-duration: 1.25s, 1.25s, 6.25s;
}

@keyframes bang {
  to {
    box-shadow: 10px -250px hsl(160, 100%, 50%),
      290px -300px hsl(200, 100%, 50%), -120px -360px hsl(40, 100%, 50%),
      140px -120px hsl(240, 100%, 50%), -250px -250px hsl(300, 100%, 50%),
      200px -100px hsl(90, 100%, 50%);
  }
}

@keyframes gravity {
  to {
    transform: translateY(200px);
    opacity: 0;
  }
}
@keyframes position {
  0%,
  100% {
    margin-top: 20%; /* Slightly below the vertical center */
    margin-left: 40%; /* Horizontally centered */
    transform: translate(
      -50%,
      -50%
    ); /* Center the element based on its own size */
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translate(-50%, -50%);
  }
}

.pyro.left > .before,
.pyro.left > .after {
  /* Left-Sided Fireworks Styles */
  animation: 1s bang ease-out infinite backwards,
    1s gravity ease-in infinite backwards,
    5s position-left linear infinite backwards;
}

@keyframes position-left {
  0%,
  100% {
    margin-top: 20%;
    margin-left: 0%; /* Adjust for left side */
    transform: translate(-50%, -50%);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translate(-50%, -50%);
  }
}

@media (max-width: 1200px) {
  @keyframes position {
    0%,
    100% {
      margin-top: 20%;
      margin-left: 60%;
      transform: translate(-50%, -50%);
    }
    10%,
    30%,
    50%,
    70%,
    90% {
      transform: translate(-50%, -50%);
    }
  }
}
</style>
