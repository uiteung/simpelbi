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

const urlParams = new URLSearchParams(window.location.search);
const idAmi = urlParams.get("id_ami");
const UrlGetAuditByAmi = `https://simbe-dev.ulbi.ac.id/api/v1/audit/getallbyami?id_ami=${idAmi}`;

// Untuk Get All Data Audit
// Untuk Get All Data Audit
function ShowDataAudit(data) {
  const tableBody = document.getElementById("content");
  tableBody.innerHTML = "";
  let nomor = 1;

  [data].forEach((item) => {
    const barisBaru = document.createElement("tr");
    let statusClass = "";
    let buttonText = "";
    let buttonLink = ""; // New variable for the link

    if (item.status === "Belum Dilaksanakan") {
      statusClass = "custom-button";
      buttonText = "Detail";
      buttonLink = `pengawasan-audit-detail.html?id_ami=${item.id_ami}`;
    }

    // Isi kolom-kolom tabel dengan data yang diambil
    barisBaru.innerHTML = `
      <td>
        <div class="userDatatable-content">${nomor}</div>
      </td>
      <td>
        <div class="userDatatable-content">${item.standar}</div>
      </td>
      <td>
        <div class="userDatatable-content">${item.isi_standar}</div>
      </td>
      <td>
        <div class="userDatatable-content">${item.kts}</div>
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
      <td>
        <div class="userDatatable-content">
          <a href="${buttonLink}" class="${statusClass}">${buttonText}</a>
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
