import axios from "./config";

export default {
  async perCategories() {
    return axios.get("/api/cat_usr_leaderboard/leaderboard");
  },
};
