import axios from "./config";

export default {
  async getAll() {
    return axios.get("/api/ava_ser/avatars");
  },
};
