import {
  CihuyDataAPI,
  CihuyPostApi,
} from "https://c-craftjs.github.io/simpelbi/api.js";
import { CihuyGetCookie } from "https://c-craftjs.github.io/cookies/cookies.js";

const apiUrl = "https://simbe-dev.ulbi.ac.id/api/v1/filesprodi";
const token = await CihuyGetCookie("login"); // Get Cookie From SimpelBi
function tampilData(data) {
  const tableBody = document.getElementById("tableBody");

  // Kosongkan isi tabel saat ini
  tableBody.innerHTML = "";
  let nomor = 1;

  // Loop melalui data yang diterima dari API
  data.forEach((item) => {
    const barisBaru = document.createElement("tr");
    barisBaru.innerHTML = `
            <td>${nomor}</td>
            <td>${item.idFile}</td>
            <td>${item.idSiklus}</td>
            <td>${item.judul}</td>
            <td>${item.file}</td>
            <td>${item.tgl}</td>
            <td>${item.idAdmin}</td>
            <td>
              <ul class="orderDatatable_actions mb-0 d-flex flex-wrap">
                <li>
                  <a href="#" class="view">
                    <i class="uil uil-eye"></i>
                  </a>
                </li>
                <li>
                  <a href="#" class="edit">
                    <i class="uil uil-edit"></i>
                  </a>
                </li>
                <li>
                  <a href="#" class="remove">
                    <i class="uil uil-trash-alt"></i>
                  </a>
                </li>
              </ul>
            </td>
          `;
    tableBody.appendChild(barisBaru);
    nomor++;
  });
}
// get data
CihuyDataAPI(apiUrl, token, (error, response) => {
  if (error) {
    console.error("Terjadi kesalahan:", error);
  } else {
    const data = response.data;
    console.log("Data yang diterima:", data);
    tampilData(data);
  }
});
