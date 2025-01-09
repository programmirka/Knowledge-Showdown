import axios from "./config";

export default {
  async getProfile(usr_id) {
    return axios.get("/api/usr_pro_ser/users/" + usr_id);
  },
  async editProfile(object) {
    return axios.put("/api/usr_pro_ser/users", object);
  },
  async editPassword(object) {
    return axios.put("/api/usr_pro_ser/users/password", object);
  },
};
