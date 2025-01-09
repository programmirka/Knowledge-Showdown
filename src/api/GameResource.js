import axios from "./config";

export default {
  async startGame(object) {
    return axios.get(
      `/api/que_ser/questions/random10?usr_id=${encodeURIComponent(
        object.usr_id
      )}&cat_id=${encodeURIComponent(object.cat_id)}`
    );
  },
  async checkAnswer(object) {
    return axios.post(`/api/que_ser/questions`, object);
  },
  async betaBlast() {
    return axios.get(`/api/beta_blast/game`);
  },
};
