import { populateUserProfile } from "https://c-craftjs.github.io/simpelbi/profile.js";
import { CihuyDataAPI } from "https://c-craftjs.github.io/simpelbi/api.js";

import {
  token,
  UrlGetAmibyAuditor,
  // UrlGetMekanisme,
  // UrlGetAudit,
  // UrlGetKesimpulan,
  // UrlGetFoto,
} from "../js/template/template.js";

let dataAmi;

function createColumn(content) {
  const column = document.createElement("td");
  column.innerHTML = `<div class="userDatatable-content">${content}</div>`;
  return column;
}
// Function to fetch the list of audit data
function fetchAuditList(idAmiNya, callback) {
  CihuyDataAPI(
    `https://simbe-dev.ulbi.ac.id/api/v1/audit`,
    token,
    (error, response) => {
      if (error) {
        console.error("Terjadi kesalahan:", error);
        callback(error, null);
        return;
      }

      if (response.success) {
        // Check if the specific id_ami exists in the response data
        const auditExists = response.data.some(
          (audit) => audit.id_ami === idAmiNya
        );

        // Call the callback with the result
        callback(null, auditExists);
      } else {
        // Data doesn't exist, call the callback with false
        callback(null, false);
      }
    }
  );
}

// Function to handle the audit section
function handleAuditSection(idAmi, idProdiUnit) {
  const auditButtonContainer = document.createElement("td");

  // Fetch the list of audit data
  fetchAuditList(idAmi, (error, auditExists) => {
    if (error) {
      console.error("Terjadi kesalahan:", error);
      return;
    }

    // Check if there is any audit data
    if (auditExists) {
      // Data exists, create a button with a link to pengawasan-audit.html
      const auditButton = document.createElement("button");
      auditButton.type = "button";
      auditButton.className = "custom-button";
      auditButton.innerHTML = "Sudah Diisi";
      auditButton.addEventListener("click", () => {
        window.location.href = `pengawasan-audit.html?id_ami=${idAmi}&id_prodi_unit=${idProdiUnit}`;
      });
      auditButtonContainer.appendChild(auditButton);
    } else {
      // Data doesn't exist, create a button with a link to pengawasan-audit-tambah.html
      const tambahAuditButton = document.createElement("button");
      tambahAuditButton.type = "button";
      tambahAuditButton.className = "custom-button";
      tambahAuditButton.innerHTML = "Tambah Audit";
      tambahAuditButton.addEventListener("click", () => {
        window.location.href = `pengawasan-audit-tambah.html?id_ami=${idAmi}&id_prodi_unit=${idProdiUnit}`;
      });
      auditButtonContainer.appendChild(tambahAuditButton);
    }
  });

  return auditButtonContainer;
}
function createAuditTable(item) {
  const table = document.createElement("table");

  // Audit
  const rowAudit = document.createElement("tr");
  rowAudit.appendChild(document.createElement("td")).innerHTML = "Audit";
  rowAudit.appendChild(handleAuditSection(item.id_ami, item.id_prodi_unit));
  table.appendChild(rowAudit);

  // Kesimpulan
  const rowKesimpulan = document.createElement("tr");
  rowKesimpulan.innerHTML = `<td>Kesimpulan</td><td>${item.kesimpulan}</td>`;
  table.appendChild(rowKesimpulan);

  // Tanggal RTM
  const rowTanggalRTM = document.createElement("tr");
  rowTanggalRTM.innerHTML = `<td>Tanggal RTM</td><td>${item.tanggal_rtm}</td>`;
  table.appendChild(rowTanggalRTM);

  // Foto Kegiatan
  const rowFotoKegiatan = document.createElement("tr");
  rowFotoKegiatan.innerHTML = `<td>Foto Kegiatan</td><td>${item.foto_kegiatan}</td>`;
  table.appendChild(rowFotoKegiatan);

  return table;
}

//cek audit

function createInfoTable(item) {
  const table = document.createElement("table");
  table.innerHTML = `
    <tr>
      <td>Program Studi / Unit: ${item.prodi_unit}</td>
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
      <td>Siklus : <span class="custom-button">${item.id_siklus} - Tahun ${
    item.tahun
  }</span></td>
    </tr>
    <tr>
      <td>Status Akhir : <span class="${
        item.status === "Selesai" ? "success-button" : "custom-button"
      }">${item.status}</span></td>
    </tr>
  `;
  return table;
}

function createLaporanButton() {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "custom-button";
  button.innerHTML = '<i class="fa fa-print"></i> Print Laporan AMI';
  return button;
}

function showDataProsesAMI(data) {
  const tableBody = document.getElementById("content");
  tableBody.innerHTML = "";
  let nomor = 1;

  data.forEach((item) => {
    const newRow = document.createElement("tr");

    newRow.appendChild(createColumn(nomor));

    const kolomProsesAudit = document.createElement("td");
    kolomProsesAudit.innerHTML = '<div class="userDatatable-content"></div>';
    kolomProsesAudit.firstChild.appendChild(createAuditTable(item));
    newRow.appendChild(kolomProsesAudit);

    const kolomInformasiAudit = document.createElement("td");
    kolomInformasiAudit.innerHTML = '<div class="userDatatable-content"></div>';
    kolomInformasiAudit.firstChild.appendChild(createInfoTable(item));
    newRow.appendChild(kolomInformasiAudit);

    const kolomLaporanAMI = document.createElement("td");
    kolomLaporanAMI.appendChild(createLaporanButton());
    newRow.appendChild(kolomLaporanAMI);

    tableBody.appendChild(newRow);
    nomor++;
  });
}

function getAmiData() {
  CihuyDataAPI(UrlGetAmibyAuditor, token, (error, responseAmi) => {
    if (error) {
      console.error("Terjadi kesalahan:", error);
    } else {
      dataAmi = responseAmi.data;
      showDataProsesAMI(dataAmi);
    }
  });
}

getAmiData();
populateUserProfile();
