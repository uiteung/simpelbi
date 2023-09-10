import {
  CihuyDataAPI,
  CihuyPostApi,
} from "https://c-craftjs.github.io/simpelbi/api.js";
import { CihuyGetCookie } from "https://c-craftjs.github.io/cookies/cookies.js";
//   import { Cihuytobase64 } from "https://c-craftjs.github.io/simpelbi/conv.js";
//   import { CihuyNameCell } from "./element/namecell.js";
//   import { CihuyTableCell } from "./element/tablecell.js";
//   import { CihuyAppend } from "./element/append.js";

const apiUrl = "https://simbe-dev.ulbi.ac.id/api/v1/prodi/";
const token = CihuyGetCookie("login");

//function
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
          <td>${item.idFakultas}</td>
          <td>${item.prodi}</td>
          <td>${item.jenjang}</td>
          <td>${item.kaprodi}</td>
          <td>${item.nidn}</td>
          <td>${item.niknip}</td>
          <td>${item.telp}</td>
          <td>${item.email}</td>
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

// CihuyPostApi(apiUrl, token, dataToSend)
//   .then((responseText) => {
//     console.log("Respon sukses:", responseText);
//     // Lakukan tindakan lain setelah permintaan POST berhasil
//   })
//   .catch((error) => {
//     console.error("Terjadi kesalahan:", error);
//     // Handle kesalahan jika terjadi
//   });
