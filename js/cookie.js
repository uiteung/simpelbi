import { CihuyGetCookie } from "https://c-craftjs.github.io/cookies/cookies.js";
import { CihuyGetHeaders } from "https://c-craftjs.github.io/api/api.js";

document.addEventListener("DOMContentLoaded", async () => {
  // Get the login cookie
  let token = CihuyGetCookie("login");

  // Jika cookie login ada, lakukan permintaan POST
  if (token) {
    const postApiUrlMenu = "https://simbe-dev.ulbi.ac.id/api/v1/menu/";

    try {
      // Lakukan permintaan POST
      const postResult = await CihuyGetHeaders(postApiUrlMenu, token);

      // Parse respons JSON dari permintaan POST
      const responseData = JSON.parse(postResult);

      // Dapatkan data URL dari respons
      const dataUrl = responseData.data;

      // Tentukan halaman tujuan berdasarkan data URL
      let targetPage = "";
      if (
        responseData.code === 400 &&
        responseData.success === false &&
        responseData.status === "Data user level tidak ditemukan" &&
        responseData.data === null
      ) {
        window.location.href = "https://euis.ulbi.ac.id/simpelbi/404.html";
      } else if (dataUrl === "/admins") {
        targetPage = "dashboard-admins.html";
      } else if (dataUrl === "/prodi") {
        targetPage = "dashboard-prodi.html";
      } else if (dataUrl === "/fakultas") {
        targetPage = "dashboard-fakultas.html";
      } else if (dataUrl === "/auditors") {
        targetPage = "dashboard-auditor.html";
      } else if (
        responseData.code === 401 &&
        responseData.success === false &&
        responseData.status === "Unauthorize Token" &&
        responseData.data === null
      ) {
        targetPage = "404.html";
      } else {
        targetPage = "404.html";
        console.error("URL tidak sesuai");
        return;
      }

      // Konstruksi URL akhir
      const finalUrl = `https://euis.ulbi.ac.id/simpelbi${dataUrl}/${targetPage}`;

      // Arahkan pengguna ke URL akhir
      window.location.href = finalUrl;
    } catch (error) {
      console.error("Error:", error);
    }
  } else {
    console.error("Token login tidak ditemukan");
    Swal.fire({
      tittle: "info",
      text: "Login dulu ya ka baru bisa akses",
      icon: "info",
      confirmButtonText: "OK",
      allowOutsideClick: false, 
      allowEscapeKey: false, 
      allowEnterKey: false, 
    }).then((result) => {
      if (result.isConfirmed) {
        redirectUrl = "https://euis.ulbi.ac.id/simpelbi";
        setCookieWithExpireHour("redirect", redirectUrl, 1);
        window.location.href = "https://login.ulbi.ac.id/";
      }
    });
  }
});

export function setCookieWithExpireHour(cname, cvalue, exhour) {
  const d = new Date();
  d.setTime(d.getTime() + exhour * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();

  // Set domain to ulbi.ac.id to allow subdomains access
  let domain = "domain=.ulbi.ac.id";

  document.cookie =
    cname + "=" + cvalue + ";" + expires + ";" + domain + ";path=/";
  console.log(`Cookie set: ${cname}=${cvalue}; ${expires}; ${domain}; path=/`);
}
