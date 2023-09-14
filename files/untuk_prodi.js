import {
  CihuyDataAPI,
  CihuyPostApi,
} from "https://c-craftjs.github.io/simpelbi/api.js";
import { CihuyGetCookie } from "https://c-craftjs.github.io/cookies/cookies.js";

const apiUrl = "https://simbe-dev.ulbi.ac.id/api/v1/filesprodi";
const token = CihuyGetCookie("login"); // Get Cookie From SimpelBi
function tampilData(data) {
  const tableBody = document.getElementById("tableBody");

  // Kosongkan isi tabel saat ini
  tableBody.innerHTML = "";
  let nomor = 1;

  // Loop melalui data yang diterima dari API
  data.forEach((item) => {
    const barisBaru = document.createElement("tr");
    barisBaru.innerHTML = `
            <td>${nomor}</td>
            <td>${item.idFile}</td>
            <td>${item.tahun}</td>
            <td>${item.judul}</td>
            <td>${item.file}</td>
            <td>${item.tgl}</td>
            <td>${item.nm_admin}</td>
            <td>
              <ul class="orderDatatable_actions mb-0 d-flex flex-wrap">
                <li>
                  <a href="#" class="view">
                    <i class="uil uil-eye"></i>
                  </a>
                </li>
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
const siklusapi = "https://simbe-dev.ulbi.ac.id/api/v1/siklus/";
const apiPostFiles = "https://simbe-dev.ulbi.ac.id/api/v1/files/prodi/add";
const apiAdmin = "https://simbe-dev.ulbi.ac.id/api/v1/admins/";

function siklusdata(data) {
  const selectElement = document.getElementById("siklus");

  // Kosongkan isi dropdown saat ini
  selectElement.innerHTML = "";

  // Loop melalui data yang diterima dari API
  data.forEach((item, index) => {
    const optionElement = document.createElement("option");
    optionElement.value = index + 1;
    optionElement.textContent = `${index + 1} - Tahun ${item.tahun}`;
    selectElement.appendChild(optionElement);
  });

  selectElement.addEventListener("change", function () {
    const selectedValue = this.value;
    // Lakukan sesuatu dengan nilai yang dipilih, misalnya, tampilkan di konsol
    console.log("Nilai yang dipilih:", selectedValue);
  });
}
const fileInput = document.getElementById("file");

document
  .getElementById("tambahDataButton")
  .addEventListener("click", function () {
    // Dapatkan data dari elemen formulir
    const idSiklus = document.getElementById("siklus").value;
    const judul = document.getElementById("judul").value;
    const file = fileInput.files[0];

    // Buat objek data yang akan dikirim ke server
    const data = {
      idSiklus: idSiklus,
      judul: judul,
      file: file.name,
    };

    // Kirim permintaan POST ke server menggunakan fungsi CihuyPostApi
    CihuyPostApi(apiPostFiles, token, data)
      .then((responseText) => {
        console.log("Respon sukses:", responseText);
        // Lakukan tindakan lain setelah permintaan POST berhasil
      })
      .catch((error) => {
        console.error("Terjadi kesalahan:", error);
        // Handle kesalahan jika terjadi
      });
  });

// Panggil API untuk mendapatkan data siklus
CihuyDataAPI(siklusapi, token, (error, response) => {
  if (error) {
    console.error("Terjadi kesalahan:", error);
  } else {
    const data = response.data;
    console.log("Data yang diterima:", data);
    siklusdata(data);
  }
});

// get data
CihuyDataAPI(apiUrl, token, (error, response) => {
  if (error) {
    console.error("Terjadi kesalahan:", error);
  } else {
    const data = response.data;
    console.log("Data yang diterima:", data);
    tampilData(data);
  }
});

// CihuyPostApi(UrlPostUsersAdmin, token, dataToSend)
//   .then((responseText) => {
//     console.log("Respon sukses:", responseText);
//     // Lakukan tindakan lain setelah permintaan POST berhasil
//   })
//   .catch((error) => {
//     console.error("Terjadi kesalahan:", error);
//     // Handle kesalahan jika terjadi
//   });
