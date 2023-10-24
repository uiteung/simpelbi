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
            <td>
                <a href="update-status.html?id_ami=${
                  item.idAmi
                }" style="pointer-events: ${
      item.status === "Selesai" ? "none" : "auto"
    }">
                    ${
                      item.status === "Selesai"
                        ? '<span class="success-button">Selesai</span>'
                        : '<span class="custom-button">Proses</span>'
                    }
                </a>
            </td>
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

function statusData(data) {
  const selectElement = document.getElementById("inputName");
  // Kosongkan Isi dropdown saat ini
  selectElement.innerHTML = "";

  // Loop data yang diterima dari API
  data.forEach((item) => {
    const optionElement = document.createElement("option");
    optionElement.textContent = `${item.status}`;
    selectElement.appendChild(optionElement);
  });
  selectElement.addEventListener("change", function () {
    const selectedValue = this.value;
    // Lakukan sesuatu dengan nilai yang dipilih, misalnya, tampilkan di konsol
    console.log("Nilai yang dipilih: ", selectedValue);
  });
}
// Panggil API untuk mendapatkan data fakultas
CihuyDataAPI(UrlGetAmi, token, (error, response) => {
  if (error) {
    console.error("Terjadi kesalahan:", error);
  } else {
    const data = response.data;
    console.log("Data yang diterima:", data);
    statusData(data);
  }
});

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

populateUserProfile();
