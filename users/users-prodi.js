import { CihuyDataAPI } from "https://c-craftjs.github.io/simpelbi/api.js";
import { token, UrlGetUsersProdi } from "../js/template/template.js"
import { ShowDataUsersProdi } from "../js/config/configusersprodi.js";

// Untuk Get Data dari API
CihuyDataAPI(UrlGetUsersProdi, token, (error, response) => {
    if (error) {
      console.error("Terjadi kesalahan:", error);
    } else {
      const data = response.data;
      console.log("Data yang diterima:", data);
      ShowDataUsersProdi(data);
    }
  });