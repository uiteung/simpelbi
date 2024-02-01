// import { tampilData } from "../js/config/configsiklus.js";
// import { CihuyPostKTS } from "../js/config/configkts.js";
import { UrlGetSiklus, token, UrlPostSiklus } from "../js/template/template.js";
import {
  CihuyDataAPI,
  CihuyPostApi,
  CihuyDeleteAPI,
  CihuyUpdateApi,
} from "https://c-craftjs.github.io/simpelbi/api.js";
import { populateUserProfile } from "https://c-craftjs.github.io/simpelbi/profile.js";

// Untuk GET Data Profile
populateUserProfile();

// Untuk Get Data dari API
export function tampilData(data) {
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
                <h6>${item.tahun}</h6>
              </a>
          </div>
        </div>
    </td>
    <td>
        <ul class="orderDatatable_actions mb-0 d-flex flex-wrap">
          
          <li>
              <a href="#" class="edit" data-target="#new-member-update" data-siklus-id="${item.idSiklus}">
                <i class="uil uil-edit"></i>
              </a>
          </li>
          <li>
              <a href="#" class="remove" data-siklus-id=${item.idSiklus}>
                <i class="uil uil-trash-alt"></i>
              </a>
          </li>
        </ul>
    </td>
      `;
    // Untuk remove button
    const removeButton = barisBaru.querySelector(".remove");
    removeButton.addEventListener("click", () => {
      const siklusId = removeButton.getAttribute("data-siklus-id");
      if (siklusId) {
        deleteSiklus(siklusId);
      } else {
        console.log("id Periode tidak ditemukan");
      }
    });
    // Untuk edit button
    const ediButton = barisBaru.querySelector(".edit");
    ediButton.addEventListener("click", () => {
      const siklusId = ediButton.getAttribute("data-siklus-id");
      if (siklusId) {
        editData(siklusId);
      } else {
        console.error("id Periode tidak ditemukan");
      }
    });
    tableBody.appendChild(barisBaru);
    nomor++;
  });
}

CihuyDataAPI(UrlGetSiklus, token, (error, response) => {
  if (error) {
    console.error("Terjadi kesalahan:", error);
  } else {
    const data = response.data;
    console.log("Data yang diterima:", data);
    tampilData(data);
  }
});

// Untuk POST Data
const Tombol = document.getElementById("simpanbutt");
Tombol.addEventListener("click", async function (e) {
  e.preventDefault();
  console.log("Button Clicked");
  const thnval = document.getElementById("thn").value;
  const data = {
    tahun: thnval,
  };

  // Tutup modal setelah menampilkan SweetAlert
  $("#new-member").modal("hide");

  // Menampilkan pesan konfirmasi SweetAlert
  Swal.fire({
    title: "Tambahkan Siklus?",
    text: "Apakah Anda yakin ingin menambahkan Siklus?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Ya, Tambahkan",
    cancelButtonText: "Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      // Mengirim permintaan POST menggunakan fungsi CihuyPostApi
      CihuyPostApi(UrlPostSiklus, token, data)
        .then((responseText) => {
          console.log("Response:", responseText);
          Swal.fire({
            icon: "success",
            title: "Sukses!",
            text: "Siklus berhasil ditambahkan",
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            // Refresh halaman setelah menutup popup
            // window.location.reload();
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

// Untuk DELETE Data Siklus
function deleteSiklus(idSiklus) {
  // Buat URL untuk mengambil data standar berdasarkan id
  const UrlGetSiklusById = `https://simbe-dev.ulbi.ac.id/api/v1/siklus/get?idsiklus=${idSiklus}`;

  // Lakukan permintaan GET untuk mengambil siklus berdasarkan tahun
  CihuyDataAPI(UrlGetSiklusById, token, (error, response) => {
    if (error) {
      console.error("Terjadi kesalahan saat mengambil admin: ", error);
    } else {
      const siklusData = response.data;
      if (siklusData) {
        // Dapatkan id Periode dari data yang diterima
        const siklusId = siklusData.idSiklus;
        const UrlDeleteSiklus = `https://simbe-dev.ulbi.ac.id/api/v1/siklus/delete?idsiklus=${siklusId}`;

        // Menampilklan pesan konfirmasi SweetAlert
        Swal.fire({
          title: "Hapus Siklus?",
          text: "Apakah Anda yakin ingin menghapus Siklus?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Ya, Hapuskan",
          cancelButtonText: "Batal",
        }).then((result) => {
          if (result.isConfirmed) {
            // Lakukan permintaan DELETE
            CihuyDeleteAPI(
              UrlDeleteSiklus,
              token,
              (deleteError, deleteData) => {
                if (deleteError) {
                  console.error(
                    "Terjadi kesalahan saat menghapus Siklus: ",
                    deleteError
                  );
                  Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Terjadi kesalahan saat menghapus Siklus!",
                  });
                } else {
                  console.log("Siklus berhasil dihapus:", deleteData);
                  Swal.fire({
                    icon: "success",
                    title: "Sukses!",
                    text: "Siklus berhasil dihapus",
                    showConfirmButton: false,
                    timer: 1500,
                  }).then(() => {
                    // Refresh halaman setelah menutup popup
                    window.location.reload();
                  });
                }
              }
            );
          }
        });
      } else {
        console.error("Data Siklus tidak ditemukan.");
      }
    }
  });
}

