import {
  CihuyDataAPI,
  CihuyPostApi,
  CihuyDeleteAPI,
  CihuyUpdateApi,
} from "https://c-craftjs.github.io/simpelbi/api.js";
import { token, UrlGetUsersrtm } from "../js/template/template.js";
// import { addFormrtm } from "./rtm/add.js";
import { populateUserProfile } from "https://c-craftjs.github.io/simpelbi/profile.js";
import { CihuyPaginations2 } from "https://c-craftjs.github.io/simpelbi/pagenations.js";

// Untuk GET Data Profile
populateUserProfile();

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
                <h6>${item.id_rtm}</h6>
             </a>
          </div>
       </div>
    </td>
    <td>
       <div class="userDatatable-content">
          ${item.user_level}
       </div>
    </td>
  
   
       <ul class="orderDatatable_actions mb-0 d-flex flex-wrap">

          <li>
             <a href="#" class="edit" data-target="#new-member-update" data-rtm-id="${item.id_rtm}">
                <i class="uil uil-edit"></i>
             </a>
          </li>
          <li>
            <a href="#" class="remove" data-rtm-id="${item.id_rtm}">
               <i class="uil uil-trash-alt"></i>
            </a>
          </li>
       </ul>
    </td>
    `;

    const removeButton = barisBaru.querySelector(".remove");
    removeButton.addEventListener("click", () => {
      const id_rtm = removeButton.getAttribute("data-rtm-id");
      if (id_rtm) {
        deletertm(id_rtm);
      } else {
        console.error("ID rtm tidak ditemukan.");
      }
    });
    const editButton = barisBaru.querySelector(".edit");
    editButton.addEventListener("click", () => {
      const id_rtm = editButton.getAttribute("data-rtm-id");
      if (id_rtm) {
        editData(id_rtm);
      } else {
        console.error("ID rtm tidak ditemukan.");
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
// Untuk Get Data dari API
CihuyDataAPI(UrlGetUsersrtm, token, (error, response) => {
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

// Handle form submission when the "Tambah Data rtm" button is clicked
const tambahDatartmButton = document.getElementById("tambahDatartmButton");
tambahDatartmButton.addEventListener("click", function (e) {
  e.preventDefault();

  // Get data from form elements
  const rtm = document.getElementById("idrtm").value;
  const user_level = document.getElementById("userlevel").value;

  const data = {
    id_rtm: rtm,
    user_level: parseInt(user_level),
  };

  $("#new-member").modal("hide");

  // Show a confirmation SweetAlert
  Swal.fire({
    title: "Tambahkan Data rtm?",
    text: "Apakah Anda yakin ingin menambahkan data rtm ini?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Ya, Tambahkan",
    cancelButtonText: "Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      // Send the rtm data to the server using the sendrtmData function
      sendrtmData(data, UrlpostUsersrtm, token);
    }
  });
});

const UrlpostUsersrtm = "https://simbe-dev.ulbi.ac.id/api/v1/convert/add";
// Fungsi untuk mengirim permintaan POST dengan data rtm
function sendrtmData(data, UrlpostUsersrtm, token) {
  CihuyPostApi(UrlpostUsersrtm, token, data)
    .then((responseText) => {
      console.log("Respon sukses:", responseText);
      // Menampilkan pesan sukses
      Swal.fire({
        icon: "success",
        title: "Sukses!",
        text: "Data rtm berhasil ditambahkan.",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        // Refresh halaman atau lakukan tindakan lain jika diperlukan
        window.location.reload();
      });
    })
    .catch((error) => {
      console.error("Terjadi kesalahan:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Terjadi kesalahan saat menambahkan data rtm.",
      });
    });
}

// fungsi edit

function getrtmDataById(id_rtm, callback) {
  const getrtmDataById = `https://simbe-dev.ulbi.ac.id/api/v1/convert/get?id_rtm=${id_rtm}`;

  CihuyDataAPI(getrtmDataById, token, (error, response) => {
    if (error) {
      console.error("Terjadi kesalahan saat mengambil rtm:", error);
      callback(error, null);
    } else {
      const rtmData = response.data;
      callback(null, rtmData);
    }
  });
}

// fungsi edit
// Fungsi untuk mengisi dropdown "rtm di form Update"

