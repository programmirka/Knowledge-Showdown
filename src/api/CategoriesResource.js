import axios from "./config";

export default {
  async getAllCategories() {
    return axios.get("/api/cat_ser/categories");
  },
};
