import {
  CihuyDataAPI,
  CihuyPostApi,
  CihuyUpdateApi,
  CihuyDeleteAPI,
} from "https://c-craftjs.github.io/simpelbi/api.js";
import { populateUserProfile } from "https://c-craftjs.github.io/simpelbi/profile.js";
import { CihuyPaginations2 } from "https://c-craftjs.github.io/simpelbi/pagenations.js";

import {
  UrlGetUsersAdmin,
  UrlPostUsersAdmin,
} from "../js/template/template.js";
// import { ShowDataUsersAdmin } from "../js/config/configusersadmin.js";
import { CihuyGetCookie } from "https://c-craftjs.github.io/cookies/cookies.js";
const token = CihuyGetCookie("login");
// Untuk Get Data dari API
populateUserProfile();

// export function ShowDataUsersAdmin(data) {
//   const tableBody = document.getElementById("content");

//   // Kosongkan isi tabel saat ini
//   tableBody.innerHTML = "";
//   let nomor = 1;

//   // Loop melalui data yang diterima dari API
//   data.forEach((item) => {
//     const barisBaru = document.createElement("tr");
//     barisBaru.innerHTML = `
//        <td>
//           <div class="userDatatable-content">${nomor}</div>
//        </td>
//        <td>
//           <div class="d-flex">
//              <div class="userDatatable-inline-title">
//                 <a href="#" class="text-dark fw-500">
//                    <h6>${item.nama}</h6>
//                 </a>
//              </div>
//           </div>
//        </td>
//        <td>
//           <div class="userDatatable-content">
//              ${item.jabatan}
//           </div>
//        </td>
//        <td>
//           <div class="userDatatable-content">
//              ${item.email}
//           </div>
//        </td>
//        <td>
//           <div class="userDatatable-content">
//              ${item.nidn}
//           </div>
//        </td>
//        <td>
//           <div class="userDatatable-content">
//           <img src="https://simbe-dev.ulbi.ac.id/static/pictures/${item.foto_data}" alt="Foto" width="100" height="100">
//           </div>
//        </td>
//        <td>
//           <ul class="orderDatatable_actions mb-0 d-flex flex-wrap">
//              <li>
//                 <a href="#" class="view">
//                    <i class="uil uil-eye"></i>
//                 </a>
//              </li>
//              <li>
//                 <a href="#" class="edit"  data-target="#new-member-update" data-admin-id="${item.id_admin}">
//                    <i class="uil uil-edit"></i>
//                 </a>
//              </li>
//              <li>
//              <a href="#" class="remove" data-admin-id="${item.id_admin}">
//                 <i class="uil uil-trash-alt"></i>
//              </a>
//           </li>
//           </ul>
//        </td>
//        `;
//     const removeButton = barisBaru.querySelector(".remove");
//     removeButton.addEventListener("click", () => {
//       const adminId = removeButton.getAttribute("data-admin-id");
//       if (adminId) {
//         deleteAdmin(adminId);
//       } else {
//         console.error("ID admin tidak ditemukan.");
//       }
//     });

//     const editButton = barisBaru.querySelector(".edit");
//     editButton.addEventListener("click", () => {
//       const id_admin = editButton.getAttribute("data-admin-id");
//       if (id_admin) {
//         editData(id_admin);
//       } else {
//         console.error("ID admin untuk admin tidak ditemukan.");
//       }
//     });
//     tableBody.appendChild(barisBaru);
//     nomor++;
//   });
// }

// Define the number of items to display per page and the current page
const itemsPerPage = 3;
let currentPage = 1;

