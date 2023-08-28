import { CihuyGetCookie } from "https://c-craftjs.github.io/cookies/cookies.js";

export async function CihuyGetWithToken(url, token) {
  const response = await fetch(url, {
    headers: {
      LOGIN: token,
    },
  });

  const data = await response.json();
  return data;
}

const apiUrl = "https://simbe-dev.ulbi.ac.id/api/v1/admins/";
const token = CihuyGetCookie("LOGIN");

CihuyGetWithToken(apiUrl, token)
  .then((responseData) => {
    console.log(responseData);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
