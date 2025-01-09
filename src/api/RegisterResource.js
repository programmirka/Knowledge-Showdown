import axios from "./config";

export default {
  async register(user) {
    return axios.post("/api/register", user);
  },
};
