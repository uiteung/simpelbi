import { CihuyGetCookie } from "https://c-craftjs.github.io/cookies/cookies.js";
import { CihuyGetHeaders } from "https://c-craftjs.github.io/api/api.js";

let token = CihuyGetCookie("Login");
console.log(token);

// myHeaders.append("LOGIN", token);
const apiUrl = "https://simbe-dev.ulbi.ac.id/api/v1/admins/";
responseData = "Data Berhasil Tampil";

// CihuyGetSimpelbi(target_url, token);
ResponseGet(responseData);
CihuyGetHeaders(apiUrl, token)
  .then((ResponseGet) => console.log(ResponseGet))
  .catch((error) => console.error("Error:", error));

console.log(CihuyGetHeaders, ResponseGet);
