// Import fungsi CihuyGetCookie dari URL eksternal
import { CihuyGetCookie } from "https://c-craftjs.github.io/cookies/cookies.js";

// Fungsi untuk melakukan permintaan GET dengan header "login" dari nilai cookie
export async function CihuyGetWithCookieLogin(url, cookieName) {
  const cookieValue = CihuyGetCookie(cookieName);

  const response = await fetch(url, {
    headers: {
      login: cookieValue,
    },
  });

  const data = await response.json();
  return data;
}

// Contoh penggunaan
const apiUrl = "https://simbe-dev.ulbi.ac.id/api/v1/admins/";
const cookieName = "LOGIN"; // Ganti dengan nama cookie yang sesuai

CihuyGetWithCookieLogin(apiUrl, cookieName)
  .then((responseData) => {
    console.log(responseData);
    // Lakukan sesuatu dengan data yang diterima
  })
  .catch((error) => {
    console.error("Error:", error);
  });
