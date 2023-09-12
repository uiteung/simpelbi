import { CihuyPostAMI, ShowDataAMI } from "../js/config/configami.js"
import { UrlAMI, token } from "../js/template/template.js";
import {
    CihuyDataAPI,
  } from "https://c-craftjs.github.io/simpelbi/api.js";
  
CihuyDataAPI(UrlAMI, token, (error, response) => {
    if (error) {
      console.error("Terjadi kesalahan:", error);
    } else {
      const data = response.data;
      console.log("Data yang diterima:", data);
      ShowDataAMI(data);
    }
  });

