import { CihuyGetCookie } from "https://c-craftjs.github.io/cookies/cookies.js";

let token = CihuyGetCookie("login");
console.log(token);

const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Authorization", `Bearer ${token}`);
export function customGet(target_url, responseFunction) {
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