function populateuserLevelDropdownupdate() {
  const userLevelDropdown = document.getElementById("userlevel-update");

  // Fetch data from the API
  CihuyDataAPI(
    "https://simbe-dev.ulbi.ac.id/api/v1/userlevel/",
    token,
    (error, response) => {
      if (error) {
        console.error(
          "Terjadi kesalahan saat mengambil data userLevel:",
          error
        );
      } else {
        const userLevelData = response.data;

        // Clear existing options
        userLevelDropdown.innerHTML = "";

        // Add a default option
        const defaultOption = document.createElement("option");
        defaultOption.disabled = true;
        defaultOption.textContent = "--Pilih User Level--";
        userLevelDropdown.appendChild(defaultOption);

        // Populate the dropdown with data from the API
        userLevelData.forEach((userLevel) => {
          const option = document.createElement("option");
          option.value = userLevel.id_user_level; // You may need to adjust this based on the actual structure of your userLevel data

          option.textContent = userLevel.nama_level;

          userLevelDropdown.appendChild(option);
        });
      }
    }
  );
}
populateuserLevelDropdownupdate();
// function editData(id_rtm) {
//   getrtmDataById(id_rtm, (error, rtmData) => {
//     if (error) {
//       console.error("Gagal mengambil data rtm:", error);
//       return;
//     }

//     document.getElementById("idrtm-update").value = rtmData.id_rtm;
//     document.getElementById("userlevel-update").value = rtmData.id_user_level;

//     // Mengatur nilai input rtm dalam formulir
//     // Menampilkan modal edit
//     const modal = new bootstrap.Modal(
//       document.getElementById("new-member-update")
//     );
//     modal.show();

//     // Mengatur event listener untuk tombol "Simpan Perubahan"
//     const simpanPerubahanButton = document.getElementById("updateDataButton");
//     simpanPerubahanButton.addEventListener("click", function () {
//       const rtmUpdate = document.getElementById("idrtm-update").value;
//       const userlevelUpdate = document.getElementById("userlevel-update").value;
//       // Data to be updated
//       const datartmToUpdate = {
//         id_rtm: rtmUpdate,
//         user_level: parseInt(userlevelUpdate),
//       };

//       // Tampilkan SweetAlert konfirmasi sebelum mengirim permintaan
//       Swal.fire({
//         title: "Update Data rtm?",
//         text: "Apakah Anda yakin ingin mengupdate data rtm ini?",
//         icon: "question",
//         showCancelButton: true,
//         confirmButtonText: "Ya, Update",
//         cancelButtonText: "Batal",
//       }).then((result) => {
//         if (result.isConfirmed) {
//           // Kirim permintaan PUT/UPDATE ke server
//           sendUpdateRequest(id_rtm, datartmToUpdate, modal);
//         }
//       });
//     });

//     // Fungsi untuk mengirim permintaan PUT/UPDATE
//     function sendUpdateRequest(id_rtm, datartmToUpdate, modal) {
//       const apiUrlrtmUpdate = `https://simbe-dev.ulbi.ac.id/api/v1/convert/update?id_rtm=${id_rtm}`;

//       CihuyUpdateApi(
//         apiUrlrtmUpdate,
//         token,
//         datartmToUpdate,
//         (error, responseText) => {
//           if (error) {
//             console.error("Terjadi kesalahan saat mengupdate data rtm:", error);
//             // Menampilkan pesan kesalahan
//             Swal.fire({
//               icon: "error",
//               title: "Oops...",
//               text: "Terjadi kesalahan saat mengupdate data rtm.",
//             });
//           } else {
//             console.log("Respon sukses:", responseText);
//             // Menutup modal edit
//             modal.hide();
//             // Menampilkan pesan sukses
//             Swal.fire({
//               icon: "success",
//               title: "Sukses!",
//               text: "Data rtm berhasil diperbarui.",
//               showConfirmButton: false,
//               timer: 1500,
//             }).then(() => {
//               // Refresh halaman atau lakukan tindakan lain jika diperlukan
//               // window.location.reload();
//             });
//           }
//         }
//       );
//     }
//   });
// }

function editData(id_rtm) {
  getrtmDataById(id_rtm, (error, rtmData) => {
    if (error) {
      console.error("Gagal mengambil data rtm : ", error);
      return;
    }

    // Set nilai dari form
    document.getElementById("idrtm-update").value = rtmData.id_rtm;
    document.getElementById("userlevel-update").value = rtmData.id_user_level;

    // Menampilkan modal edit
    const modal = new bootstrap.Modal(
      document.getElementById("new-member-update")
    );
    modal.show();

    // Menambahkan event listener untuk tombol update
    const updateDataButton = document.getElementById("updateDataButton");
    updateDataButton.addEventListener("click", function () {
      const rtmUpdate = document.getElementById("idrtm-update").value;
      const userlevelUpdate = document.getElementById("userlevel-update").value;

      const datartmToUpdate = {
        id_rtm: rtmUpdate,
        user_level: parseInt(userlevelUpdate),
      };

      // Sembunyikan modal setelah isi form selesai
      $("#new-member-update").modal("hide");

      // Tampilkan konfirmasi perubahan data dengan SweetAlert
      Swal.fire({
        title: "Update rtm?",
        text: "Apakah Anda yakin ingin update rtm?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Ya, Update",
        cancelButtonText: "Batal",
      }).then((result) => {
        if (result.isConfirmed) {
          sendUpdateRTM(id_rtm, datartmToUpdate, modal);
        }
      });
    });
  });
}

