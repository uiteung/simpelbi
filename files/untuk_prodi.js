import {
  CihuyDataAPI,
  CihuyPostApi,
  CihuyUpdateApi,
  CihuyDeleteAPI,
} from "https://c-craftjs.github.io/simpelbi/api.js";
import { CihuyGetCookie } from "https://c-craftjs.github.io/cookies/cookies.js";
// import { UrlGetFileProdi } from "../js/template/template";
import { populateUserProfile } from "https://c-craftjs.github.io/simpelbi/profile.js";
import { CihuyPaginations2 } from "https://c-craftjs.github.io/simpelbi/pagenations.js";

// Untuk GET Data Profile
populateUserProfile();

const apiUrl = "https://simbe-dev.ulbi.ac.id/api/v1/filesprodi";
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
    <td>${item.idFile}</td>
    <td>${item.tahun}</td>
    <td>${item.judul}</td>
    <td>
    <a href="https://simbe-dev.ulbi.ac.id/static/pictures/${item.file}" class="btn btn-primary btn-sm" target="_blank">
      Lihat
    </a>
  </td>          
  <td>${item.tgl}</td>
    <td>${item.nm_admin}</td>

    <td>
      <ul class="orderDatatable_actions mb-0 d-flex flex-wrap">
        
        <li>
        <a href="#" class="edit" data-target="#new-member-update" data-untuk-prodi-id="${item.idFile}">
        <i class="uil uil-edit"></i>
          </a>
        </li>
        <li>
        <a href="#" class="remove" data-untuk-prodi-id="${item.idFile}">
        <i class="uil uil-trash-alt"></i>
          </a>
        </li>
      </ul>
    </td>
  `;
    const removeButton = barisBaru.querySelector(".remove");
    removeButton.addEventListener("click", () => {
      const idFile = removeButton.getAttribute("data-untuk-prodi-id");
      if (idFile) {
        deletefileprodi(idFile);
      } else {
        console.error("ID filesprodi untuk prodi tidak ditemukan.");
      }
    });
    const editButton = barisBaru.querySelector(".edit");
    editButton.addEventListener("click", () => {
      const idFile = editButton.getAttribute("data-untuk-prodi-id");
      if (idFile) {
        editData(idFile);
      } else {
        console.error("ID filesprodi untuk prodi tidak ditemukan.");
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
// function tampilData(data) {
//   const tableBody = document.getElementById("tableBody");

//   // Kosongkan isi tabel saat ini
//   tableBody.innerHTML = "";
//   let nomor = 1;

//   // Loop melalui data yang diterima dari API
//   data.forEach((item) => {
//     const barisBaru = document.createElement("tr");
//     barisBaru.innerHTML = `
//             <td>${nomor}</td>
//             <td>${item.idFile}</td>
//             <td>${item.tahun}</td>
//             <td>${item.judul}</td>
//             <td>
//             <a href="https://simbe-dev.ulbi.ac.id/static/pictures/${item.file}" class="btn btn-primary btn-sm" target="_blank">
//               Lihat
//             </a>
//           </td>
//             <td>${item.tgl}</td>
//             <td>${item.nm_admin}</td>
//             <td>
//               <ul class="orderDatatable_actions mb-0 d-flex flex-wrap">

