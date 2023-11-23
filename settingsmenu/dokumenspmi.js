import {
  CihuyDataAPI,
  CihuyPostApi,
  CihuyUpdateApi,
  CihuyDeleteAPI,
} from "https://c-craftjs.github.io/simpelbi/api.js";
import { CihuyGetCookie } from "https://c-craftjs.github.io/cookies/cookies.js";
import { populateUserProfile } from "https://c-craftjs.github.io/simpelbi/profile.js";
import { CihuyPaginations2 } from "https://c-craftjs.github.io/simpelbi/pagenations.js";

// Untuk Get Data Profile
populateUserProfile();

const apiUrl = "https://simbe-dev.ulbi.ac.id/api/v1/dokumen";
const token = CihuyGetCookie("login"); // Get Cookie From SimpelBi
let idFileToUpdate = null;

const itemsPerPage = 3;
let currentPage = 1;

// Function to display data for a specific page
function displayPageData(data, currentPage) {
  const tableBody = document.getElementById("tableBody");
  tableBody.innerHTML = "";

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

  let nomor = startIndex + 1;

  paginatedData.forEach((item) => {
    const barisBaru = document.createElement("tr");
    barisBaru.innerHTML = `
    <td>${nomor}</td>
    <td>${item.id_dokumen}</td>
    <td>${item.tahun}</td>
    <td>${item.judul}</td>
    <td>
    <a href="https://simbe-dev.ulbi.ac.id/static/pictures/${item.file}" class="btn btn-primary btn-sm" target="_blank">
      Lihat
    </a>
  </td>          
  <td>${item.tanggal}</td>
    <td>${item.nm_admin}</td>

    <td>
      <ul class="orderDatatable_actions mb-0 d-flex flex-wrap">
        
        <li>
        <a href="#" class="edit" data-target="#new-member-update" data-files-id="${item.id_dokumen}">
        <i class="uil uil-edit"></i>
          </a>
        </li>
        <li>
        <a href="#" class="remove" data-files-id="${item.id_dokumen}">
        <i class="uil uil-trash-alt"></i>
          </a>
        </li>
      </ul>
    </td>
  `;
    const removeButton = barisBaru.querySelector(".remove");
    removeButton.addEventListener("click", () => {
      const id_dokumen = removeButton.getAttribute("data-files-id");
      if (id_dokumen) {
        deleteFile(id_dokumen);
      } else {
        console.error("id hasil survei untuk Auditor tidak ditemukan.");
      }
    });
    const editButton = barisBaru.querySelector(".edit");
    editButton.addEventListener("click", () => {
      const id_dokumen = editButton.getAttribute("data-files-id");
      if (id_dokumen) {
        editData(id_dokumen);
      } else {
        console.error("id hasil survei untuk Auditor tidak ditemukan.");
      }
    });
    tableBody.appendChild(barisBaru);
    nomor++;
  });
}
function createPaginationControls(data) {
  const paginationContainer = document.querySelector(".dm-pagination");

  CihuyPaginations2(
    data,
    currentPage,
    itemsPerPage,
    paginationContainer,
    (newPage) => {
      currentPage = newPage;
      displayPageData(data, currentPage);
      createPaginationControls(data);
    }
  );
}
CihuyDataAPI(apiUrl, token, (error, response) => {
  if (error) {
    console.error("Terjadi kesalahan:", error);
  } else {
    const data = response.data;
    console.log("Data yang diterima:", data);
    // ShowDataUsersAuditor(data);
    createPaginationControls(data);
    displayPageData(data, currentPage); // siklusdata(data);
  }
});

function editData(id_dokumen) {
  // Gunakan CihuyDataAPI untuk mengambil data dari server
  CihuyDataAPI(
    apiUrl + `?id_dokumen=${id_dokumen}`,
    token,
    (error, response) => {
      if (error) {
        console.error("Terjadi kesalahan:", error);
      } else {
        const data = response.data;
        console.log("Data yang diterima:", data);
        const fileData = data.find(
          (item) => item.id_dokumen === parseInt(id_dokumen)
        );
        document.getElementById("judul-update").value = fileData.judul;

        // Set nilai idFileToUpdate dengan idFile yang ingin diupdate
        idFileToUpdate = fileData.id_dokumen;

        // Tampilkan modal
        const modal = new bootstrap.Modal(
          document.getElementById("new-member-update")
        );
        modal.show();

        // Isi dropdown "siklus-update"
        const siklusDropdown = document.getElementById("periode-update");
        if (siklusDropdown) {
          // Panggil fungsi untuk mengisi dropdown siklus
          CihuyDataAPI(siklusapi, token, (siklusError, siklusResponse) => {
            if (siklusError) {
              console.error("Terjadi kesalahan:", siklusError);
            } else {
              siklusupdate(fileData); // Gunakan fungsi untuk mengisi dropdown siklus
            }
          });
        }
      }
    }
  );
}

// Mendapatkan referensi ke elemen-elemen formulir
const periodeUpdateInput = document.getElementById("periode-update");
const judulUpdateInput = document.getElementById("judul-update");
const fileUpdateInput = document.getElementById("file-update");
const updateDataButton = document.getElementById("updateDataButton");

