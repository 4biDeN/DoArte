import { boot } from "quasar/wrappers";
import axios from "axios";

const api = axios.create({ baseURL: "http://127.0.0.1:3000" });

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
});

export { api };