// Function to display data for a specific page
function displayPageData(data, currentPage) {
  const tableBody = document.getElementById("content");
  tableBody.innerHTML = "";

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

  let nomor = startIndex + 1;

  paginatedData.forEach((item) => {
    const barisBaru = document.createElement("tr");
    barisBaru.innerHTML = `
       <td>
          <div class="userDatatable-content">${nomor}</div>
       </td>
       <td>
          <div class="d-flex">
             <div class="userDatatable-inline-title">
                <a href="#" class="text-dark fw-500">
                   <h6>${item.nama}</h6>
                </a>
             </div>
          </div>
       </td>
       <td>
          <div class="userDatatable-content">
             ${item.jabatan}
          </div>
       </td>
       <td>
          <div class="userDatatable-content">
             ${item.email}
          </div>
       </td>
       <td>
          <div class="userDatatable-content">
             ${item.nidn}
          </div>
       </td>
       <td>
          <div class="userDatatable-content">
          <img src="https://simbe-dev.ulbi.ac.id/static/pictures/${item.foto_data}" alt="Foto" width="100" height="100">
          </div>
       </td>
       <td>
          <ul class="orderDatatable_actions mb-0 d-flex flex-wrap">
            
             <li>
                <a href="#" class="edit" data-target="#new-member-update" data-admin-id="${item.id_admin}">
                   <i class="uil uil-edit"></i>
                </a>
             </li>
             <li>
                <a href="#" class="remove" data-admin-id="${item.id_admin}">
                   <i class="uil uil-trash-alt"></i>
                </a>
             </li>
          </ul>
       </td>
       `;
    const removeButton = barisBaru.querySelector(".remove");
    removeButton.addEventListener("click", () => {
      const adminId = removeButton.getAttribute("data-admin-id");
      if (adminId) {
        deleteAdmin(adminId);
      } else {
        console.error("ID admin tidak ditemukan.");
      }
    });

    const editButton = barisBaru.querySelector(".edit");
    editButton.addEventListener("click", () => {
      const id_admin = editButton.getAttribute("data-admin-id");
      if (id_admin) {
        editData(id_admin);
      } else {
        console.error("ID admin untuk admin tidak ditemukan.");
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
// Function to fetch data from the API
CihuyDataAPI(UrlGetUsersAdmin, token, (error, response) => {
  if (error) {
    console.error("Terjadi kesalahan:", error);
  } else {
    const data = response.data;
    createPaginationControls(data);
    displayPageData(data, currentPage);
  }
});

// Call the function to fetch data from the API and set up pagination

function getAdminDataById(idAdmin, callback) {
  const apiUrlGetAdminById = `https://simbe-dev.ulbi.ac.id/api/v1/admins/get?idadmin=${idAdmin}`;

  CihuyDataAPI(apiUrlGetAdminById, token, (error, response) => {
    if (error) {
      console.error("Terjadi kesalahan saat mengambil admin:", error);
      callback(error, null);
    } else {
      const adminData = response.data;
      callback(null, adminData);
    }
  });
}
function editData(idAdmin) {
  getAdminDataById(idAdmin, (error, adminData) => {
    if (error) {
      console.error("Gagal mengambil data admin:", error);
      return;
    }

    // Mengisi formulir edit dengan data admin yang diperoleh
    document.getElementById("namaAdmin-update").value = adminData.nama;
    document.getElementById("jabatan-update").value = adminData.jabatan;
    document.getElementById("email-update").value = adminData.email;
    document.getElementById("nidn-update").value = adminData.nidn;
    // Anda mungkin perlu menyesuaikan dengan elemen-elemen formulir lainnya
    document.getElementById("username-update").value = adminData.userName; // Pastikan ada elemen dengan ID "username-update"

    // Menampilkan modal edit
    const modal = new bootstrap.Modal(
      document.getElementById("new-member-update")
    );
    modal.show();

    // Mengatur event listener untuk tombol "Simpan Perubahan"
    const simpanPerubahanButton = document.getElementById("updateDataButton");
    simpanPerubahanButton.addEventListener("click", function () {
      // Mendapatkan nilai dari elemen-elemen formulir edit
      const namaAdminBaru = document.getElementById("namaAdmin-update").value;
      const jabatanBaru = document.getElementById("jabatan-update").value;
      const emailBaru = document.getElementById("email-update").value;
      const nidnBaru = document.getElementById("nidn-update").value;
      const username = document.getElementById("username-update").value;

      // Mendapatkan file gambar yang akan diunggah
      const fotoInput = document.getElementById("fotoInput-update");
      const fotoFile = fotoInput.files[0];
      const dataAdminToUpdate = {
        nama: namaAdminBaru,
        jabatan: jabatanBaru,
        email: emailBaru,
        nidn: nidnBaru,
        userName: username,
        foto: {
          fileName: "", // Nama file gambar yang diunggah
          fileType: "", // Tipe file gambar
          payload: "", // Base64 gambar
        },
      };

      if (fotoFile) {
        // Jika ada perubahan pada gambar, maka proses gambar dan kirim dengan gambar
        const reader = new FileReader();
        reader.onload = function () {
          dataAdminToUpdate.foto.fileName = fotoFile.name;
          dataAdminToUpdate.foto.fileType = fotoFile.type;
          dataAdminToUpdate.foto.payload = reader.result.split(",")[1];

          // Hide modal ketika sudah selesai isi
          $("#new-member-update").modal("hide");

          // Tampilkan SweetAlert konfirmasi sebelum mengirim permintaan
          Swal.fire({
            title: "Update Data Admin?",
            text: "Apakah Anda yakin ingin mengupdate data admin ini?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Ya, Update",
            cancelButtonText: "Batal",
          }).then((result) => {
            if (result.isConfirmed) {
              // Kirim permintaan PUT/UPDATE ke server dengan gambar
              sendUpdateRequestWithImage(idAdmin, dataAdminToUpdate, modal);
            }
          });
        };
        reader.readAsDataURL(fotoFile);
      } else {
        // Hide modal ketika sudah selesai isi
        $("#new-member-update").modal("hide");

        // Jika tidak ada perubahan pada gambar, kirim tanpa gambar
        // Tampilkan SweetAlert konfirmasi sebelum mengirim permintaan
        Swal.fire({
          title: "Update Data Admin?",
          text: "Apakah Anda yakin ingin mengupdate data admin ini?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Ya, Update",
          cancelButtonText: "Batal",
        }).then((result) => {
          if (result.isConfirmed) {
            // Kirim permintaan PUT/UPDATE ke server tanpa gambar
            sendUpdateRequestWithoutImage(idAdmin, dataAdminToUpdate, modal);
          }
        });
      }
    });

    // Fungsi untuk mengirim permintaan PUT/UPDATE dengan gambar
    function sendUpdateRequestWithImage(idAdmin, dataAdminToUpdate, modal) {
      const apiUrlAdminUpdate = `https://simbe-dev.ulbi.ac.id/api/v1/admins/update?idadmin=${idAdmin}`;

      CihuyUpdateApi(
        apiUrlAdminUpdate,
        token,
        dataAdminToUpdate,
        (error, responseText) => {
          if (error) {
            console.error(
              "Terjadi kesalahan saat mengupdate data admin:",
              error
            );
            // Menampilkan pesan kesalahan
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Terjadi kesalahan saat mengupdate data admin.",
            });
          } else {
            console.log("Respon sukses:", responseText);
            // Menutup modal edit
            modal.hide();
            // Menampilkan pesan sukses
            Swal.fire({
              icon: "success",
              title: "Sukses!",
              text: "Data admin berhasil diperbarui.",
              showConfirmButton: false,
              timer: 1500,
            }).then(() => {
              // Refresh halaman atau lakukan tindakan lain jika diperlukan
              window.location.reload();
            });
          }
        }
      );
    }

    // Fungsi untuk mengirim permintaan PUT/UPDATE tanpa gambar
    function sendUpdateRequestWithoutImage(idAdmin, dataAdminToUpdate, modal) {
      // Hapus properti foto dari dataAdminToUpdate
      delete dataAdminToUpdate.foto;

      const apiUrlAdminUpdate = `https://simbe-dev.ulbi.ac.id/api/v1/admins/update?idadmin=${idAdmin}`;

      CihuyUpdateApi(
        apiUrlAdminUpdate,
        token,
        dataAdminToUpdate,
        (error, responseText) => {
          if (error) {
            console.error(
              "Terjadi kesalahan saat mengupdate data admin:",
              error
            );
            // Menampilkan pesan kesalahan
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Terjadi kesalahan saat mengupdate data admin.",
            });
          } else {
            console.log("Respon sukses:", responseText);
            // Menutup modal edit
            modal.hide();
            // Menampilkan pesan sukses
            Swal.fire({
              icon: "success",
              title: "Sukses!",
              text: "Data admin berhasil diperbarui.",
              showConfirmButton: false,
              timer: 1500,
            }).then(() => {
              // Refresh halaman atau lakukan tindakan lain jika diperlukan
              window.location.reload();
            });
          }
        }
      );
    }
  });
}

// CihuyDataAPI(UrlGetUsersAdmin, token, (error, response) => {
//   if (error) {
//     console.error("Terjadi kesalahan:", error);
//   } else {
//     const data = response.data;
//     console.log("Data yang diterima:", data);
//     ShowDataUsersAdmin(data);
//   }
// });
function getBase64Image(file, callback) {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function () {
    const base64Image = reader.result.split(",")[1];
    callback(base64Image);
  };
}

// Untuk POST Data menggunakan API
// Tangani penyerahan formulir saat tombol "Tambah Data" diklik
const tambahDataButton = document.getElementById("tambahDataButton");
tambahDataButton.addEventListener("click", function (e) {
  e.preventDefault();

  // Ambil data dari elemen-elemen formulir
  const namaAdmin = document.getElementById("namaAdmin").value;
  const jabatan = document.getElementById("jabatan").value;
  const email = document.getElementById("email").value;
  const nidn = document.getElementById("nidn").value;
  const fotoInput = document.getElementById("fotoInput");
  const username = document.getElementById("username").value;

  // Dapatkan nama file yang diunggah
  let fileName = ""; // Deklarasikan fileName di sini
  const fotoFile = fotoInput.files[0];
  if (fotoFile) {
    fileName = fotoFile.name;
    getBase64Image(fotoFile, function (base64Image) {
      // Buat objek data JSON yang sesuai dengan format yang Anda inginkan
      const dataToSend = {
        nama: namaAdmin,
        jabatan: jabatan,
        userName: username,
        email: email,
        nidn: nidn,
        foto: {
          fileName: fileName, // Gunakan nama file yang diunggah
          fileType: fotoFile ? fotoFile.type : "",
          payload: base64Image, // Gunakan base64 gambar
        },
      };

      // Tutup modal jika sudah terisi
      $("#new-member").modal("hide");

      // Sekarang dataToSend lengkap dengan payload gambar
      // Tampilkan SweetAlert konfirmasi
      Swal.fire({
        title: "Tambahkan Data Admin?",
        text: "Apakah Anda yakin ingin menambahkan data admin ini?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Ya, Tambahkan",
        cancelButtonText: "Batal",
      }).then((result) => {
        if (result.isConfirmed) {
          // Kirim data ke server dengan fungsi CihuyPostApi
          CihuyPostApi(UrlPostUsersAdmin, token, dataToSend)
            .then((responseText) => {
              console.log("Respon sukses:", responseText);
              // Lakukan tindakan lain setelah permintaan POST berhasil
              Swal.fire({
                icon: "success",
                title: "Sukses!",
                text: "Data berhasil ditambahkan.",
                showConfirmButton: false,
                timer: 1500,
              }).then(() => {
                // Refresh halaman setelah menutup popup
                window.location.reload();
              });
            })
            .catch((error) => {
              console.error("Terjadi kesalahan:", error);
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Terjadi kesalahan saat menambahkan data.",
              });
            });
        }
      });
    });
  }
});

