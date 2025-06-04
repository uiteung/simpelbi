import {
  CihuyDataAPI,
  CihuyPostApi,
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
import { getIdAmiFromURL } from "https://c-craftjs.github.io/simpelbi/paramurl.js";
// import {
//   CihuyNavigateBack,
//   CihuyHref,
// } from "https://c-craftjs.github.io/simpelbi/navigasi.js";
import { populateUserProfile } from "https://c-craftjs.github.io/simpelbi/profile.js";

// Untuk Get Data Profile
populateUserProfile();

document.addEventListener("DOMContentLoaded", () => {
  // Fungsi untuk menghapus cookie
  function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }

  // Ambil elemen Sign Out
  const signoutButton = document.querySelector(".nav-author__signout");

  // Tambahkan event listener untuk logout
  signoutButton.addEventListener("click", (event) => {
    event.preventDefault(); // Mencegah perilaku default <a>

    // Hapus cookie yang terkait dengan login
    deleteCookie("login");

    // Arahkan pengguna ke halaman yang diinginkan
    window.location.href = signoutButton.getAttribute("href");
  });
});

const urlParams = new URLSearchParams(window.location.search);
const idAmi = urlParams.get("id_ami");
const idProdiUnit = urlParams.get("id_prodi_unit");
const idAudit = urlParams.get("id_audit");

const UrlGetAuditByAmi = `https://simbe-dev.ulbi.ac.id/api/v1/audit/getallbyami?id_ami=${idAmi}`;

function isValidURL(url) {
  const pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protokol
      "((([a-zA-Z0-9-]+)\\.)+([a-zA-Z]{2,})|" + // domain
      "localhost|" + // atau localhost
      "\\d{1,3}(\\.\\d{1,3}){3})" + // atau IP
      "(:\\d+)?(\\/[-a-zA-Z0-9%_.~+]*)*" + // port dan path
      "(\\?[;&a-zA-Z0-9%_.~+=-]*)?" + // query string
      "(#[-a-zA-Z0-9_]*)?$", // fragment locator
    "i"
  );
  return pattern.test(url);
}

