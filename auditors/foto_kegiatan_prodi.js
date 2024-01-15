import {
  CihuyDataAPI,
  CihuyPostApi,
  //   CihuyDeleteAPI,
  //   CihuyUpdateApi,
} from "https://c-craftjs.github.io/simpelbi/api.js";
import { getIdAmiFromURL } from "https://c-craftjs.github.io/simpelbi/paramurl.js";

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

// Untuk Get All Data Audit
function ShowDataAudit([data]) {
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
          <div class="userDatatable-content">${item.prodi_unit}</div>
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

// Untuk POST Data Foto Kegiatan Prodi
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
      ShowDataAudit([data]);
    }
  });
} else {
  console.log("Parameter id_ami tidak ditemukan dalam URL.");
}

const simpanButton = document.getElementById("simpanButton");
const fileInput = document.getElementById("fileInput");

simpanButton.addEventListener("click", function (e) {
  e.preventDefault();

  const idAmi = getIdAmiFromURL(); // Mengambil ID AMI dari parameter URL

  // Mengambil file yang diunggah
  const selectedFile = fileInput.files[0];

  if (!selectedFile) {
    console.error("File tidak dipilih.");
    return;
  }
  const apiUrl = `https://simbe-dev.ulbi.ac.id/api/v1/foto/add?id_ami=${idAmi}`;

  const reader = new FileReader();
  reader.readAsDataURL(selectedFile);

  reader.onload = function () {
    const filePayload = reader.result.split(",")[1]; // Mengambil bagian data base64 setelah koma

    const fotoData = {
      idAmi: parseInt(idAmi),
      foto: {
        fileType: selectedFile.type,
        payload: filePayload,
      },
    };

    CihuyPostApi(apiUrl, token, fotoData)
      .then((responseText) => {
        console.log("Respon sukses:", responseText);
        Swal.fire({
          icon: "success",
          title: "Sukses!",
          text: "Data foto berhasil ditambahkan.",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          window.location.reload();
        });
      })
      .catch((error) => {
        console.error("Terjadi kesalahan:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Terjadi kesalahan saat menambahkan data foto.",
        });
      });
  };

  reader.onerror = function (error) {
    console.error("Terjadi kesalahan saat membaca file:", error);
  };
});
