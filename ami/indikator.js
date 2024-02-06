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

const apiUrl = "https://simbe-dev.ulbi.ac.id/api/v1/indikator";
const token = CihuyGetCookie("login");
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
      <td>${item.nama_indikator}</td>
      <td>
      <div class="userDatatable-content" style="font-size: 12px;  white-space: pre-line;">
        ${item.isi}
      </div>
    </td>
  
      <td>
        <ul class="orderDatatable_actions mb-0 d-flex flex-wrap">
          
          <li>
          <a href="#" class="edit" data-target="#new-member-update" data-files-id="${item.id_indikator}">
          <i class="uil uil-edit"></i>
            </a>
          </li>
          <li>
          <a href="#" class="remove" data-files-id="${item.id_indikator}">
          <i class="uil uil-trash-alt"></i>
            </a>
          </li>
        </ul>
      </td>
    `;
    const removeButton = barisBaru.querySelector(".remove");
    removeButton.addEventListener("click", () => {
      const id_indikator = removeButton.getAttribute("data-files-id");
      if (id_indikator) {
        deleteFile(id_indikator);
      } else {
        console.error("id hasil survei untuk Dokumen SPMI tidak ditemukan.");
      }
    });
    const editButton = barisBaru.querySelector(".edit");
    editButton.addEventListener("click", () => {
      const id_indikator = editButton.getAttribute("data-files-id");
      if (id_indikator) {
        editData(id_indikator);
      } else {
        console.error("id hasil survei untuk Dokumen SPMI tidak ditemukan.");
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
    // ShowDataUsersDokumen SPMI(data);
    createPaginationControls(data);
    displayPageData(data, currentPage); // siklusdata(data);
  }
});
function editData(id_indikator) {
  // Gunakan CihuyDataAPI untuk mengambil data dari server
  CihuyDataAPI(
    apiUrl + `?id_indikator=${id_indikator}`,
    token,
    (error, response) => {
      if (error) {
        console.error("Terjadi kesalahan:", error);
      } else {
        const data = response.data;
        console.log("Data yang diterima:", data);
        const fileData = data.find(
          (item) => item.id_indikator === parseInt(id_indikator)
        );
        document.getElementById("namaindikator-update").value =
          fileData.nama_indikator;
        document.getElementById("isiindikator-update").value = fileData.isi;

        // Set nilai idFileToUpdate dengan idFile yang ingin diupdate
        idFileToUpdate = fileData.id_indikator;

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
const namaindikatorInput = document.getElementById("namaindikator-update");
const isiindikatorInput = document.getElementById("isiindikator-update");

const updateDataButton = document.getElementById("updateDataButton");

// Event listener untuk tombol "Update Data"
updateDataButton.addEventListener("click", function () {
  // Ambil data dari input form
  const judulindikator = namaindikatorInput.value;
  const isi = isiindikatorInput.value;

  // Tutup modal jika diperlukan
  $("#new-member-update").modal("hide");

  // Tampilkan SweetAlert konfirmasi dengan judul, teks, dan ikon yang berbeda
  Swal.fire({
    title: "Update Files pada Dokumen SPMI?",
    text: "Apakah Anda yakin ingin update Files untuk Dokumen SPMI?", // Teks yang berbeda
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Ya, Update",
    cancelButtonText: "Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      // Buat objek data yang akan dikirim ke API sesuai dengan format JSON yang diberikan
      const dataToUpdate = {
        nama_indikator: judulindikator,

        isi: isi,
      };

      CihuyUpdateApi(
        apiUrl + `/update?id_indikator=${idFileToUpdate}`, // Anda mungkin perlu menyesuaikan URL ini
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
  });
});

function deleteFile(id_indikator) {
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
      const apiUrlGetfileById = `https://simbe-dev.ulbi.ac.id/api/v1/indikator/get?id_indikator=${id_indikator}`;

      // Lakukan permintaan GET untuk mengambil files berdasarkan id hasil survei
      CihuyDataAPI(apiUrlGetfileById, token, (error, response) => {
        if (error) {
          console.error("Terjadi kesalahan saat mengambil files:", error);
        } else {
          const fileData = response.data;
          if (fileData) {
            // Dapatkan id hasil survei dari data yang diterima
            const FileIDtoDelete = fileData.id_indikator;

            // Buat URL untuk menghapus files berdasarkan ID files yang telah ditemukan
            const apiUrlfilesDelete = `https://simbe-dev.ulbi.ac.id/api/v1/indikator/delete?id_indikator=${FileIDtoDelete}`;

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

const apiPostFiles = "https://simbe-dev.ulbi.ac.id/api/v1/indikator/add";

const namaindikator = document.getElementById("namaindikator");
const isiindikator = document.getElementById("isiindikator");

document
  .getElementById("tambahDataButton")
  .addEventListener("click", async function () {
    // Mendapatkan nilai dari elemen formulir
    const indikator = namaindikator.value;
    const isi = isiindikator.value;
    // Mengecek apakah semua field telah diisi
    if (!indikator || !isi) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Harap isi semua bidang formulir!",
      });
      return;
    }

    // Tutup modal sebelum menampilkan SweetAlert konfirmasi
    $("#new-member").modal("hide");

    // Menampilkan SweetAlert konfirmasi
    Swal.fire({
      title: "Tambahkan File untuk Indikator SPMI?",
      text: "Apakah Anda yakin ingin menambahkan File untuk Indikator SPMI?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Tambahkan",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        // Membuat objek data yang akan dikirim ke server
        const data = {
          indikator: indikator,

          isi: isi,
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
            // Reset form jika diperlukan

            // Reload halaman setelah menampilkan SweetAlert berhasil
            window.location.reload();
          });
        } catch (error) {
          settingsmenu / kepuasantendik.js;
          console.error("Terjadi kesalahan:", error);
          console.log("Data yang dikirimkan:", data);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Terjadi kesalahan saat menyimpan data.",
          });
          // Handle kesalahan jika terjadi
        }
      }
    });
  });
const urlIndikator = `https://simbe-dev.ulbi.ac.id/api/v1/indikator`;
// Panggil API untuk mendapatkan data siklus
CihuyDataAPI(urlget, token, (error, response) => {
  if (error) {
    console.error("Terjadi kesalahan:", error);
  } else {
    const data = response.data;
    console.log("Data yang diterima:", data);
    siklusdata(data);
  }
});

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