// Untuk Get All Data Audit
// Untuk Get All Data Audit
function ShowDataAudit(data) {
  const tableBody = document.getElementById("content");
  tableBody.innerHTML = "";
  let nomor = 1;

  const hasEmpty = data
    .filter((item) =>
      Object.values(item).some(
        (value) => value === null || value === undefined || value === ""
      )
    )
    .map((data) => data.id_audit);

  data.forEach((item) => {
    const barisBaru = document.createElement("tr");
    let statusClass = "";
    let buttonText = "";
    let buttonLink = "";
    let pointerEventStyle = "";
    let showButton = true;

    const linkPerbaikan = item.link_perbaikan
    ? isValidURL(item.link_perbaikan)
      ? `<button class="custom-button" onclick="window.open('${encodeURI(
          item.link_perbaikan
        )}', '_blank')">Kunjungi</button>`
      : `<span style="font-size: 12px; color: #555;">${item.link_perbaikan}</span>`
    : "";  

    // Default tombol
    if (hasEmpty.includes(item.id_audit)) {
      buttonText = "Detail";
    } else {
      buttonText = "Self Assignment";
      pointerEventStyle = "pointer-events: none;";
    }

    // Status & tombol logika
    if (item.status === "open" || item.status === "Open") {
      statusClass = "custom-button";
      buttonLink = `pengawasan-audit-detail.html?id_ami=${item.id_ami}&id_prodi_unit=${idProdiUnit}&id_audit=${item.id_audit}`;
    } else if (item.status === "closed" || item.status === "Closed") {
      statusClass = "success-button";
      buttonLink = `pengawasan-audit-detail.html?id_ami=${item.id_ami}&id_prodi_unit=${idProdiUnit}&id_audit=${item.id_audit}`;
      pointerEventStyle = "pointer-events: none;";
    } else if (item.status === "Ada Perbaikan") {
      statusClass = "fix-button";
      buttonLink = `pengawasan-audit-detail.html?id_ami=${item.id_ami}&id_prodi_unit=${idProdiUnit}&id_audit=${item.id_audit}`;
    } else if (item.status === "Sudah Diperbaiki") {
      statusClass = "done-button";
      buttonLink = `pengawasan-audit-detail.html?id_ami=${item.id_ami}&id_prodi_unit=${idProdiUnit}&id_audit=${item.id_audit}`;
    }

    // Jika mau hide tombol sepenuhnya
    // if (item.status === "closed" || item.status === "Closed") showButton = false;

    barisBaru.innerHTML = `
      <td class="align-top" style="font-size: 12px;  white-space: pre-line;">
        <div class="userDatatable-content">${nomor}</div>
      </td>
      <td class="align-top">
        <div class="userDatatable-content" style="font-size: 12px;  white-space: pre-line;">
          ${item.standar}
        </div>
      </td>
      <td class="align-top">
        <div class="userDatatable-content" style="font-size: 12px;  white-space: pre-line;">
          ${item.isi_standar}
        </div>
      </td>
      <td class="align-top">
        <div class="userDatatable-content" style="font-size: 12px;  white-space: pre-line;">
          ${item.isi_indikator}
        </div>
      </td>
      <td class="align-top" style="font-size: 12px;">
        <div class="userDatatable-content mt-4">${linkPerbaikan}</div>
      </td>
      <td class="align-top" style="font-size: 12px;">
        <div class="userDatatable-content mt-4 ${statusClass}">${item.status}</div>
      </td>
      <td class="align-top" style="font-size: 12px;">
        <div class="userDatatable-content mt-4">
          ${
            showButton
              ? `<a href="${buttonLink}" class="${statusClass}" style="${pointerEventStyle}">${buttonText}</a>`
              : ""
          }
        </div>
      </td>
    `;

    tableBody.appendChild(barisBaru);
    nomor++;
  });
}

CihuyDataAPI(UrlGetAuditByAmi, token, (error, response) => {
  if (error) {
    console.error("Terjadi kesalahan:", error);
  } else {
    const data = response.data;
    console.log("Data yang diterima:", data);
    ShowDataAudit(data);
  }
});

// // Fungsi untuk mengisi dropdown menggunakan CihuyDataAPI
// function populateDropdownStandar(apiUrl, dropdownId) {
//   const dropdown = document.getElementById(dropdownId);

//   CihuyDataAPI(apiUrl, token, (error, response) => {
//     if (error) {
//       console.error("Terjadi kesalahan:", error);
//     } else {
//       // Bersihkan dropdown
//       dropdown.innerHTML = "";

//       // Isi dropdown dengan opsi-opsi dari data API
//       response.data.forEach((item) => {
//         const option = document.createElement("option");
//         option.value = item.id_standar;
//         option.textContent = item.standar;
//         dropdown.appendChild(option);
//       });
//     }
//   });
// }
// function populateDropdownKTS(apiUrl, dropdownId) {
//   const dropdown = document.getElementById(dropdownId);
//   CihuyDataAPI(apiUrl, token, (error, response) => {
//     if (error) {
//       console.error("Terjadi kesalahan:", error);
//     } else {
//       dropdown.innerHTML = "";
//       response.data.forEach((item) => {
//         const option = document.createElement("option");

//         if (item.kts === "Observasi") {
//           option.value = item.id_kts;
//           option.textContent = item.kts + " ( + 1 )";
//         } else if (item.kts === "Minor") {
//           option.value = item.id_kts;
//           option.textContent = item.kts + " (  * 10 )";
//         } else if (item.kts === "Mayor") {
//           option.value = item.id_kts;
//           option.textContent = item.kts + " (  * 50 )";
//         } else {
//           option.value = item.id_kts;
//           option.textContent = item.kts;
//         }

