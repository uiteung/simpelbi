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

// Untuk Get Data Profile
populateUserProfile();

// Untuk Get Data Audit
function ShowDataAudit(data) {
  const tableBody = document.getElementById("content");
  tableBody.innerHTML = "";
  let nomor = 1;

  data.forEach((item) => {
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

const currentURL = window.location.href;
const url = new URL(currentURL);
const id_ami = url.searchParams.get("id_ami");

if (id_ami) {
  const apiUrl = `https://simbe-dev.ulbi.ac.id/api/v1/foto/get?id_ami=${id_ami}`;

  CihuyDataAPI(apiUrl, token, (error, response) => {
    if (error) {
      console.error("Terjadi kesalahan:", error);
    } else {
      const data = response.data;
      console.log("Data yang diterima:", data);
      ShowDataAudit(data);
    }
  });
} else {
  console.log("Parameter id_ami tidak ditemukan dalam URL.");
}