// Fungsi untuk mengirimkan permintaan update
function sendUpdateRTM(id_rtm, datartmToUpdate, modal) {
  const UrlPutrtm = `https://simbe-dev.ulbi.ac.id/api/v1/convert/update?id_rtm=${id_rtm}`;

  CihuyUpdateApi(UrlPutrtm, token, datartmToUpdate, (error, responseText) => {
    if (error) {
      console.error("Terjadi kesalahan saat update data rtm : ", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Terjadi kesalahan saat update data rtm",
      });
    } else {
      console.log("Respon sukses : ", responseText);
      // Tutup modal setelah selesai update
      modal.hide();
      // Tampilkan SweetAlert sukses
      Swal.fire({
        icon: "success",
        title: "Sukses!",
        text: "Data rtm berhasil diperbarui",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        window.location.reload();
      });
    }
  });
}

// function editData(id_rtm) {
//   getrtmDataById(id_rtm, (error, rtmData) => {
//     if (error) {
//       console.error("Gagal mengambil data AMI : ", error);
//       return;
//     }
//     document.getElementById("idrtm-update").value = rtmData.id_rtm;
//     document.getElementById("userlevel-update").value = rtmData.id_user_level;

//     const modal = new bootstrap.Modal(
//       document.getElementById("new-member-update")
//     );
//     modal.show();

//     const simpanPerubahanButton = document.getElementById("updateDataButton");
//     simpanPerubahanButton.addEventListener("click", function () {
//       const rtmUpdate = document.getElementById("idrtm-update").value;
//       const userlevelUpdate = document.getElementById("userlevel-update").value;

//       const datartmToUpdate = {
//         id_rtm: rtmUpdate,
//         user_level: parseInt(userlevelUpdate),
//       };

//       $("#new-member-update").modal("hide");

//       Swal.fire({
//         title: "Update Proses AMI?",
//         text: "Apakah Anda yakin ingin update Proses AMI?",
//         icon: "question",
//         showCancelButton: true,
//         confirmButtonText: "Ya, Update",
//         cancelButtonText: "Batalkan",
//       }).then((result) => {
//         if (result.isConfirmed) {
//           CihuyUpdateApi(
//             UrlPutRtm,
//             token,
//             datartmToUpdate,
//             (error, responseText) => {
//               if (error) {
//                 console.error(
//                   "Terjadi kesalahan saat update data RTM : ",
//                   error
//                 );
//                 Swal.fire({
//                   icon: "error",
//                   title: "Oops...",
//                   text: "Terjadi kesalahan saat update data RTM",
//                 });
//               } else {
//                 console.log("Respon sukses :", responseText);
//                 modal.hide();
//                 Swal.fire({
//                   icon: "success",
//                   title: "Sukses!",
//                   text: "Data Proses RTM berhasil diperbarui",
//                   showConfirmButton: false,
//                   timer: 1500,
//                 }).then(() => {
//                   window.location.reload();
//                 });
//               }
//             }
//           );
//         }
//       });
//     });
//   });
// }

// // function untuk kirim update data
// function sendUpdateAmi(id_rtm, datartmToUpdate, modal) {
//   const UrlPutRtm = `https://simbe-dev.ulbi.ac.id/api/v1/convert/update?id_rtm=${id_rtm}`;

//   CihuyUpdateApi(UrlPutRtm, token, datartmToUpdate, (error, responseText) => {
//     if (error) {
//       console.error("Terjadi kesalahan saat update data RTM : ", error);
//       Swal.fire({
//         icon: "error",
//         title: "Oops...",
//         text: "Terjadi kesalahan saat update data RTM",
//       });
//     } else {
//       console.log("Respon sukses :", responseText);
//       // Tutup modal
//       modal.hide();
//       // Tampilkan Sweet Alert sukses
//       Swal.fire({
//         icon: "success",
//         title: "Sukses!",
//         text: "Data Proses RTM berhasil diperbarui",
//         showConfirmButton: false,
//         timer: 1500,
//       }).then(() => {
//         window.location.reload();
//       });
//     }
//   });
// }