//         dropdown.appendChild(option);
//       });
//     }
//   });
// }

// // Panggil fungsi populateDropdown untuk "Butir Standar" dan "Temuan KTS"
// const standarApiUrl = "https://simbe-dev.ulbi.ac.id/api/v1/standar/";
// const ktsApiUrl = "https://simbe-dev.ulbi.ac.id/api/v1/kts/";

// populateDropdownStandar(standarApiUrl, "id_standar");
// populateDropdownKTS(ktsApiUrl, "id_kts");

// //post data di tambah data audit
// // Dapatkan elemen-elemen formulir
// const idStandarSelect = document.getElementById("id_standar");
// const idKtsSelect = document.getElementById("id_kts");
// const uraianInput = document.getElementById("uraian");
// const tindakanInput = document.getElementById("tindakan");
// const targetInput = document.getElementById("target");

// // Dapatkan tombol "Simpan Data"
// const simpanButton = document.getElementById("simpanButton");

// // Tambahkan event listener untuk tombol "Simpan Data"
// simpanButton.addEventListener("click", function (e) {
//   e.preventDefault();

//   // Dapatkan nilai dari elemen-elemen formulir
//   const idStandar = idStandarSelect.value;
//   const idKts = idKtsSelect.value;
//   const uraian = uraianInput.value;
//   const tindakan = tindakanInput.value;
//   const target = targetInput.value;

//   // Buat objek data yang akan dikirim
//   const postData = {
//     id_standar: parseInt(idStandar),
//     id_kts: parseInt(idKts),
//     uraian: uraian,
//     tindakan: tindakan,
//     target: target,
//   };

//   const url = `https://simbe-dev.ulbi.ac.id/api/v1/audit/addbyami?id_ami=${getIdAmiFromURL()}`;

//   // Kirim permintaan POST dengan data yang sesuai
//   CihuyPostApi(url, token, postData)
//     .then((responseText) => {
//       console.log("Respon sukses:", responseText);
//       // Lakukan tindakan lain setelah permintaan POST berhasil
//       Swal.fire({
//         icon: "success",
//         title: "Sukses!",
//         text: "Data berhasil ditambahkan.",
//         showConfirmButton: false,
//         timer: 1500,
//       }).then(() => {
//         // Arahkan kembali ke halaman pengawasan-audit.html setelah 1.5 detik
//         window.location.href = `./pengawasan-audit.html?id_ami=${idAmi}`;
//       });
//     })
//     .catch((error) => {
//       console.error("Terjadi kesalahan:", error);
//       Swal.fire({
//         icon: "error",
//         title: "Oops...",
//         text: "Terjadi kesalahan saat menambahkan data.",
//       });
//     });
// });

// document.getElementById("addbutton").addEventListener("click", function () {
//   const idAmi = getIdAmiFromURL();
//   if (idAmi) {
//     window.location.href = `pengawasan-audit-add.html?id_ami=${idAmi}`;
//   } else {
//     alert("Parameter 'id_ami' tidak ditemukan dalam URL");
//   }
// });

function exportToExcel(data, filename) {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(workbook, worksheet, "AMI Data");
  XLSX.writeFile(workbook, filename);
}

