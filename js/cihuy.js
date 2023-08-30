import { CihuyGetCookie } from "https://c-craftjs.github.io/cookies/cookies.js";
import {
  CihuyGetSimpelbi,
  ResponseGet,
} from "https://c-craftjs.github.io/api/api.js";

let token = CihuyGetCookie("login");
console.log(token);
let target_url = "https://simbe-dev.ulbi.ac.id/api/v1/admins/";
const responseData = "Data yang ingin Ditampilkan";
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Authorization", `Bearer ${token}`);

CihuyGetSimpelbi(target_url, token);
ResponseGet(responseData);
