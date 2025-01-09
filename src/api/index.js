import axios from "./config.js";

export default {
  async getTestMessage() {
    return axios.get("/apiTest/test");
  },
};
