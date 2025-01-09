import axios from "axios";
import LocalStorage from "../services/LocalStorage";

let sid = LocalStorage.getSid();

const instance = axios.create({
  baseURL: "http://226d123.e2.mars-hosting.com",
  headers: {
    "X-MARS-SID": sid,
  },
});

export default instance;
