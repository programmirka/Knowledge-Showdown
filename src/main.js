// import "./assets/main.css";

import upperFirst from "lodash/upperFirst";
import camelCase from "lodash/camelCase";
import Icons from "@/services/Icons.js";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

////////////////////// Font Awesome ////////////////////////////////

/* import font awesome icon component */
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

//creating Base components global
const requireComponent = import.meta.globEager(
  "./components/Base/Base[A-Z]*.(vue|js)"
);

////////////////// Making Base components Global /////////////////////

Object.keys(requireComponent).forEach((fileName) => {
  const componentConfig = requireComponent[fileName];

  // Get the component name from the file name
  const componentName = upperFirst(
    camelCase(fileName.replace(/^\.\/components\/Base\/(.*)\.\w+$/, "$1"))
  );

  // Register the component globally
  app.component(componentName, componentConfig.default || componentConfig);
});

app.use(createPinia());
app.use(router);

app.component("font-awesome-icon", FontAwesomeIcon);

app.mount("#app");
