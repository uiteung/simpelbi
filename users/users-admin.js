import { CihuyDataAPI } from "https://c-craftjs.github.io/simpelbi/api.js";
import {token, UrlGetUsersAdmin} from "../js/template/template.js"
import { ShowDataUsersAdmin } from "../js/config/configusersadmin.js";

// Untuk Get Data dari API
CihuyDataAPI(UrlGetUsersAdmin, token, (error, response) => {
    if (error) {
      console.error("Terjadi kesalahan:", error);
    } else {
      const data = response.data;
      console.log("Data yang diterima:", data);
      ShowDataUsersAdmin(data);
    }
  });