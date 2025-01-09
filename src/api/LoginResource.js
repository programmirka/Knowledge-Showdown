import axios from "./config";

export default {
  async login(user) {
    return axios.post("/api/auth/login", user);
  },
  async logout() {
    return axios.get("/api/auth/logout");
  },
};