const apiUrlConvert = "https://simbe-dev.ulbi.ac.id/api/v1/convert";
let dataFromApi = [];
const usernameInput = document.getElementById("username");
const usernameSuggestions = document.getElementById("username-suggestions");
//update suggestion
const usernameInputUpdate = document.getElementById("username-update");
const usernameSuggestionsUpdate = document.getElementById(
  "username-suggestions-update"
);
// Panggil fungsi CihuyDataAPI untuk mengambil data saat halaman dimuat
CihuyDataAPI(apiUrlConvert, token, (error, response) => {
  if (error) {
    console.error("Terjadi kesalahan:", error);
  } else {
    const data = response.data;
    dataFromApi = data;
  }
});

usernameInput.addEventListener("input", (e) => {
  const inputValue = e.target.value.toLowerCase();

  // Bersihkan daftar saran sebelumnya
  usernameSuggestions.innerHTML = "";

  // Filter opsi-opsi yang cocok dengan input pengguna
  const filteredOptions = dataFromApi.filter((item) =>
    item.id_rtm.toLowerCase().includes(inputValue)
  );

  // Tampilkan opsi-opsi dalam div saran
  filteredOptions.forEach((item) => {
    const suggestion = document.createElement("div");
    suggestion.textContent = item.id_rtm;
    suggestion.addEventListener("click", () => {
      // Setel nilai input saat opsi dipilih
      usernameInput.value = item.id_rtm;
      usernameSuggestions.innerHTML = ""; // Bersihkan daftar saran
    });
    usernameSuggestions.appendChild(suggestion);
  });
});