// Untuk UPDATE Data menggunakan API
// Untuk ambil data per id
function getSiklusById(idSiklus, callback) {
  const UrlGetSiklusById = `https://simbe-dev.ulbi.ac.id/api/v1/siklus/get?idsiklus=${idSiklus}`;
  CihuyDataAPI(UrlGetSiklusById, token, (error, response) => {
    if (error) {
      console.error("Terjadi kesalahan saat mengambil data : ", error);
      callback(error, null);
    } else {
      const siklusData = response.data;
      callback(null, siklusData);
    }
  });
}
// Untuk edit data
function editData(idSiklus) {
  getSiklusById(idSiklus, (error, siklusData) => {
    if (error) {
      console.error("Gagal mengambil data siklus : ", error);
      return;
    }
    // Untuk ambil nilai dari form
    document.getElementById("thn-update").value = siklusData.tahun;

    // Menampilkan modal edit
    const modal = new bootstrap.Modal(
      document.getElementById("new-member-update")
    );
    modal.show();

    // Membuat event listener untuk button update
    const simpanPerubahanButton = document.getElementById("updateDataButton");
    simpanPerubahanButton.addEventListener("click", function () {
      const tahunBaru = document.getElementById("thn-update").value;

      const dataSiklusToUpdate = {
        tahun: tahunBaru,
      };

      // Hide modal ketika sudah selesai isi
      $("#new-member-update").modal("hide");

      // Tampilkan SweetAlert untuk konfirmasi perubahan data
      Swal.fire({
        title: "Update Siklus?",
        text: "Apakah Anda yakin ingin update Siklus?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Ya, Update",
        cancelButtonText: "Batal",
      }).then((result) => {
        if (result.isConfirmed) {
          sendUpdateSiklus(idSiklus, dataSiklusToUpdate, modal);
        }
      });
    });
  });
}
// Untuk mengirimkan request update
function sendUpdateSiklus(idSiklus, dataSiklusToUpdate, modal) {
  const UrlPutSiklus = `https://simbe-dev.ulbi.ac.id/api/v1/siklus/update?idsiklus=${idSiklus}`;

  CihuyUpdateApi(
    UrlPutSiklus,
    token,
    dataSiklusToUpdate,
    (error, responseText) => {
      if (error) {
        console.error("Terjadi kesalahan saat update data Periode : ", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Terjadi kesalahan saat update data Periode",
        });
      } else {
        console.log("Respon sukses : ", responseText);
        // Tutup modal
        modal.hide();
        // Tampilkan SweetAlert Sukses
        Swal.fire({
          icon: "success",
          title: "Sukses!",
          text: "Data Periode berhasil diperbarui",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          window.location.reload();
        });
      }
    }
  );
}
