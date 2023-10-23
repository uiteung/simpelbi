import { CihuyGetHeaders } from "../js/getfunc";
import { CihuyGetCookie } from "https://c-craftjs.github.io/cookies/cookies.js";
import { populateUserProfile } from "https://c-craftjs.github.io/simpelbi/profile.js";

const apiUrl = 'https://simbe-dev.ulbi.ac.id/api/v1/admins/';
const token = CihuyGetCookie("login");

// Untuk GET Data Profile
populateUserProfile()

CihuyGetHeaders(apiUrl, token)
  .then((data) => {
    
  })
  .catch((error) => {
    console.error("Error:", error);
  });