usernameInputUpdate.addEventListener("input", (e) => {
  const inputValue = e.target.value.toLowerCase();

  // Bersihkan daftar saran sebelumnya
  usernameSuggestionsUpdate.innerHTML = "";

  // Filter opsi-opsi yang cocok dengan input pengguna
  const filteredOptions = dataFromApi.filter((item) =>
    item.id_rtm.toLowerCase().includes(inputValue)
  );

  // Tampilkan opsi-opsi dalam div saran
  filteredOptions.forEach((item) => {
    const suggestion = document.createElement("div");
    suggestion.textContent = item.id_rtm;
    suggestion.addEventListener("click", () => {
      // Setel nilai input saat opsi dipilih
      usernameInputUpdate.value = item.id_rtm;
      usernameSuggestionsUpdate.innerHTML = "";
    });
    usernameSuggestionsUpdate.appendChild(suggestion);
  });
});

// Menutup daftar saran saat klik di luar input
document.addEventListener("click", (e) => {
  if (e.target !== usernameInput && e.target !== usernameSuggestions) {
    usernameSuggestions.innerHTML = "";
  }
});

function deleteAdmin(idAdmin) {
  Swal.fire({
    title: "Apakah Anda yakin ingin menghapus admin?",
    text: "Penghapusan admin akan permanen.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Ya, Hapus",
    cancelButtonText: "Tidak, Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      const apiUrlGetAdminById = `https://simbe-dev.ulbi.ac.id/api/v1/admins/get?idadmin=${idAdmin}`;

      // Lakukan permintaan GET untuk mengambil admin berdasarkan ID admin
      CihuyDataAPI(apiUrlGetAdminById, token, (error, response) => {
        if (error) {
          console.error("Terjadi kesalahan saat mengambil admin:", error);
        } else {
          const adminData = response.data;
          if (adminData) {
            // Dapatkan ID admin dari data yang diterima
            const adminId = adminData.id_admin;

            // Buat URL untuk menghapus admin berdasarkan ID admin yang telah ditemukan
            const apiUrlAdminDelete = `https://simbe-dev.ulbi.ac.id/api/v1/admins/delete?idadmin=${adminId}`;

            // Lakukan permintaan DELETE untuk menghapus admin
            CihuyDeleteAPI(
              apiUrlAdminDelete,
              token,
              (deleteError, deleteData) => {
                if (deleteError) {
                  console.error(
                    "Terjadi kesalahan saat menghapus admin:",
                    deleteError
                  );
                  Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Terjadi kesalahan saat menghapus admin!",
                  });
                } else {
                  console.log("Admin berhasil dihapus:", deleteData);
                  Swal.fire({
                    icon: "success",
                    title: "Sukses!",
                    text: "Admin berhasil dihapus.",
                    showConfirmButton: false,
                    timer: 1500,
                  }).then(() => {
                    window.location.reload();
                  });
                }
              }
            );
          } else {
            console.error("Data admin tidak ditemukan.");
          }
        }
      });
    } else {
      Swal.fire("Dibatalkan", "Penghapusan admin dibatalkan.", "info");
    }
  });
}