//                 <li>
//                 <a href="#" class="edit"  data-target="#new-member-update" data-untuk-prodi-id="${item.idFile}">
//                 <i class="uil uil-edit"></i>
//                   </a>
//                 </li>
//                 <li>
//                 <a href="#" class="remove" data-untuk-prodi-id="${item.idFile}">
//                 <i class="uil uil-trash-alt"></i>
//                   </a>
//                 </li>
//               </ul>
//             </td>
//           `;
// const removeButton = barisBaru.querySelector(".remove");
// removeButton.addEventListener("click", () => {
//   const idFile = removeButton.getAttribute("data-untuk-prodi-id");
//   if (idFile) {
//     deletefileprodi(idFile);
//   } else {
//     console.error("ID filesprodi untuk prodi tidak ditemukan.");
//   }
// });
// const editButton = barisBaru.querySelector(".edit");
// editButton.addEventListener("click", () => {
//   const idFile = editButton.getAttribute("data-untuk-prodi-id");
//   if (idFile) {
//     editData(idFile);
//   } else {
//     console.error("ID filesprodi untuk prodi tidak ditemukan.");
//   }
// });
//     tableBody.appendChild(barisBaru);
//     nomor++;
//   });
// }
function editData(idFile) {
  // Gunakan CihuyDataAPI untuk mengambil data dari server
  CihuyDataAPI(apiUrl + `?idFile=${idFile}`, token, (error, response) => {
    if (error) {
      console.error("Terjadi kesalahan:", error);
    } else {
      const data = response.data;
      console.log("Data yang diterima:", data);
      const fileData = data.find((item) => item.idFile === parseInt(idFile));
      document.getElementById("judul-update").value = fileData.judul;

      // Set nilai idFileToUpdate dengan idFile yang ingin diupdate
      idFileToUpdate = fileData.idFile;

      // Tampilkan modal
      const modal = new bootstrap.Modal(
        document.getElementById("new-member-update")
      );
      modal.show();

      // Isi dropdown "siklus-update"
      const siklusDropdown = document.getElementById("siklus-update");
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
  });
}

// Untuk UPDATE Data menggunakan API
// Mendapatkan referensi ke elemen-elemen formulir
const siklusUpdateInput = document.getElementById("siklus-update");
const judulUpdateInput = document.getElementById("judul-update");
const fileUpdateInput = document.getElementById("file-update");
const updateDataButton = document.getElementById("updateDataButton");

// Event listener untuk tombol "Update Data"
updateDataButton.addEventListener("click", function () {
  // Ambil data dari input form
  const siklus = siklusUpdateInput.value;
  const judul = judulUpdateInput.value;
  const file = fileUpdateInput.files[0]; // Ambil file yang diunggah

  // Tutup modal jika diperlukan
  $("#new-member-update").modal("hide");

  // Tampilkan SweetALert konfirmasi
  Swal.fire({
    title: "Update Files pada Prodi?",
    text: "Apakah Anda yakin ingin update Files untuk Prodi?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Ya, Update",
    cancelButtonText: "Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      // Buat objek data yang akan dikirim ke API sesuai dengan format JSON yang diberikan
      const dataToUpdate = {
        idSiklus: parseInt(siklus),
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
            apiUrl + `/update?idfilesprodi=${idFileToUpdate}`, // Anda mungkin perlu menyesuaikan URL ini
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
                // Data berhasil diupdate, mungkin Anda ingin melakukan sesuatu di sini
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
                    window.location.reload();
                    tampilData(data);
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
          apiUrl + `/update?idfilesprodi=${idFileToUpdate}`, // Anda mungkin perlu menyesuaikan URL ini
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
              // Data berhasil diupdate, mungkin Anda ingin melakukan sesuatu di sini
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
                  tampilData(data);
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
function siklusupdate() {
  const selectElement = document.getElementById("siklus-update");

  // Kosongkan isi dropdown saat ini
  selectElement.innerHTML = "";

  // Panggil fungsi untuk mengambil data siklus dari API
  CihuyDataAPI(siklusapi, token, (siklusError, siklusResponse) => {
    if (siklusError) {
      console.error("Terjadi kesalahan:", siklusError);
    } else {
      const siklusData = siklusResponse.data;
      console.log("Data Siklus yang diterima:", siklusData);

      // Loop melalui data yang diterima dari API
      siklusData.forEach((item, index) => {
        const optionElement = document.createElement("option");
        optionElement.value = item.idSiklus;
        optionElement.textContent = `${item.idSiklus} - Siklus ${item.tahun}`;
        selectElement.appendChild(optionElement);
      });
    }
  });
}

const siklusapi = "https://simbe-dev.ulbi.ac.id/api/v1/siklus/";
const apiPostFiles = "https://simbe-dev.ulbi.ac.id/api/v1/filesprodi/add";

//function delete ini
function deletefileprodi(idFile) {
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
      const apiUrlGetfileById = `https://simbe-dev.ulbi.ac.id/api/v1/filesprodi/get?idfilesprodi=${idFile}`;

      // Lakukan permintaan GET untuk mengambil files berdasarkan ID files
      CihuyDataAPI(apiUrlGetfileById, token, (error, response) => {
        if (error) {
          console.error("Terjadi kesalahan saat mengambil files:", error);
        } else {
          const fileData = response.data;
          if (fileData) {
            // Dapatkan ID files dari data yang diterima
            const FileIDtoDelete = fileData.idFile;

            // Buat URL untuk menghapus files berdasarkan ID files yang telah ditemukan
            const apiUrlfilesDelete = `https://simbe-dev.ulbi.ac.id/api/v1/filesprodi/delete?idfilesprodi=${FileIDtoDelete}`;

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

// Untuk POST Data menggunakan API
// Mendapatkan referensi ke elemen-elemen formulir
const form = document.getElementById("myForm");
const siklusInput = document.getElementById("siklus");
const judulInput = document.getElementById("judul");
const fileInput = document.getElementById("file");

// Menambahkan event listener ke tombol Simpan
document
  .getElementById("tambahDataButton")
  .addEventListener("click", async function () {
    // Mendapatkan nilai dari elemen formulir
    const idSiklus = siklusInput.value;
    const judul = judulInput.value;
    const file = fileInput.files[0];

    // Mengecek apakah file telah dipilih
    if (!idSiklus || !judul || !file) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Harap isi semua bidang formulir!",
      });
      return;
    }

    // Tutup modal sebelum menampilkan SweetAlert konfirmasi
    $("#new-member").modal("hide");

    // Menampilkan SweetAlert konfirmasi yang berbeda
    Swal.fire({
      title: "Tambahkan Files untuk Prodi?", // Judul yang berbeda
      text: "Apakah Anda yakin ingin menambahkan File untuk Prodi?", // Teks yang berbeda
      icon: "question", // Ikon yang berbeda
      showCancelButton: true,
      confirmButtonText: "Ya, Tambahkan",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        // Membaca file yang diunggah ke dalam bentuk base64
        const reader = new FileReader();
        reader.onload = async function () {
          const base64Data = reader.result.split(",")[1]; // Mengambil bagian payload dari data base64

          // Membuat objek data yang akan dikirim ke server
          const data = {
            idSiklus: parseInt(idSiklus),
            judul: judul,
            file: {
              fileType: file.type,
              payload: base64Data,
            },
          };

          try {
            // Kirim permintaan POST ke server menggunakan fungsi CihuyPostApi
            await CihuyPostApi(apiPostFiles, token, data);

            // Tampilkan SweetAlert berhasil
            Swal.fire({
              icon: "success",
              title: "Berhasil",
              text: "Data telah berhasil disimpan.",
              showConfirmButton: false,
              timer: 1500,
            }).then(() => {
              // Reload halaman setelah menampilkan SweetAlert berhasil
              window.location.reload();
            });
          } catch (error) {
            console.error("Terjadi kesalahan:", error);
            console.log("Data yang dikirimkan:", data);
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Terjadi kesalahan saat menyimpan data.",
            });
            // Handle kesalahan jika terjadi
          }
        };

        // Membaca file sebagai base64
        reader.readAsDataURL(file);
      }
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

// // get data
// CihuyDataAPI(apiUrl, token, (error, response) => {
//   if (error) {
//     console.error("Terjadi kesalahan:", error);
//   } else {
//     const data = response.data;
//     console.log("Data yang diterima:", data);
//     // tampilData(data);
//   }
// });

// CihuyPostApi(UrlPostUsersAdmin, token, dataToSend)
//   .then((responseText) => {
//     console.log("Respon sukses:", responseText);
//     // Lakukan tindakan lain setelah permintaan POST berhasil
//   })
//   .catch((error) => {
//     console.error("Terjadi kesalahan:", error);
//     // Handle kesalahan jika terjadi
//   });
