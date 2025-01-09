import axios from "./config";

export default {
  async sessionCheck(id) {
    return axios.get("/api/session/" + id);
  },
};