function populateuserLevelDropdown() {
  const userLevelDropdown = document.getElementById("userlevel");

  // Fetch data from the API
  CihuyDataAPI(
    "https://simbe-dev.ulbi.ac.id/api/v1/userlevel/",
    token,
    (error, response) => {
      if (error) {
        console.error(
          "Terjadi kesalahan saat mengambil data userLevel:",
          error
        );
      } else {
        const userLevelData = response.data;

        // Clear existing options
        userLevelDropdown.innerHTML = "";

        // Add a default option
        const defaultOption = document.createElement("option");
        defaultOption.disabled = true;
        defaultOption.textContent = "--Pilih User Level--";
        userLevelDropdown.appendChild(defaultOption);

        // Populate the dropdown with data from the API
        userLevelData.forEach((userLevel) => {
          const option = document.createElement("option");
          option.value = userLevel.id_user_level; // You may need to adjust this based on the actual structure of your userLevel data

          option.textContent = userLevel.nama_level;

          userLevelDropdown.appendChild(option);
        });
      }
    }
  );
}
populateuserLevelDropdown();
// Untuk Get Data dari API
CihuyDataAPI(UrlGetUsersrtm, token, (error, response) => {
  if (error) {
    console.error("Terjadi kesalahan:", error);
  } else {
    const data = response.data;
    console.log("Data yang diterima:", data);
    // ShowDataUsersrtm(data);
    // CihuyPagination(data, itemsPerPage, "content", dataProsesAudit);
  }
});

function deletertm(id_rtm) {
  // Tampilkan dialog konfirmasi menggunakan SweetAlert2
  Swal.fire({
    title: "Apakah Anda yakin ingin menghapus rtm?",
    text: "Penghapusan rtm akan permanen.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Ya, Hapus",
    cancelButtonText: "Tidak, Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      // Buat URL untuk mengambil rtm berdasarkan ID
      const apiUrlGetrtmById = `https://simbe-dev.ulbi.ac.id/api/v1/convert/get?id_rtm=${id_rtm}`;

      // Lakukan permintaan GET untuk mengambil rtm berdasarkan ID rtm
      CihuyDataAPI(apiUrlGetrtmById, token, (error, response) => {
        if (error) {
          console.error("Terjadi kesalahan saat mengambil rtm:", error);
        } else {
          const rtmData = response.data;
          if (rtmData) {
            // Dapatkan ID rtm dari data yang diterima
            const rtmId = rtmData.id_rtm;

            // Buat URL untuk menghapus rtm berdasarkan ID rtm yang telah ditemukan
            const apiUrlrtmDelete = `https://simbe-dev.ulbi.ac.id/api/v1/convert/delete?id_rtm=${rtmId}`;

            // Lakukan permintaan DELETE untuk menghapus rtm
            CihuyDeleteAPI(
              apiUrlrtmDelete,
              token,
              (deleteError, deleteData) => {
                if (deleteError) {
                  console.error(
                    "Terjadi kesalahan saat menghapus rtm:",
                    deleteError
                  );
                  Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Terjadi kesalahan saat menghapus rtm!",
                  });
                } else {
                  console.log("rtm berhasil dihapus:", deleteData);
                  Swal.fire({
                    icon: "success",
                    title: "Sukses!",
                    text: "rtm berhasil dihapus.",
                  }).then(() => {
                    // Refresh halaman setelah menutup popup
                    window.location.reload();
                  });
                }
              }
            );
          } else {
            console.error("Data rtm tidak ditemukan.");
          }
        }
      });
    } else {
      // Tampilkan pesan bahwa penghapusan dibatalkan
      Swal.fire("Dibatalkan", "Penghapusan rtm dibatalkan.", "info");
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
    <h1>Data Users Convert </h1>
    <table border="1">
      <thead>
        <tr>
        <th>
                                          <span class="userDatatable-title">No</span>
                                       </th>
                                       <th>
                                          <span class="userDatatable-title">ID SIAP</span>
                                       </th>
                                       <th>
                                          <span class="userDatatable-title">User Level</span>
                                       </th>
                                       
                                       <th>
                                          <span class="userDatatable-title float-end">action</span>
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
                <h6>${item.id_rtm}</h6>
             </a>
          </div>
       </div>
    </td>
    <td>
       <div class="userDatatable-content">
          ${item.user_level}
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
        <title>Users Admin Data - Cetak</title>
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
  CihuyDataAPI(UrlGetUsersAdmin, token, (error, response) => {
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
  processDataAndExport("excel", "adminUsers_Export");
});

// Panggil fungsi ini ketika tombol Ekspor CSV diklik
document.getElementById("exportcsv").addEventListener("click", function () {
  processDataAndExport("csv", "adminUsers_Export");
});

// Panggil fungsi ini ketika tombol Cetak diklik
document.getElementById("print").addEventListener("click", function () {
  processDataAndExport("print");
});