//fungsi print

function exportToExcel(data, filename) {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(workbook, worksheet, "AMI Data");
  XLSX.writeFile(workbook, filename);
}

// Function untuk mengekspor data ke CSV
function exportToCSV(data, filename) {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const csvURL = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = csvURL;
  link.setAttribute("download", filename + ".csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Function untuk mencetak data
function printData(data) {
  let printContent = `
    <h1>Data Standar </h1>
    <table border="1">
      <thead>
        <tr>
        <th>
        <span class="userDatatable-title">Id</span>
     </th>
     <th>
        <span class="userDatatable-title">Standar</span>
     </th>
     <th>
        <span class="userDatatable-title">Indikator</span>
     </th>
     <th>
        <span class="userDatatable-title">Isi</span>
     </th>
     <th>
        <span class="userDatatable-title">Prodi Unit</span>
     </th><th>
        <span class="userDatatable-title">Periode</span>
     </th>
  
        </tr>
      </thead>
      <tbody>
  `;

  data.forEach((item, index) => {
    printContent += `
      <tr>
        <td>${index + 1}</td>
        
        <td>
          <div class="d-flex">
              <div class="userDatatable-inline-title">
                <a href="#" class="text-dark fw-500">
                    <h6>${item.standar}</h6>
                </a>
              </div>
          </div>
        </td>
        <td>
          <div class="userDatatable-content">
          ${item.nama_indikator}
          </div>
        </td>
        <td>
          <div class="userDatatable-content" style="font-size: 12px;  white-space: pre-line;">
            ${item.isi}
          </div>
        </td>
        <td>
          <div class="userDatatable-content">
          ${item.prodi_unit}
          </div>
        </td>
        <td>
          <div class="userDatatable-content">
          ${item.tahun}
          </div>
        </td>
      </tr>
    `;
  });

  printContent += `
      </tbody>
    </table>
  `;

  const printWindow = window.open("", "_blank");
  printWindow.document.write(`
    <html>
      <head>
        <title>AMI Data - Cetak</title>
        <style>
          table {
            border-collapse: collapse;
            width: 100%;
          }
          th, td {
            border: 1px solid #dddddd;
            text-align: left;
            padding: 8px;
          }
          h1 {
            text-align: center;
          }
        </style>
      </head>
      <body>
        ${printContent}
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.print();
}

// Function untuk mendapatkan dan memproses data AMI
function processDataAndExport(exportType, filename) {
  CihuyDataAPI(UrlGetStandar, token, (error, response) => {
    if (error) {
      console.error("Terjadi kesalahan:", error);
    } else {
      const data = response.data;
      console.log("Data yang diterima:", data);

      // Panggil fungsi sesuai dengan jenis ekspor yang diinginkan
      switch (exportType) {
        case "excel":
          exportToExcel(data, filename + ".xlsx");
          break;
        case "csv":
          exportToCSV(data, filename);
          break;
        case "print":
          printData(data);
          break;
        default:
          console.error("Jenis ekspor tidak valid");
      }
    }
  });
}

// Panggil fungsi ini ketika tombol Ekspor Excel diklik
document.getElementById("exportexcel").addEventListener("click", function () {
  processDataAndExport("excel", "standar_export");
});

// Panggil fungsi ini ketika tombol Ekspor CSV diklik
document.getElementById("exportcsv").addEventListener("click", function () {
  processDataAndExport("csv", "standar_export");
});

// Panggil fungsi ini ketika tombol Cetak diklik
document.getElementById("print").addEventListener("click", function () {
  processDataAndExport("print");
});
