import axios from "./config";

export default {
  async getAllUsers() {
    return axios.get("/api/adm_ser/admins");
  },
  async switchAdmin(id) {
    return axios.put("/api/adm_ser/admins", { usr_id: id });
  },
  async switchDelete(usr_id) {
    return axios.delete("/api/adm_ser/admins/" + usr_id);
  },
  async searchUsers(search) {
    return axios.get("/api/adm_ser/admins/search/" + search);
  },
  ////////////////// QUESTIONS ///////////////////////
  async getAllQuestions() {
    return axios.get("/api/adm_ser/questions");
  },
  async switchDeleteQ(que_id) {
    return axios.delete("/api/adm_ser/questions/" + que_id);
  },
  async getQuestionForEdit(que_id) {
    return axios.get("/api/adm_ser/questions/" + que_id);
  },
  async addNewQuestion(object) {
    return axios.post("/api/adm_ser/questions", object);
  },
  async editQuestion(newQuestion) {
    return axios.put("/api/adm_ser/questions", newQuestion);
  },
  async searchQuestions(search) {
    return axios.get("/api/adm_ser/questions/search/" + search);
  },
  ////////////////// CATEGORIES ///////////////////////
  async getAllCategories() {
    return axios.get("/api/adm_ser/categories");
  },
  async switchDeleteCat(cat_id) {
    return axios.delete("/api/adm_ser/categories/" + cat_id);
  },
  async addNewCategory(object) {
    return axios.post("/api/adm_ser/categories", object, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  async editCategory(object) {
    return axios.put("/api/adm_ser/categories", object, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  async getCategoryForEdit(cat_id) {
    return axios.get("/api/adm_ser/categories/" + cat_id);
  },
  async searchCategories(search) {
    return axios.get("/api/adm_ser/categories/search/" + search);
  },
};
