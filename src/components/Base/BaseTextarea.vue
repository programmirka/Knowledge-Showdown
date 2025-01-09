<template>
  <label class="textLabel" :for="uuid" v-if="label"
    >{{ label }} <span class="error" v-if="error"> {{ error }}</span></label
  ><br />
  <textarea
    v-bind="$attrs"
    :placeholder="label"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    :id="uuid"
    class="field"
  ></textarea
  ><br />
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
  },
  setup() {
    const uuid = UniqueID().getID();
    return {
      uuid,
    };
  },
};

/* 
  <BaseTextarea
  v-model="user.name" 
  label="Name" 
  type="text">
  </BaseTextarea>
  */
</script>
<style scoped>
.field {
  padding: 15px 15px 15px 10px;
  /* margin: 2px 0 13px; */
  margin: 0px 0px 10px;
  font-family: "Montserrat", sans-serif;
  font-size: 1em;
  font-weight: 200;
  width: 300px;
  height: 100px;
  border-radius: 10px;
  border: 0.5px rgba(128, 128, 128, 0.444) solid;
  background-color: rgb(242, 242, 242);
  box-shadow: 0px 3px 10px -1px rgba(0, 0, 0, 0.233);
  resize: none;
  box-sizing: border-box;
}
.error {
  font-family: "Montserrat", sans-serif;
  color: rgba(220, 220, 220, 0.895);
  text-shadow: 0.5px 0.5px #656565;
  font-size: 0.8em;
  font-weight: 200;
  padding: 1px;
  line-height: 50%;
  letter-spacing: -0.5px;
}
.textLabel {
  font-size: 1.1em;
  font-weight: 400;
  color: rgb(255, 255, 255);
  /* width: 100%; */
  line-height: 0.1;
}
@media (min-width: 640px) {
  .field {
    width: 400px;
  }
}
</style>
