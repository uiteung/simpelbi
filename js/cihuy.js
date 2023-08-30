import { CihuyGetCookie } from "https://c-craftjs.github.io/cookies/cookies.js";
import { CihuyGetHeaders } from "https://c-craftjs.github.io/api/api.js";

let token = CihuyGetCookie("Login");
console.log(token);

// myHeaders.append("LOGIN", token);
const apiUrl = "https://simbe-dev.ulbi.ac.id/api/v1/admins/";

// CihuyGetSimpelbi(target_url, token);
CihuyGetHeaders(apiUrl, token)
  .then((result) => console.log(result))
  .catch((error) => console.error("Error:", error));

console.log(CihuyGetHeaders, ResponseGet);
