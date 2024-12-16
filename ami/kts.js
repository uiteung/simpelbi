import { CihuyPostKTS } from "../js/config/configkts.js";
import { UrlGetKts, token, UrlPostKts } from "../js/template/template.js";
import {
  CihuyDataAPI,
  CihuyDeleteAPI,
  CihuyUpdateApi,
} from "https://c-craftjs.github.io/simpelbi/api.js";
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


// Untuk GET Data profile
populateUserProfile();

// Untuk GET Data dari API
export function ShowDataKTS(data) {
  const tableBody = document.getElementById("content");

  // Kosongkan isi tabel saat ini
  tableBody.innerHTML = "";
  let nomor = 1;

  // Loop melalui data yang diterima dari API
  data.forEach((item) => {
    const barisBaru = document.createElement("tr");
    barisBaru.innerHTML = `
    <td>
      <div class="userDatatable-content">${nomor}</div>
      </td>
      <td>
        <div class="d-flex">
            <div class="userDatatable-inline-title">
              <a href="#" class="text-dark fw-500">
                  <h6>${item.kts}</h6>
              </a>
            </div>
        </div>
      </td>
      <td>
        <ul class="orderDatatable_actions mb-0 d-flex flex-wrap">
            
            <li>
              <a href="#" class="edit" data-target="#new-member-update" data-kts-id=${item.id_kts}>
                  <i class="uil uil-edit"></i>
              </a>
            </li>
            <li>
              <a href="#" class="remove" data-kts-id=${item.id_kts}>
                  <i class="uil uil-trash-alt"></i>
              </a>
            </li>
        </ul>
      </td>
      `;
    // Untuk Remove Button
    const removeButton = barisBaru.querySelector(".remove");
    removeButton.addEventListener("click", () => {
      const KtsId = removeButton.getAttribute("data-kts-id");
      if (KtsId) {
        deleteKts(KtsId);
      } else {
        console.error("ID KTS tidak ditemukan");
      }
    });
    // Untuk Update Button
    const editButton = barisBaru.querySelector(".edit");
    editButton.addEventListener("click", () => {
      const KtsId = editButton.getAttribute("data-kts-id");
      if (KtsId) {
        ediData(KtsId);
      } else {
        console.error("ID KTS tidak ditemukan");
      }
    });
    tableBody.appendChild(barisBaru);
    nomor++;
  });
}
CihuyDataAPI(UrlGetKts, token, (error, response) => {
  if (error) {
    console.error("Terjadi kesalahan:", error);
  } else {
    const data = response.data;
    console.log("Data yang diterima:", data);
    ShowDataKTS(data);
  }
});

// Untuk DELETE Data dengan API
function deleteKts(id_kts) {
  // Buat URL untuk mengambil data KTS berdasarkan id
  const UrlGetKtsById = `https://simbe-dev.ulbi.ac.id/api/v1/kts/get?idkts=${id_kts}`;

  // Lakukan permintaan GET untuk mengambil KTS berdasarkan Id
  CihuyDataAPI(UrlGetKtsById, token, (error, response) => {
    if (error) {
      console.error("Terjadi kesalahan saat mengambil KTS: ", error);
    } else {
      const KtsData = response.data;
      if (KtsData) {
        // Dapatkan id KTS dari data yang diterima
        const KtsId = KtsData.id_kts;
        const UrlDeleteKts = `https://simbe-dev.ulbi.ac.id/api/v1/kts/delete?idkts=${KtsId}`;

        // Menampilkan pesan konfirmasi SweetAlert
        Swal.fire({
          title: "Hapus KTS?",
          text: "Apakah Anda yakin ingin menghapus KTS?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Ya, Hapuskan",
          cancelButtonText: "Batal",
        }).then((result) => {
          if (result.isConfirmed) {
            // Lakukan permintaan DELETE
            CihuyDeleteAPI(UrlDeleteKts, token, (deleteError, deleteData) => {
              if (deleteError) {
                console.error(
                  "Terjadi kesalahan saat menghapus KTS: ",
                  deleteError
                );
                Swal.fire({
                  icon: "error",
                  title: "Oops...",
                  text: "Terjadi kesalahan saaat menghapus KTS",
                });
              } else {
                console.log("KTS berhasil dihapus: ", deleteData);
                Swal.fire({
                  icon: "success",
                  title: "Sukses!",
                  text: "KTS berhasil dihapus",
                  showConfirmButton: false,
                  timer: 1500,
                }).then(() => {
                  // Refresh halaman setelah menutup popup
                  window.location.reload();
                });
              }
            });
          }
        });
      } else {
        console.error("Data KTS tidak ditemukan.");
      }
    }
  });
}

