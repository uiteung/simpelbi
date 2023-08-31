import { CihuyGetCookie } from "https://c-craftjs.github.io/cookies/cookies.js";
import { CihuyGetHeaders } from "https://c-craftjs.github.io/api/api.js";
import { CihuyQuerySelector } from "https://c-craftjs.github.io/element/element.js";
import { CihuyRole } from "https://c-craftjs.github.io/link/link.js";

const masukbutton = CihuyQuerySelector(".masukButton");

masukbutton.forEach((button) => {
  button.addEventListener("click", async (event) => {
    event.preventDefault();

    const token = CihuyGetCookie("login");

    const apiUrlAdmin = "https://simbe-dev.ulbi.ac.id/api/v1/admins/";
    const apiUrlFakultas = "https://simbe-dev.ulbi.ac.id/api/v1/fakultas/";
    const apiUrlAuditor = "https://simbe-dev.ulbi.ac.id/api/v1/auditors/";
    const apiUrlProdi = "https://simbe-dev.ulbi.ac.id/api/v1/prodi/";

    try {
      const resultAdmin = await CihuyGetHeaders(apiUrlAdmin, token);
      const resultFakultas = await CihuyGetHeaders(apiUrlFakultas, token);
      const resultAuditor = await CihuyGetHeaders(apiUrlAuditor, token);
      const resultProdi = await CihuyGetHeaders(apiUrlProdi, token);

      const userData = {
        admin: JSON.parse(resultAdmin).data,
        fakultas: JSON.parse(resultFakultas).data,
        auditor: JSON.parse(resultAuditor).data,
        prodi: JSON.parse(resultProdi).data,
      };

      const clickedUserRole = button.getAttribute("data-role");

      const userRole = determineUserRole(userData, clickedUserRole);

      if (userRole) {
        redirectToDashboard(userRole);
      } else {
        window.location.href = "halaman-maaf.html";
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });
});

function redirectToDashboard(userRole) {
  switch (userRole) {
    case "auditor":
      window.location.href = "app/auditor/dashboard-auditor.html";
      break;
    case "fakultas":
      window.location.href = "app/fakultas/dashboard-fakultas.html";
      break;
    case "admin":
      window.location.href = "dashboard.html";
      break;
    case "prodi":
      window.location.href = "app/prodi/dashboard-prodi.html";
      break;
    default:
      console.log("Role tidak cocok");
  }
}

function determineUserRole(userData, clickedUserRole) {
  switch (clickedUserRole) {
    case "auditor":
      return "auditor";
    case "fakultas":
      return "fakultas";
    case "admin":
      return "admin";
    case "prodi":
      return "prodi";
    default:
      return null;
  }
}

// console.log(CihuyGetHeaders);

// CihuyGetHeaders(apiUrl, token)
//   .then((result) => {
//     const userRole = JSON.parse(result).role;
//     CihuyRole(userRole);
//   })
//   .catch((error) => console.error("Error:", error));
