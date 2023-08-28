import { CihuyGetCookie } from "https://c-craftjs.github.io/cookies/cookies.js";
// Definisikan token Anda
let token = CihuyGetCookie("login"); // Ganti dengan nilai token yang sesuai

// Definisikan myHeaders dengan header LOGIN yang sesuai
// let myHeaders = new Headers();
// myHeaders.append("LOGIN", token);

export function customGet(target_url, token, responseFunction) {
  let myHeaders = new Headers();
  myHeaders.append("LOGIN", token);
  let requestOptions = {
    method: "GET",
    redirect: "follow",
    headers: myHeaders,
  };

  fetch(target_url, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.text();
    })
    .then((result) => responseFunction(JSON.parse(result)))
    .catch((error) => console.error("Error:", error));
}

export function handleResponse(responseData) {
  console.log(responseData);
}

let target_url = "https://simbe-dev.ulbi.ac.id/api/v1/admins/";
customGet(target_url, token, handleResponse);
