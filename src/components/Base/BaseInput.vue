<template>
  <div>
    <label class="inputLabel" :for="uuid" v-if="label"
      >{{ label }} <span class="error" v-if="error"> {{ error }}</span></label
    ><br />
    <input
      v-bind="$attrs"
      :placeholder="label"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :id="uuid"
      class="field"
      :class="{ disabled: isDisabled }"
      :disabled="isDisabled"
    /><br />
  </div>
</template>
<script>
import UniqueID from "@/services/UniqueID.js";
export default {
  props: {
    label: {
      type: String,
      default: "",
    },
    modelValue: {
      type: [String, Number],
      default: "",
    },
    error: {
      type: String,
      default: "",
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const uuid = UniqueID().getID();
    return {
      uuid,
    };
  },
};

/* 
<BaseInput 
v-model="user.name" 
label="Name" 
type="text">
</BaseInput>
*/
</script>
<style scoped>
.field {
  font-family: "Montserrat", sans-serif;
  padding: 15px 15px 15px 10px;
  /* margin: 0px 0 20px; */
  margin: 0px 0 10px;
  font-size: 1em;
  font-weight: 200;
  width: 300px;
  box-sizing: border-box;
  border-radius: 10px;
  border: 0.5px rgba(128, 128, 128, 0.444) solid;
  background-color: rgb(242, 242, 242);
  box-shadow: 0px 3px 10px -1px rgba(0, 0, 0, 0.233);
}
.error {
  font-family: "Montserrat", sans-serif;
  color: rgba(220, 220, 220, 0.895);
  text-shadow: 0.5px 0.5px #656565;
  font-size: 0.8em;
  font-weight: 200;
  padding: 1px;
  width: 150px;
  line-height: 50%;
  letter-spacing: -0.8px;
}
.inputLabel {
  font-size: 1.1em;
  font-weight: 400;
  color: rgb(255, 255, 255);
  /* width: 100%; */
  line-height: 0.1;
  letter-spacing: -0.2px;
}
.disabled {
  font-weight: 200;
  /* pointer-events: none; Prevents clicking on the input */
  background-color: #e9ecef; /* Gray out the input */
  color: #6c757d;
}

@media (min-height: 900px) {
  .field {
    margin: 0px 0 20px;
  }
}

@media (min-width: 640px) {
  .field {
    width: 400px;
  }
}

@media (min-width: 768px) {
}

/* @media only  and (min-width: 1024px) {
  .field {
    width: 800px;
    height: 80px;
  }
  .inputLabel {
    font-size: 2em;
    font-weight: 400;
    color: rgb(255, 255, 255);
  }
} */

@media (min-width: 640px) and (orientation: landscape) {
}
</style>
