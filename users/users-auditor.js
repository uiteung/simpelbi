import { CihuyDataAPI } from "https://c-craftjs.github.io/simpelbi/api.js";
import { token, UrlGetUsersAuditor } from "../js/template/template.js";
// import { ShowDataUsersAuditor } from "../js/config/configusersauditor.js";

function ShowDataUsersAuditor(data) {
  const tableBody = document.getElementById("content");

  // Kosongkan isi tabel saat ini
  tableBody.innerHTML = "";
  let nomor = 1;

  // Loop melalui data yang diterima dari API
  data.forEach((item) => {
    const barisBaru = document.createElement("tr");
    barisBaru.innerHTML = `
    <td>
       <div class="userDatatable-content">${nomor}</div>
    </td>
    <td>
       <div class="d-flex">
          <div class="userDatatable-inline-title">
             <a href="#" class="text-dark fw-500">
                <h6>${item.fakultas}</h6>
             </a>
          </div>
       </div>
    </td>
    <td>
       <div class="userDatatable-content">
          ${item.idAuditor}
       </div>
    </td>
    <td>
       <div class="userDatatable-content">
          ${item.prodi}
       </div>
    </td>
    <td>
       <div class="userDatatable-content">
          ${item.auditor}
       </div>
    </td>
    <td>
       <div class="userDatatable-content">
          ${item.nidn}
       </div>
    </td>
    <td>
       <div class="userDatatable-content">
          ${item.niknip}
       </div>
    </td>
    <td>
       <div class="userDatatable-content">
          ${item.telp}
       </div>
    </td>
    <td>
       <div class="userDatatable-content">
          ${item.email}
       </div>
    </td>
    <td>
    <div class="userDatatable-content">
    <img src="https://simbe-dev.ulbi.ac.id/static/pictures/${item.foto_data}" alt="Foto" width="100" height="100">
    </div>
    </td>
    <td>
       <ul class="orderDatatable_actions mb-0 d-flex flex-wrap">
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
// Untuk Get Data dari API
CihuyDataAPI(UrlGetUsersAuditor, token, (error, response) => {
  if (error) {
    console.error("Terjadi kesalahan:", error);
  } else {
    const data = response.data;
    console.log("Data yang diterima:", data);
    ShowDataUsersAuditor(data);
  }
});
// Tunggu sampai dokumen HTML sepenuhnya dimuat
document.addEventListener("DOMContentLoaded", function () {
  // Panggil API untuk mendapatkan data Fakultas
  CihuyDataAPI(
    "http://simbe-dev.ulbi.ac.id/api/v1/fakultas/",
    token,
    (errorFakultas, responseFakultas) => {
      if (errorFakultas) {
        console.error(
          "Terjadi kesalahan saat mengambil data Fakultas:",
          errorFakultas
        );
      } else {
        const fakultasData = responseFakultas.data;
        console.log("Data Fakultas yang diterima:", fakultasData);

        // Mengisi dropdown Fakultas dengan data dari API
        const fakultasSelect = document.getElementById("fakultas");
        fakultasData.forEach((fakultas) => {
          const option = document.createElement("option");
          option.value = fakultas.fakultas; // Sesuaikan dengan nilai yang diperlukan
          option.textContent = fakultas.fakultas; // Sesuaikan dengan properti yang diperlukan
          fakultasSelect.appendChild(option);
        });
      }
    }
  );

  // Panggil API untuk mendapatkan data Prodi
  CihuyDataAPI(
    "http://simbe-dev.ulbi.ac.id/api/v1/prodi/",
    token,
    (errorProdi, responseProdi) => {
      if (errorProdi) {
        console.error(
          "Terjadi kesalahan saat mengambil data Prodi:",
          errorProdi
        );
      } else {
        const prodiData = responseProdi.data;
        console.log("Data Prodi yang diterima:", prodiData);

        // Mengisi dropdown Prodi dengan data dari API
        const prodiSelect = document.getElementById("prodi");
        prodiData.forEach((prodi) => {
          const option = document.createElement("option");
          option.value = prodi.id; // Sesuaikan dengan nilai yang diperlukan
          option.textContent = prodi.nama; // Sesuaikan dengan properti yang diperlukan
          prodiSelect.appendChild(option);
        });
      }
    }
  );
});
