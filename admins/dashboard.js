import { CihuyGetHeaders } from "../js/getfunc";
import { CihuyGetCookie } from "https://c-craftjs.github.io/cookies/cookies.js";

const apiUrl = 'https://simbe-dev.ulbi.ac.id/api/v1/admins/';
const token = CihuyGetCookie("login");

CihuyGetHeaders(apiUrl, token)
  .then((data) => {
    
  })
  .catch((error) => {
    console.error("Error:", error);
  });