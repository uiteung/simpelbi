import {
  CihuyDataAPI,
  CihuyUpdateApi,
} from "https://c-craftjs.github.io/simpelbi/api.js";
import { token } from "../js/template/template.js";
import { CihuyNavigateBack } from "https://c-craftjs.github.io/simpelbi/navigasi.js";
import { CihuyFormatedDate } from "https://c-craftjs.github.io/simpelbi/date.js";
import { populateUserProfile } from "https://c-craftjs.github.io/simpelbi/profile.js";

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


// Untuk Get Data Profile
populateUserProfile()

const urlParams = new URLSearchParams(window.location.search);
const idAmiToFind = urlParams.get("id_ami"); // Mendapatkan id_ami dari parameter URL

if (idAmiToFind) {
  // Membuat tanggal yang diformat

  const formattedDate = CihuyFormatedDate();

  // Menambahkan event listener ke tombol "Simpan"
  document
    .getElementById("simpanButton")
    .addEventListener("click", function () {
      // Langkah 1: Mengambil Data dari API Audit dengan CihuyDataAPI
      const AuditApiUrl = "https://simbe-dev.ulbi.ac.id/api/v1/audit";

      CihuyDataAPI(AuditApiUrl, token, (error, data) => {
        if (error) {
          console.error("Kesalahan saat mengambil data dari API Audit:", error);
          return;
        }

        // Langkah 2: Mencari id_audit berdasarkan id_ami
        const auditData = data.data;
        const idAudit = auditData.find(
          (item) => item.id_ami === parseInt(idAmiToFind)
        )?.id_audit;

        if (idAudit) {
          // Langkah 3: Melakukan Pembaruan Status Perbaikan dengan CihuyUpdateApi
          const status_perbaikan = dropdown.value;

          // Lanjutkan dengan formattedDate yang telah dihasilkan sebelumnya
          const updateUrl = `https://simbe-dev.ulbi.ac.id/api/v1/audit/updatestatusperbaikan?idaudit=${idAudit}`;
          const requestBody = {
            status: status_perbaikan,
            tgl_perbaikan: formattedDate,
          };

          CihuyUpdateApi(
            updateUrl,
            token,
            requestBody,
            (updateError, updateResponse) => {
              if (updateError) {
                console.error(
                  "Kesalahan saat melakukan pembaruan:",
                  updateError
                );
                return;
              }

              // Handle respons dari pembaruan di sini
              console.log("Respons dari pembaruan:", updateResponse);

              // Tampilkan notifikasi sukses menggunakan SweetAlert
              Swal.fire({
                icon: "success",
                title: "Sukses!",
                text: "Data berhasil Diupdate.",
                showConfirmButton: false,
                timer: 1500,
              }).then(() => {
                CihuyNavigateBack();
              });
            }
          );
        } else {
          console.error(`id_ami ${idAmiToFind} tidak ditemukan.`);
        }
      });
    });
} else {
  console.error("Parameter id_ami tidak ditemukan dalam URL.");
}
const dropdown = document.getElementById("perbaikan");
dropdown.addEventListener("change", function () {
  const selectedValue = dropdown.value;
  data.status_perbaikan = selectedValue;
});
