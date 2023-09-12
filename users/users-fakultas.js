import { CihuyDataAPI } from "https://c-craftjs.github.io/simpelbi/api.js";
import { token, UrlGetUsersFakultas } from "../js/template/template.js"
import { ShowDataUsersFakultas } from "../js/config/configusersfakultas.js";

// Untuk Get Data dari API
CihuyDataAPI(UrlGetUsersFakultas, token, (error, response) => {
    if (error) {
      console.error("Terjadi kesalahan:", error);
    } else {
      const data = response.data;
      console.log("Data yang diterima:", data);
      ShowDataUsersFakultas(data);
    }
  });