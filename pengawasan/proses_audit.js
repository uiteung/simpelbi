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
populateUserProfile()

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
      <div class="userDatatable-content" data-id-standar="${item.standar}"></div>
      </td>
      <td>
      <div class="userDatatable-content" data-id-standarisi="${item.standar}"></div>

      </td>
      <td>
      <div class="userDatatable-content" data-id-kts="${item.id_kts}"></div>
      </td>
      <td>
        <div class="userDatatable-content">${item.uraian}</div>
      </td>
      <td>
        <div class="userDatatable-content">${item.tindakan}</div>
      </td>
      <td>
        <div class="userDatatable-content">${item.target}</div>
      </td>
      <td>
        <div class="userDatatable-content">
          <span class="${statusClass}">${item.status}</span>
        </div>
      </td>
    
      
    `;

    tableBody.appendChild(barisBaru);
    ambildatastandar(item.id_standar);
    ambildatakts(item.id_kts);
    nomor++;
  });
}
function ambildatastandar(id_standar) {
  const apiUrl = `https://simbe-dev.ulbi.ac.id/api/v1/standar/get?idstandar=${id_standar}`;
  CihuyDataAPI(apiUrl, token, (error, response) => {
    if (error) {
      console.error("Terjadi kesalahan:", error);
    } else {
      const standarData = response.data;
      console.log("Data Standar yang diterima:", standarData);

      const standarContents = document.querySelectorAll(
        `[data-id-standar="${standarData.id_standar}"]`
      );
      standarContents.forEach((standarContent) => {
        standarContent.textContent = standarData.standar;
      });

      const standarisi = document.querySelectorAll(
        `[data-id-standarisi="${standarData.id_kts}"]`
      );
      standarisi.forEach((standarContent) => {
        standarContent.textContent = standarData.isi;
      });
    }
  });
}
function ambildatakts(id_kts) {
  const apiUrl = `https://simbe-dev.ulbi.ac.id/api/v1/kts/get?idkts=${id_kts}`;
  CihuyDataAPI(apiUrl, token, (error, response) => {
    if (error) {
      console.error("Terjadi kesalahan:", error);
    } else {
      const standarData = response.data;
      console.log("Data kts yang diterima:", standarData);

      const idKTSContents = document.querySelectorAll(
        `[data-id-kts="${standarData.id_kts}"]`
      );
      idKTSContents.forEach((contentKts) => {
        contentKts.textContent = standarData.kts;
      });
    }
  });
}

const currentURL = window.location.href;
const url = new URL(currentURL);
const id_ami = url.searchParams.get("id_ami");

if (id_ami) {
  const apiUrl = `https://simbe-dev.ulbi.ac.id/api/v1/audit/getbyami?id_ami=${id_ami}`;

  CihuyDataAPI(apiUrl, token, (error, response) => {
    if (error) {
      console.error("Terjadi kesalahan:", error);
    } else {
      const data = response.data;
      console.log("Data yang diterima:", data);
      ShowDataAudit([data]);
    }
  });
} else {
  console.log("Parameter id_ami tidak ditemukan dalam URL.");
}
