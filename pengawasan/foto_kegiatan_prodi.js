import {
  CihuyDataAPI,
  //   CihuyPostApi,
  //   CihuyDeleteAPI,
  //   CihuyUpdateApi,
} from "https://c-craftjs.github.io/simpelbi/api.js";
import {
  token,
  //   UrlGetUsersProdi,
  //   UrlGetUsersFakultas,
  //   UrlGetJenjang,
  //   UrlGetSiklus,
} from "../js/template/template.js";
import { UrlGetAudit } from "../js/template/template.js";
import { populateUserProfile } from "https://c-craftjs.github.io/simpelbi/profile.js";

// Fungsi untuk menampilkan data audit dengan pagination
function ShowDataAudit(data, page, itemsPerPage) {
  const tableBody = document.getElementById("content");
  tableBody.innerHTML = "";
  let nomor = (page - 1) * itemsPerPage + 1;
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const paginatedData = data.slice(startIndex, endIndex);

  paginatedData.forEach((item) => {
    const barisBaru = document.createElement("tr");
    let statusClass = "";
    if (item.status === "Sudah Dilaksanakan") {
      statusClass = "success-button";
    } else if (item.status === "Belum Dilaksanakan") {
      statusClass = "custom-button";
    }

    // Isi kolom-kolom tabel dengan data yang diambil
    barisBaru.innerHTML = `
      <td>
        <div class="userDatatable-content">${nomor}</div>
      </td>
      <td>
        <div class="userDatatable-content">${item.fakultas}</div>
      </td>
      <td>
        <div class="userDatatable-content">${item.prodi}</div>
      </td>
      <td>
        <div class="userDatatable-content">
          <img src="https://simbe-dev.ulbi.ac.id/static/pictures/${item.foto}" alt="Foto" width="100" height="100">
        </div>
      </td>
      <td>
        <div class="userDatatable-content">${item.auditor}</div>
      </td>
      <td>
        <div class="userDatatable-content">${item.tgl}</div>
      </td>
    `;

    tableBody.appendChild(barisBaru);
    nomor++;
  });
}

// Fungsi untuk membuat tombol pagination
function createPaginationButtons(data, itemsPerPage) {
  const paginationContainer = document.getElementById("pagination");
  paginationContainer.innerHTML = "";

  const totalPages = Math.ceil(data.length / itemsPerPage);

  for (let page = 1; page <= totalPages; page++) {
    const button = document.createElement("button");
    button.textContent = page;
    button.addEventListener("click", () => {
      ShowDataAudit(data, page, itemsPerPage);
    });

    paginationContainer.appendChild(button);
  }
}

const currentURL = window.location.href;
const url = new URL(currentURL);
const id_ami = url.searchParams.get("id_ami");

if (id_ami) {
  const apiUrl = `https://simbe-dev.ulbi.ac.id/api/v1/foto/get?id_ami=${id_ami}`;
  const itemsPerPage = 10; // Ganti dengan jumlah item per halaman yang diinginkan

  CihuyDataAPI(apiUrl, token, (error, response) => {
    if (error) {
      console.error("Terjadi kesalahan:", error);
    } else {
      const data = response.data;
      console.log("Data yang diterima:", data);

      // Tampilkan data audit pada halaman pertama
      ShowDataAudit(data, 1, itemsPerPage);

      // Buat tombol-tombol pagination
      createPaginationButtons(data, itemsPerPage);
    }
  });
} else {
  console.log("Parameter id_ami tidak ditemukan dalam URL.");
}
