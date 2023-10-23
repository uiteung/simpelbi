import { CihuyGetHeaders } from "../js/getfunc";
import { CihuyGetCookie } from "https://c-craftjs.github.io/cookies/cookies.js";
import { populateUserProfile } from "https://c-craftjs.github.io/simpelbi/profile.js";

// Untuk GET Data Profile
populateUserProfile()

const apiUrl = 'https://simbe-dev.ulbi.ac.id/api/v1/admins/';
const token = CihuyGetCookie("login");

CihuyGetHeaders(apiUrl, token)
  .then((data) => {
    
  })
  .catch((error) => {
    console.error("Error:", error);
  });