// Event listener untuk tombol "Update Data"
updateDataButton.addEventListener("click", function () {
  // Ambil data dari input form
  const periode = periodeUpdateInput.value;
  const judul = judulUpdateInput.value;
  const file = fileUpdateInput.files[0]; // Ambil file yang diunggah

  // Tutup modal jika diperlukan
  $("#new-member-update").modal("hide");

  // Tampilkan SweetAlert konfirmasi dengan judul, teks, dan ikon yang berbeda
  Swal.fire({
    title: "Update Files pada Auditor?",
    text: "Apakah Anda yakin ingin update Files untuk Auditor?", // Teks yang berbeda
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Ya, Update",
    cancelButtonText: "Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      // Buat objek data yang akan dikirim ke API sesuai dengan format JSON yang diberikan
      const dataToUpdate = {
        id_periode: parseInt(periode),
        judul: judul,
        file: {
          fileType: "application/pdf", // Ganti dengan tipe file yang sesuai
          payload: "", // Payload akan diisi nanti
        },
      };

      // Jika ada file yang diunggah, baca file dan konversi ke base64
      if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
          // Hasil bacaan file akan tersedia di reader.result
          dataToUpdate.file.payload = reader.result.split(",")[1]; // Ambil base64-nya
          // Panggil fungsi update API
          CihuyUpdateApi(
            apiUrl + `/update?id_dokumen=${idFileToUpdate}`, // Anda mungkin perlu menyesuaikan URL ini
            token,
            dataToUpdate,
            function (error, responseData) {
              if (error) {
                console.error("Error updating data:", error);
                // Handle error (tampilkan pesan error ke pengguna jika diperlukan)
                Swal.fire({
                  icon: "error",
                  title: "Oops...",
                  text: "Terjadi kesalahan saat mengupdate data.",
                });
              } else {
                // Data berhasil diupdate
                console.log("Data updated successfully:", responseData);
                // Refresh tampilan data
                CihuyDataAPI(apiUrl, token, (error, response) => {
                  if (error) {
                    console.error("Terjadi kesalahan:", error);
                    Swal.fire({
                      icon: "error",
                      title: "Oops...",
                      text: "Terjadi kesalahan saat memuat data baru.",
                    });
                  } else {
                    const data = response.data;
                    console.log("Data yang diterima:", data);
                    // tampilData(data);
                    // Tampilkan SweetAlert sukses
                    Swal.fire({
                      icon: "success",
                      title: "Sukses",
                      text: "Data berhasil diupdate.",
                      showConfirmButton: false,
                      timer: 1500,
                    }).then(() => {
                      window.location.reload();
                    });
                  }
                });
              }
            }
          );
        };
      } else {
        // Panggil fungsi update API jika tidak ada file yang diunggah
        CihuyUpdateApi(
          apiUrl + `/update?id_dokumen=${idFileToUpdate}`, // Anda mungkin perlu menyesuaikan URL ini
          token,
          dataToUpdate,
          function (error, responseData) {
            if (error) {
              console.error("Error updating data:", error);
              // Handle error (tampilkan pesan error ke pengguna jika diperlukan)
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Terjadi kesalahan saat mengupdate data.",
              });
            } else {
              // Data berhasil diupdate
              console.log("Data updated successfully:", responseData);
              // Tutup modal jika diperlukan
              const modal = new bootstrap.Modal(
                document.getElementById("new-member-update")
              );
              modal.hide();
              // Refresh tampilan data
              CihuyDataAPI(apiUrl, token, (error, response) => {
                if (error) {
                  console.error("Terjadi kesalahan:", error);
                  Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Terjadi kesalahan saat memuat data baru.",
                  });
                } else {
                  const data = response.data;
                  console.log("Data yang diterima:", data);
                  // tampilData(data);
                  // Tampilkan SweetAlert sukses
                  Swal.fire({
                    icon: "success",
                    title: "Sukses",
                    text: "Data berhasil diupdate.",
                    showConfirmButton: false,
                    timer: 1500,
                  }).then(() => {
                    window.location.reload();
                  });
                }
              });
            }
          }
        );
      }
    }
  });
});

function deleteFile(id_dokumen) {
  // Tampilkan dialog konfirmasi menggunakan SweetAlert2
  Swal.fire({
    title: "Apakah Anda yakin ingin menghapus files?",
    text: "Penghapusan files akan permanen.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Ya, Hapus",
    cancelButtonText: "Tidak, Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      // Buat URL untuk mengambil files berdasarkan ID
      const apiUrlGetfileById = `https://simbe-dev.ulbi.ac.id/api/v1/dokumen/get?id_dokumen=${id_dokumen}`;

      // Lakukan permintaan GET untuk mengambil files berdasarkan id hasil survei
      CihuyDataAPI(apiUrlGetfileById, token, (error, response) => {
        if (error) {
          console.error("Terjadi kesalahan saat mengambil files:", error);
        } else {
          const fileData = response.data;
          if (fileData) {
            // Dapatkan id hasil survei dari data yang diterima
            const FileIDtoDelete = fileData.id_dokumen;

            // Buat URL untuk menghapus files berdasarkan ID files yang telah ditemukan
            const apiUrlfilesDelete = `https://simbe-dev.ulbi.ac.id/api/v1/dokumen/delete?id_dokumen=${FileIDtoDelete}`;

            // Lakukan permintaan DELETE untuk menghapus files
            CihuyDeleteAPI(
              apiUrlfilesDelete,
              token,
              (deleteError, deleteData) => {
                if (deleteError) {
                  console.error(
                    "Terjadi kesalahan saat menghapus files:",
                    deleteError
                  );
                  Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Terjadi kesalahan saat menghapus files!",
                  });
                } else {
                  console.log("files berhasil dihapus:", deleteData);
                  Swal.fire({
                    icon: "success",
                    title: "Sukses!",
                    text: "files berhasil dihapus.",
                    showConfirmButton: false,
                    timer: 1500,
                  }).then(() => {
                    // Refresh halaman setelah menutup popup
                    window.location.reload();
                  });
                }
              }
            );
          } else {
            console.error("Data files tidak ditemukan.");
          }
        }
      });
    } else {
      // Tampilkan pesan bahwa penghapusan dibatalkan
      Swal.fire("Dibatalkan", "Penghapusan files dibatalkan.", "info");
    }
  });
}