// Untuk POST Data dengan API
const Tombol = document.getElementById("buttoninsert");
Tombol.addEventListener("click", async function (e) {
  e.preventDefault();
  console.log("Button Clicked");
  const ktsval = document.getElementById("kts").value;
  var raw = JSON.stringify({
    kts: ktsval,
  });

  // Tutup modal setelah menampilkan SweetAlert
  $("#new-member").modal("hide");

  // Menampilkan pesan konfirmasi SweetAlert
  Swal.fire({
    title: "Tambahkan KTS?",
    text: "Apakah Anda yakin ingin menambahkan KTS?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Ya, Tambahkan",
    cancelButtonText: "Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      // Jika pengguna menekan tombol "Ya, Tambahkan", kirim permintaan POST
      CihuyPostKTS(UrlPostKts, token, raw)
        .then((responseText) => {
          console.log("Response:", responseText);
          // Menampilkan SweetAlert
          Swal.fire({
            icon: "success",
            title: "Sukses!",
            text: "KTS berhasil ditambahkan",
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            // Refresh halaman setelah menutup popup
            window.location.reload();
          });
        })
        .catch((error) => {
          console.error("Error:", error);
          // Tangani kesalahan jika terjadi
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Terjadi kesalahan saat menambahkan data.",
          });
        });
    }
  });
});

// Untuk UPDATE Data menggunakan API
// Untuk ambil data per id
function getKtsById(id_kts, callback) {
  const UrlGetKtsById = `https://simbe-dev.ulbi.ac.id/api/v1/kts/get?idkts=${id_kts}`;

  CihuyDataAPI(UrlGetKtsById, token, (error, response) => {
    if (error) {
      console.error("Terjadi kesalahan saat mengambil data : ", error);
      callback(error, null);
    } else {
      const ktsData = response.data;
      callback(null, ktsData);
    }
  });
}
// Untuk edit data
function ediData(id_kts) {
  getKtsById(id_kts, (error, ktsData) => {
    if (error) {
      console.error("Gagal mengambil data kts : ", error);
      return;
    }
    // Untuk ambil nilai dari form
    document.getElementById("kts-update").value = ktsData.kts;

    // Menampilkan modal edit
    const modal = new bootstrap.Modal(
      document.getElementById("new-member-update")
    );
    modal.show();

    // Membuat event listener untuk button update
    const simpanPerubahanButton = document.getElementById("updateDataButton");
    simpanPerubahanButton.addEventListener("click", function () {
      const ktsBaru = document.getElementById("kts-update").value;

      const dataKtsToUpdate = {
        kts: ktsBaru,
      };

      // Hide modal ketika sudah selesai isi
      $("#new-member-update").modal("hide");

      // Tampilkan SweetAlert untuk konfirmasi perubahan data
      Swal.fire({
        title: "Update KTS?",
        text: "Apakah Anda yakin ingin update KTS?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Ya, Update",
        cancelButtonText: "Batal",
      }).then((result) => {
        if (result.isConfirmed) {
          sendUpdateKts(id_kts, dataKtsToUpdate, modal);
        }
      });
    });
  });
}
// Untuk mengirimkan request update
function sendUpdateKts(id_kts, dataKtsToUpdate, modal) {
  const UrlPutKts = `https://simbe-dev.ulbi.ac.id/api/v1/kts/update?idkts=${id_kts}`;

  CihuyUpdateApi(UrlPutKts, token, dataKtsToUpdate, (error, responseText) => {
    if (error) {
      console.error("Terjadi kesalahan saat update data KTS : ", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Terjadi kesalahan saat update data KTS",
      });
    } else {
      console.log("Respon sukses : ", responseText);
      // Tutup modal
      modal.hide();
      // Tampilkan SweetAlert Sukses
      Swal.fire({
        icon: "success",
        title: "Sukses!",
        text: "Data KTS berhasil diperbarui",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        window.location.reload();
      });
    }
  });
}
