import {
  CihuyDataAPI,
  CihuyUpdateApi,
} from "https://c-craftjs.github.io/simpelbi/api.js";
import { populateUserProfile } from "https://c-craftjs.github.io/simpelbi/profile.js";

import { token, UrlGetAmi } from "../js/template/template.js";

const urlParams = new URLSearchParams(window.location.search);
const idAmi = urlParams.get("id_ami");

function statusData(data) {
  const selectElement = document.getElementById("status");
  // Kosongkan isi dropdown saat ini
  selectElement.innerHTML = "";

  // Tambahkan opsi dropdown statis
  const optionProses = document.createElement("option");
  optionProses.textContent = "Proses";
  selectElement.appendChild(optionProses);

  const optionSelesai = document.createElement("option");
  optionSelesai.textContent = "Selesai";
  selectElement.appendChild(optionSelesai);

  // Set nilai default berdasarkan data yang diterima dari database
  if (data.length > 0) {
    selectElement.value = data[0].status;
  }

  selectElement.addEventListener("change", function () {
    const selectedValue = this.value;
    // Lakukan sesuatu dengan nilai yang dipilih, misalnya, tampilkan di konsol
    console.log("Nilai yang dipilih: ", selectedValue);
  });
}

const updateStatusButton = document.getElementById("updateStatusButton");
updateStatusButton.addEventListener("click", function (e) {
  e.preventDefault();

  // Get data from form elements
  const status = document.getElementById("status").value;

  // Convert the selected image to base64
  const data = {
    status: status,
  };

  // Show a confirmation SweetAlert
  Swal.fire({
    title: "Update Status AMI?",
    text: "Apakah Anda yakin Proses AMI ini Sudah Selesai?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Ya, Update",
    cancelButtonText: "Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      // Send the prodi data to the server using the sendprodiData function
      sendStatusUpdate(data, apiUrlAmiUpdateStatus, token);
    }
  });
});
const apiUrlAmiUpdateStatus = `https://simbe-dev.ulbi.ac.id/api/v1/ami/statusupdate?id_ami=${idAmi}`;
// Fungsi untuk mengirim permintaan POST dengan data prodi
function sendStatusUpdate(dataStatusToUpdate, apiUrlAmiUpdateStatus, token) {
  CihuyUpdateApi(
    apiUrlAmiUpdateStatus,
    token,
    dataStatusToUpdate,
    (error, responseText) => {
      if (error) {
        console.error(
          "Terjadi kesalahan saat mengupdate data status AMI:",
          error
        );
        // Menampilkan pesan kesalahan
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Terjadi kesalahan saat mengupdate data status AMI.",
        });
      } else {
        console.log("Respon sukses:", responseText);
        // Menampilkan pesan sukses
        Swal.fire({
          icon: "success",
          title: "Sukses!",
          text: "Data Status AMI berhasil diperbarui.",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          // Refresh halaman atau lakukan tindakan lain jika diperlukan
          window.location.href = "./dashboard-prodi.html";
        });
      }
    }
  );
}

CihuyDataAPI(UrlGetAmi, token, (error, response) => {
  if (error) {
    console.error("Terjadi kesalahan:", error);
  } else {
    const data = response.data;
    console.log("Data yang diterima:", data);
    statusData(data);
  }
});

populateUserProfile();