// Function untuk mengekspor data ke CSV
function exportToCSV(data, filename) {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const csvURL = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = csvURL;
  link.setAttribute("download", filename + ".csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Function untuk mencetak data
function printData(data) {
  let printContent = `
    <h1>Data Pengawasan Audit </h1>
    <table border="1">
      <thead>
        <tr>
        <th>
                              <span class="userDatatable-title">No</span>
                            </th>
                            <th>
                              <span class="userDatatable-title">Standar</span>
                            </th>
                            <th>
                              <span class="userDatatable-title"
                                >Butir Standar</span
                              >
                            </th>
                            <th>
                              <span class="userDatatable-title"
                                >Nama Indikator</span
                              >
                            </th>
                            <th>
                              <span class="userDatatable-title"
                                >Isi Indikator</span
                              >
                            </th>
                            <th>
                              <span class="userDatatable-title"
                                >Temuan KTS</span
                              >
                            </th>
                            <th>
                              <span class="userDatatable-title"
                                >Uraian Ketidak Sesuaian</span
                              >
                            </th>
                            <th>
                              <span class="userDatatable-title"
                                >Tindak Perbaikan</span
                              >
                            </th>
                            <th>
                              <span class="userDatatable-title"
                                >Target Waktu Perbaikan</span
                              >
                            </th>
                            <th>
                              <span class="userDatatable-title">Status</span>
                            </th>
                            
  
        </tr>
      </thead>
      <tbody>
  `;

  data.forEach((item, index) => {
    printContent += `
      <tr>
        <td>${index + 1}</td>
        
        <td>
          <div class="d-flex">
              <div class="userDatatable-inline-title">
                <a href="#" class="text-dark fw-500">
                    <h6>${item.standar}</h6>
                </a>
              </div>
          </div>
        </td>
        <td>
          <div class="d-flex">
              <div class="userDatatable-inline-title">
                <a href="#" class="text-dark fw-500">
                    <h6>${item.isi_standar}</h6>
                </a>
              </div>
          </div>
        </td>
        <td>
          <div class="userDatatable-content">
          ${item.nama_indikator}
          </div>
        </td>
        <td>
          <div class="userDatatable-content">
          ${item.isi_indikator}
          </div>
        </td>
        <td>
          <div class="userDatatable-content" style="font-size: 12px;  white-space: pre-line;">
            ${item.kts ? item.kts : "belum ada kts"}
          </div>
        </td>
        <td>
          <div class="userDatatable-content">
          ${item.uraian}
          </div>
        </td>
        <td>
          <div class="userDatatable-content">
          ${item.tindakan}
          </div>
        </td>
        <td>
        <div class="userDatatable-content">
        ${item.target}
        </div>

        <td>
        <div class="userDatatable-content">
          <span class=>${item.status}</span>
        </div>
      </td>
      </tr>
    `;
  });

  printContent += `
      </tbody>
    </table>
  `;

  const printWindow = window.open("", "_blank");
  printWindow.document.write(`
    <html>
      <head>
        <title>Pengawasan Audit Prodi - Cetak</title>
        <style>
          table {
            border-collapse: collapse;
            width: 100%;
          }
          th, td {
            border: 1px solid #dddddd;
            text-align: left;
            padding:10px;
          }
          h1 {
            text-align: center;
          }
        </style>
      </head>
      <body>
        ${printContent}
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.print();
}

function processDataAndExport(exportType, filename) {
  CihuyDataAPI(UrlGetAuditByAmi, token, (error, response) => {
    if (error) {
      console.error("Terjadi kesalahan:", error);
    } else {
      const data = response.data;
      console.log("Data yang diterima:", data);

      // Panggil fungsi sesuai dengan jenis ekspor yang diinginkan
      switch (exportType) {
        case "excel":
          exportToExcel(data, filename + ".xlsx");
          break;
        case "csv":
          exportToCSV(data, filename);
          break;
        case "print":
          printData(data);
          break;
        default:
          console.error("Jenis ekspor tidak valid");
      }
    }
  });
}

// Panggil fungsi ini ketika tombol Ekspor Excel diklik
document.getElementById("exportexcel").addEventListener("click", function () {
  processDataAndExport("excel", "pengawasan_export");
});

// Panggil fungsi ini ketika tombol Ekspor CSV diklik
document.getElementById("exportcsv").addEventListener("click", function () {
  processDataAndExport("csv", "pengawasan_export");
});

// Panggil fungsi ini ketika tombol Cetak diklik
document.getElementById("print").addEventListener("click", function () {
  processDataAndExport("print");
});
