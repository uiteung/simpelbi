import { CihuyDataAPI } from "https://c-craftjs.github.io/simpelbi/api.js";
import { populateUserProfile } from "https://c-craftjs.github.io/simpelbi/profile.js";

import {
  token,
  UrlGetAmi,
  UrlGetMekanisme,
  UrlGetAudit,
  UrlGetKesimpulan,
} from "../js/template/template.js";
function ShowDataProsesAMI(data) {
  const tableBody = document.getElementById("content");
  tableBody.innerHTML = "";
  let nomor = 1;

  data.forEach((item) => {
    const barisBaru = document.createElement("tr");
    const kolomNo = document.createElement("td");
    kolomNo.innerHTML = `
    <div class="userDatatable-content">
    <table>
    <tr>
    <td>
    ${nomor}</td>
  </tr>
    </table>
    </div>`;
    barisBaru.appendChild(kolomNo);
    const kolomStatusAmi = document.createElement("td");
    kolomStatusAmi.innerHTML = `
      <div class="userDatatable-content">
        <table>
        <tr>
        <td ><span class="${
          item.status === "Selesai" ? "success-button" : "custom-button"
        }">
        ${item.status}
      </span></td>
      </tr>
        </table>
      </div>`;
    barisBaru.appendChild(kolomStatusAmi);
    const kolomInformasiAudit = document.createElement("td");
    kolomInformasiAudit.innerHTML = `
      <div class="userDatatable-content">
        <table>
          <tr>
            <td">Prodi : ${item.prodi}</td>
          </tr>
          <tr>
            <td>Fakultas : ${item.fakultas}</td>
          </tr>
          <tr>
            <td>Ketua Auditor : ${item.nm_auditor_ketua}</td>
          </tr>
          <tr>
            <td>Anggota 1 : ${item.nm_auditor_1}</td>
          </tr>
          <tr>
            <td>Anggota 2 : ${item.nm_auditor_2}</td>
          </tr>
          <tr>
            <td>Siklus :    <span class="custom-button">${item.idSiklus} -  Tahun ${item.tahun}</span>
            </td>
          </tr>
        </table>
      </div>`;

    barisBaru.appendChild(kolomInformasiAudit);
    const kolomLaporanAMI = document.createElement("td");
    kolomLaporanAMI.innerHTML = `
      <button type="button" class="custom-button">
        <i class="fa fa-print"></i> Print Laporan AMI
      </button>`;
    barisBaru.appendChild(kolomLaporanAMI);

    tableBody.appendChild(barisBaru);
    nomor++;
  });
}

// Function to retrieve AMI data
function getAmiData() {
  CihuyDataAPI(UrlGetAmi, token, (error, responseAmi) => {
    if (error) {
      console.error("Terjadi kesalahan:", error);
    } else {
      const dataAmi = responseAmi.data;
      getMekanismeData(dataAmi);
    }
  });
}

// Function to retrieve Mekanisme data
function getMekanismeData(dataAmi) {
  CihuyDataAPI(UrlGetMekanisme, token, (error, responseMekanisme) => {
    if (error) {
      console.error("Terjadi kesalahan:", error);
    } else {
      const mekanismeData = responseMekanisme.data;
      getAuditData(dataAmi, mekanismeData);
    }
  });
}

// Function to retrieve Audit data
function getAuditData(dataAmi, mekanismeData) {
  CihuyDataAPI(UrlGetAudit, token, (error, responseAudit) => {
    if (error) {
      console.error("Terjadi kesalahan:", error);
    } else {
      const auditData = responseAudit.data;
      getKesimpulanData(dataAmi, mekanismeData, auditData);
    }
  });
}

// Function to retrieve Kesimpulan data and display the data
function getKesimpulanData(dataAmi, mekanismeData, auditData) {
  CihuyDataAPI(UrlGetKesimpulan, token, (error, responseKesimpulan) => {
    if (error) {
      console.error("Terjadi kesalahan:", error);
    } else {
      const kesimpulanData = responseKesimpulan.data;
      console.log("Data Kesimpulan yang diterima:", kesimpulanData);
      ShowDataProsesAMI(dataAmi, mekanismeData, auditData, kesimpulanData);
    }
  });
}

// Call the initial function to start the process
getAmiData();
// function populateUserProfile() {
//   CihuyDataAPI(UrlProfile, token, (error, response) => {
//     if (error) {
//       console.error("Terjadi kesalahan:", error);
//     } else {
//       const data = response.data;

//       // Pastikan data ada dan sesuai dengan struktur yang diharapkan
//       if (data) {
//         const nama = data.nama_user;
//         const level = data.nama_level;
//         const email = data.email;
//         const fotoUrl = `https://simbe-dev.ulbi.ac.id/static/pictures/${data.foto}`;

//         // Isi elemen-elemen HTML dengan data profil
//         const navItemTitle = document.querySelector(
//           "#nav-author .nav-item__title"
//         );

//         const authorName = document.querySelector(".nav-item_nama");
//         const authorLevel = document.querySelector(".nav-item_level");
//         const authorEmail = document.querySelector(".nav_email");
//         const authorImage = document.querySelector(".author-img img");
//         const navItemPhoto = document.getElementById("navItemPhoto");

//         navItemTitle.textContent = nama;
//         navItemPhoto.src = fotoUrl;

//         authorName.textContent = nama;
//         authorLevel.textContent = level;
//         authorEmail.textContent = email;
//         authorImage.src = fotoUrl;
//       } else {
//         console.error("Data profil tidak sesuai.");
//         console.log(data);
//       }
//     }
//   });
// }

populateUserProfile();
