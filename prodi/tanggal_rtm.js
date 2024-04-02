import {
  CihuyDataAPI,
  //   CihuyPostApi,
  //   CihuyDeleteAPI,
  CihuyUpdateApi2,
} from "https://c-craftjs.github.io/simpelbi/api.js";
import {
  token,
  //   UrlGetUsersProdi,
  //   UrlGetUsersFakultas,
  //   UrlGetJenjang,
  //   UrlGetSiklus,
} from "../js/template/template.js";
import { getIdAmiFromURL } from "https://c-craftjs.github.io/simpelbi/paramurl.js";
import { populateUserProfile } from "https://c-craftjs.github.io/simpelbi/profile.js";

// Untuk Get Data Profile
populateUserProfile();

// Untuk Get All Data Audit
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
            <div class="userDatatable-content">${item.tgl_rtm}</div>
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
  const apiUrl = `https://simbe-dev.ulbi.ac.id/api/v1/ami/get?id_ami=${id_ami}`;

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

//update tanggal rtm
// Fungsi untuk mengirim pembaruan tanggal RTM

function updateTglRtm(idAmi, tglRtm) {
  return new Promise((resolve, reject) => {
    const apiUrl = `https://simbe-dev.ulbi.ac.id/api/v1/ami/rtmupdate?id_ami=${encodeURIComponent(
      idAmi
    )}`;
    const tglRtmData = {
      tglRtm: tglRtm,
    };

    CihuyUpdateApi2(apiUrl, token, tglRtmData)
      .then((responseData) => {
        // Lakukan apa yang diperlukan jika permintaan berhasil
        resolve(responseData);
      })
      .catch((error) => {
        // Lakukan apa yang diperlukan jika terjadi kesalahan
        reject(error);
      });
  });
}

// Pembaruan pemanggilan tombol "Simpan" dengan Promise
const simpanButton = document.getElementById("simpanButton");
simpanButton.addEventListener("click", function (e) {
  e.preventDefault();

  const idAmi = getIdAmiFromURL();
  const tglRtmInput = document.getElementById("tglrtm");
  const tglRtm = tglRtmInput.value;

  if (!idAmi || !tglRtm) {
    console.error("ID AMI atau tanggal RTM tidak valid.");
    return;
  }

  Swal.fire({
    title: "Konfirmasi",
    text: "Anda yakin ingin mengubah tanggal RTM?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Ya, Ubah",
    cancelButtonText: "Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      updateTglRtm(idAmi, tglRtm)
        .then((responseData) => {
          console.log("Tanggal RTM berhasil diperbarui:", responseData);
          Swal.fire({
            icon: "success",
            title: "Sukses!",
            text: "Tanggal RTM berhasil diperbarui.",
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            const redirectUrl = `https://euis.ulbi.ac.id/simpelbi/auditors/dashboard-auditor.html`;
            window.location.href = redirectUrl;
          });
        })
        .catch((error) => {
          console.error(
            "Terjadi kesalahan saat memperbarui tanggal RTM:",
            error
          );
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Terjadi kesalahan saat memperbarui tanggal RTM.",
          }).then(() => {
            window.location.href =
              "https://euis.ulbi.ac.id/simpelbi/auditors/dashboard-auditor.html";
          });
        });
    }
  });
});
