import { CihuyDataAPI, CihuyPostApi } from "https://c-craftjs.github.io/simpelbi/api.js";
import {token, UrlGetStandar} from "../js/template/template.js"
import { ShowdataStandar } from "../js/config/configstandar.js";

// Untuk Get Data dari API
CihuyDataAPI(UrlGetStandar, token, (error, response) => {
    if (error) {
      console.error("Terjadi kesalahan:", error);
    } else {
      const data = response.data;
      console.log("Data yang diterima:", data);
      ShowdataStandar(data);
    }
  });