import { CihuyDataAPI } from "https://c-craftjs.github.io/simpelbi/api.js";
import { populateUserProfile } from "https://c-craftjs.github.io/simpelbi/profile.js";

import {
  token,
  UrlGetAmi,
  UrlGetMekanisme,
  UrlGetAudit,
  UrlGetKesimpulan,
} from "../js/template/template.js";
function ShowDataProsesAMI(data, mekanismeData, auditData, kesimpulanData) {
  const tableBody = document.getElementById("content");
  tableBody.innerHTML = "";
  let nomor = 1;

  data.forEach((item) => {
    const mekanismeItem = mekanismeData.find(
      (mekanisme) => mekanisme.idAmi === item.idAmi
    );
    const barisBaru = document.createElement("tr");
    const kolomNo = document.createElement("td");
    kolomNo.innerHTML = `<div class="userDatatable-content">${nomor}</div>`;
    barisBaru.appendChild(kolomNo);
    const kolomProsesAudit = document.createElement("td");
    kolomProsesAudit.innerHTML = `
      <div class="userDatatable-content">
        <table>
          <tr>
            <td>Mekanisme</td>
            <td>
            <a href="pengawasan-mekanisme.html?id_ami=${item.idAmi}" 
               style="pointer-events: ${
                 item.status === "Selesai" ? "none" : "auto"
               }">
              ${
                item.status === "Selesai"
                  ? '<span class="success-button">Sudah Diisi</span>'
                  : mekanismeItem
                  ? mekanismeItem.question1 === "Ya" ||
                    mekanismeItem.question2 === "Ya" ||
                    mekanismeItem.question3 === "Ya" ||
                    mekanismeItem.question4 === "Ya" ||
                    mekanismeItem.question5 === "Ya" ||
                    mekanismeItem.question6 === "Ya"
                    ? '<span class="success-button">Sudah Diisi</span>'
                    : '<span class="custom-button">Belum Diisi</span>'
                  : '<span class="custom-button">Belum Diisi</span>'
              }
            </a>
          </td>
          </tr>
          <tr>
            <td>Audit</td>
            <td>
            <a href="pengawasan-audit.html?id_ami=${item.idAmi}" 
            style="pointer-events: ${
              item.status === "Selesai" ? "none" : "auto"
            }">
              ${
                item.status === "Proses"
                  ? auditData.some((audit) => audit.id_ami === item.idAmi)
                    ? '<span class="success-button">Sudah Diisi</span>'
                    : '<span class="custom-button">Belum Diisi</span>'
                  : item.status === "Selesai"
                  ? auditData.some((audit) => audit.id_ami === item.idAmi)
                    ? '<span class="success-button">Sudah Diisi</span>'
                    : '<span class="custom-button">Belum Diisi</span>'
                  : ""
              }
            </a>
          </td>
          </tr>
          <tr>
            <td>Kesimpulan</td>
            <td>
            <a href="pengawasan-kesimpulan.html?id_ami=${
              item.idAmi
            }" style="pointer-events: ${
      item.status === "Selesai" ? "none" : "auto"
    }">
              ${
                kesimpulanData.find(
                  (kesimpulan) => kesimpulan.id_ami === item.idAmi
                )
                  ? '<span class="success-button">Sudah Diisi</span>'
                  : '<span class="custom-button">Belum Diisi</span>'
              }
            </a>
          </td>
          </tr>
          <tr>
            <td>Tanggal RTM</td>
            <td>
              ${
                item.status === "Proses"
                  ? item.tglRtm
                    ? `<a href="pengawasan-tanggal_rtm.html?id_ami=${item.idAmi} style="pointer-events" "><span class="success-button">${item.tglRtm}</span></a>`
                    : `<a href="pengawasan-tanggal_rtm.html?id_ami=${item.idAmi}"><span class="custom-button">Belum Diisi</span></a>`
                  : item.status === "Selesai"
                  ? item.tglRtm
                    ? `<span class="success-button">${item.tglRtm}</span>`
                    : '<span class="custom-button">Belum Diisi</span>'
                  : ""
              }
            </td>
          </tr>
          <tr>
                <td>Foto Kegiatan</td>
                <td>
                    ${
                      item.status === "Proses"
                        ? item.foto
                          ? `<a href="pengawasan-foto-prodi.html?id_ami=${
                              item.idAmi
                            }" style="pointer-events: ${
                              item.status === "Selesai" ? "none" : "auto"
                            }"><span class="success-button">Sudah Diisi</span></a>`
                          : `<a href="pengawasan-foto_prodi.html?id_ami=${
                              item.idAmi
                            }" style="pointer-events: ${
                              item.status === "Selesai" ? "none" : "auto"
                            }"><span class="custom-button">Belum Diisi</span></a>`
                        : item.status === "Selesai"
                        ? item.foto
                          ? `<span class="success-button">Sudah Diisi</span>`
                          : '<span class="custom-button">Belum Diisi</span>'
                        : ""
                    }
                </td>
            </tr>
        </table>
      </div>`;
    barisBaru.appendChild(kolomProsesAudit);
    const kolomInformasiAudit = document.createElement("td");
    kolomInformasiAudit.innerHTML = `
      <div class="userDatatable-content">
        <table>
          <tr>
            <td>Prodi : ${item.prodi}</td>
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
            <td>Siklus :    <span class="custom-button">${
              item.idSiklus
            } -  Tahun ${item.tahun}</span>
            </td>
          </tr>
          <tr>
            <td>Status Akhir : <span class="${
              item.status === "Selesai" ? "success-button" : "custom-button"
            }">
            ${item.status}
          </span></td>
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
getAmiData();

// Call the initial function to start the process
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
