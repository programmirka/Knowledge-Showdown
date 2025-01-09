import client from "./config";

export default {
  async getAll() {
    return client.get("/api/cou_ser/countries");
  },
};
