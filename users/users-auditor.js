import { CihuyDataAPI } from "https://c-craftjs.github.io/simpelbi/api.js";
import { token, UrlGetUsersAuditor } from "../js/template/template.js"
import { ShowDataUsersAuditor } from "../js/config/configusersauditor.js";

// Untuk Get Data dari API
CihuyDataAPI(UrlGetUsersAuditor, token, (error, response) => {
    if (error) {
      console.error("Terjadi kesalahan:", error);
    } else {
      const data = response.data;
      console.log("Data yang diterima:", data);
      ShowDataUsersAuditor(data);
    }
  });