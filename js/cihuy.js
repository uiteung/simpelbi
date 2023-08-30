import { CihuyGetCookie } from "https://c-craftjs.github.io/cookies/cookies.js";
import { CihuyGetHeaders } from "https://c-craftjs.github.io/api/api.js";
import { CihuyQuerySelector } from "https://c-craftjs.github.io/element/element.js";
import { CihuyRole } from "https://c-craftjs.github.io/link/link.js";

const masukbutton = CihuyQuerySelector(masukButton);
masukbutton.forEach((button) => {
  button.addEventListener("click", (e) => {
    let token = CihuyGetCookie("login");
    const apiUrl = "https://simbe-dev.ulbi.ac.id/api/v1/admins/";
    CihuyGetHeaders(apiUrl, token)
      .then((result) => {
        const userRole = JSON.parse(result).role;
        CihuyRole(userRole);
      })
      .catch((error) => console.error("Error:", error));
  });
});

console.log(CihuyGetHeaders);
