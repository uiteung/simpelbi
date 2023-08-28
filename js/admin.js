// // Import fungsi CihuyGetCookie dari URL eksternal
// import { CihuyGetCookie } from "https://c-craftjs.github.io/link/link.js";

// export async function CihuyGetWithCookieLogin(url, cookieName) {
//   const cookieValue = CihuyGetCookie(cookieName);

//   const response = await fetch(url, {
//     headers: {
//       LOGIN: cookieValue,
//     },
//   });

//   const data = await response.json();
//   return data;
// }

// // Contoh penggunaan
// const apiUrl = "https://simbe-dev.ulbi.ac.id/api/v1/admins/";
// const cookieName = "LOGIN"; // Ganti dengan nama cookie yang sesuai

// CihuyGetWithCookieLogin(apiUrl, cookieName)
//   .then((responseData) => {
//     console.log(responseData);
//     // Lakukan sesuatu dengan data yang diterima
//   })
//   .catch((error) => {
//     console.error("Error:", error);
//   });
