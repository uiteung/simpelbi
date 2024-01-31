import {
  CihuyDataAPI,
  CihuyPostApi,
  CihuyDeleteAPI,
  CihuyUpdateApi,
} from "https://c-craftjs.github.io/simpelbi/api.js";
import {
  token,
  UrlGetStandar,
  UrlPostStandar,
  UrlGetSiklus,
} from "../js/template/template.js";
// import { ShowdataStandar } from "../js/config/configstandar.js";
// import { CihuyPostKTS } from "../js/config/configkts.js"
import { populateUserProfile } from "https://c-craftjs.github.io/simpelbi/profile.js";

// Untuk GET Data Profile
populateUserProfile();

// Untuk Get Data dari API
export function ShowdataStandar(data) {
  const tableBody = document.getElementById("content");

  // Kosongkan isi tabel saat ini
  tableBody.innerHTML = "";
  let nomor = 1;
  function limitContent(text, limit) {
    if (text.length > limit) {
      const truncatedText = text.substring(0, limit);
      return `${truncatedText} <br> ${text.substring(limit)}`;
    }
    return text;
  }
  // Loop melalui data yang diterima dari API
  data.forEach((item) => {
    const barisBaru = document.createElement("tr");
    barisBaru.innerHTML = `<td>
        <div class="userDatatable-content">${nomor}</div>
        </td>
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
        <div class="userDatatable-content" style="font-size: 12px;  white-space: pre-line;">
        ${item.isi_indikator}
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
        <td>
          <ul class="orderDatatable_actions mb-0 d-flex flex-wrap">
              
              <li>
                <a href="#" class="edit" data-target="#new-member-update" data-standar-id="${item.id_standar}">
                    <i class="uil uil-edit"></i>
                </a>
              </li>
              <li>
                <a href="#" class="remove" data-standar-id=${item.id_standar}>
                    <i class="uil uil-trash-alt"></i>
                </a>
              </li>
          </ul>
        </td>`;
    // Untuk Remove Button
    const removeButton = barisBaru.querySelector(".remove");
    removeButton.addEventListener("click", () => {
      const id_standar = removeButton.getAttribute("data-standar-id");
      if (id_standar) {
        deleteStandar(id_standar);
      } else {
        console.error("ID Standar tidak ditemukan");
      }
    });
    // Untuk Update Button
    const editButton = barisBaru.querySelector(".edit");
    editButton.addEventListener("click", () => {
      const id_standar = editButton.getAttribute("data-standar-id");
      if (id_standar) {
        editData(id_standar);
      } else {
        console.error("ID Standar tidak ditemukan");
      }
    });
    tableBody.appendChild(barisBaru);
    nomor++;
  });
}

// Untuk GET All Data dengan menggunakan API
CihuyDataAPI(UrlGetStandar, token, (error, response) => {
  if (error) {
    console.error("Terjadi kesalahan:", error);
  } else {
    const data = response.data;
    console.log("Data yang diterima:", data);
    ShowdataStandar(data);
  }
});

// Untuk PUT Data dengan menggunakan API
function getStandarDataById(id_standar, callback) {
  const UrlGetStandarById = `https://simbe-dev.ulbi.ac.id/api/v1/standar/get?id_standar=${id_standar}`;

  CihuyDataAPI(UrlGetStandarById, token, (error, response) => {
    if (error) {
      console.error("Terjadi kesalahan saat mengambil data : ", error);
      callback(error, null);
    } else {
      const standarData = response.data;
      callback(null, standarData);
    }
  });
}
function editData(id_standar) {
  getStandarDataById(id_standar, (error, standarData) => {
    if (error) {
      console.error("Gagal mengambil data standar : ", error);
      return;
    }
    // Untuk Ambil nilai dari form
    document.getElementById("judulStandar-update").value = standarData.standar;

    document.getElementById("isiStandar-update").value = standarData.isi;

    // document.getElementById("indikator-update").value =
    //   standarData.nama_indikator;
    // document.getElementById("isi-update").value = standarData.isi;
    // document.getElementById("periode-update").value = standarData.idSiklus;

    // Menampilkan modal edit
    const modal = new bootstrap.Modal(
      document.getElementById("new-member-update")
    );
    modal.show();

    // Membuat event listener untuk button update
    const simpanPerubahanButton = document.getElementById("updateDataButton");
    simpanPerubahanButton.addEventListener("click", function () {
      // Untuk ambil nilai dari element form edit
      const standarInput = document.getElementById("judulStandar-update").value;
      const indikatorInput = document.getElementById("indikator-update").value;
      const isiInput = document.getElementById("isiStandar-update").value;
      const periodeInput = document.getElementById("periode-update").value;
      const prodiatauunitInput = document.getElementById(
        "prodiatauunit-update"
      ).value;

      // Buat const untuk nampung semuanya
      const dataStandarToUpdate = {
        standar: standarInput,
        id_indikator: parseInt(indikatorInput),
        isi: isiInput,
        id_siklus: parseInt(periodeInput),
        id_prodi_unit: parseInt(prodiatauunitInput),
      };

      // Hide modal ketika sudah selesai isi
      $("#new-member-update").modal("hide");

      // Tampilkan SweetAlet konfirmasi sebelum mengirim permintaan
      Swal.fire({
        title: "Update Standar?",
        text: "Apakah Anda yakin ingin update Standar?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Ya, Update",
        cancelButtonText: "Batal;",
      }).then((result) => {
        if (result.isConfirmed) {
          sendUpdateStandar(id_standar, dataStandarToUpdate, modal);
        }
      });
    });
  });
}
// function untuk kirim update data
function sendUpdateStandar(id_standar, dataStandarToUpdate, modal) {
  const UrlPutStandar = `https://simbe-dev.ulbi.ac.id/api/v1/standar/update?id_standar=${id_standar}`;

  CihuyUpdateApi(
    UrlPutStandar,
    token,
    dataStandarToUpdate,
    (error, responseText) => {
      if (error) {
        console.error("Terjadi kesalahan saat update data standar : ", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Terjadi kesalahan saat update data standar",
        });
      } else {
        console.log("Respon sukses :", responseText);
        // Tutup modal
        modal.hide();
        // Tampilkan Sweet Alert sukses
        Swal.fire({
          icon: "success",
          title: "Sukses!",
          text: "Data Standar berhasil diperbarui",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          window.location.reload();
        });
      }
    }
  );
}

// Untuk tampilkan dropdown siklus untuk update
function siklusupdate(data) {
  const selectElement = document.getElementById("periode-update");
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
CihuyDataAPI(UrlGetSiklus, token, (error, response) => {
  if (error) {
    console.error("Terjadi kesalahan:", error);
  } else {
    const data = response.data;
    console.log("Data yang diterima:", data);
    siklusupdate(data);
  }
});

// Untuk POST Data dengan menggunakan API
function siklusData(data) {
  const selectElement = document.getElementById("periode");
  // Kosongkan isi dropdown saat ini
  selectElement.innerHTML = "";

  // Loop data yang diterima dari API
  data.forEach((item, index) => {
    const optionElement = document.createElement("option");
    optionElement.value = index + 1;
    optionElement.textContent = `${index + 1} - Tahun ${item.tahun}`;
    selectElement.appendChild(optionElement);
  });
  selectElement.addEventListener("change", function () {
    const selectedValue = this.value;
    // Lakukan sesuatu dengan nilai yang dipilih, misalnya, tampilkan di konsol
    console.log("Nilai yang dipilih: ", selectedValue);
  });
}
// Panggil API untuk mendapatkan data siklus
CihuyDataAPI(UrlGetSiklus, token, (error, response) => {
  if (error) {
    console.error("Terjadi kesalahan:", error);
  } else {
    const data = response.data;
    console.log("Data yang diterima:", data);
    siklusData(data);
  }
});

const Tombol = document.getElementById("buttonadd");

Tombol.addEventListener("click", async function (e) {
  e.preventDefault();
  console.log("Button Clicked");

  // Untuk Ambil nilai dari elemen
  const standarInput = document.getElementById("judulStandar").value;
  const indikatorInput = document.getElementById("indikator").value;
  const isiInput = document.getElementById("isiStandar").value;
  const periodeInput = document.getElementById("periode").value;
  const prodiatauunitInput = document.getElementById("prodiatauunit").value;

  const data = {
    standar: standarInput,
    id_indikator: parseInt(indikatorInput),
    isi: isiInput,
    id_siklus: parseInt(periodeInput),
    id_prodi_unit: parseInt(prodiatauunitInput),
  };

  // Tutup modal setelah menampilkan SweetAlert
  $("#new-member").modal("hide");

  // Menampilkan pesan konfirmasi SweetAlert
  Swal.fire({
    title: "Tambahkan Standar?",
    text: "Apakah Anda yakin ingin menambahkan Standar?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Ya, Tambahkan",
    cancelButtonText: "Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      // Mengirimkan Permintaan POST Menggunakan Fungsi CihuyPostApi
      CihuyPostApi(UrlPostStandar, token, data)
        .then((responseText) => {
          console.log("Respon sukses:", responseText);
          // Tutup modal setelah menampilkan SweetAlert
          $("#new-member").modal("hide");
          // Lakukan tindakan lain setelah permintaan POST berhasil
          Swal.fire({
            icon: "success",
            title: "Sukses!",
            text: "Standar berhasil ditambahkan",
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            // Reload halaman
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
function populateIndikatorDropdown() {
  const indikatorDropdown = $("#indikator");

  // Fetch data from the API
  CihuyDataAPI(
    "https://simbe-dev.ulbi.ac.id/api/v1/indikator/",
    token,
    (error, response) => {
      if (error) {
        console.error(
          "Terjadi kesalahan saat mengambil data indikator:",
          error
        );
      } else {
        const indikatorData = response.data;
        indikatorDropdown.append(
          new Option("--Pilih Indikator--", "", true, true)
        );
        indikatorData.forEach((indikator) => {
          indikatorDropdown.append(
            new Option(indikator.isi, indikator.id_indikator)
          );
        });
        indikatorDropdown.select2({
          width: "100%",
          minimumResultsForSearch: Infinity, // Menonaktifkan pencarian
          disabled: false, // Sesuaikan dengan kebutuhan
        });
      }
    }
  );
}

populateIndikatorDropdown();

function populateIndikatorupdateDropdown() {
  const indikatorDropdown = $("#indikator-update");

  // Fetch data from the API
  CihuyDataAPI(
    "https://simbe-dev.ulbi.ac.id/api/v1/indikator/",
    token,
    (error, response) => {
      if (error) {
        console.error(
          "Terjadi kesalahan saat mengambil data indikator:",
          error
        );
      } else {
        const indikatorData = response.data;
        indikatorDropdown.append(
          new Option("--Pilih Indikator--", "", true, true)
        );
        indikatorData.forEach((indikator) => {
          indikatorDropdown.append(
            new Option(indikator.isi, indikator.id_indikator)
          );
        });
        indikatorDropdown.select2({
          width: "100%",
          minimumResultsForSearch: Infinity, // Menonaktifkan pencarian
          disabled: false, // Sesuaikan dengan kebutuhan
        });
      }
    }
  );
}
populateIndikatorupdateDropdown();

// Call this function to populate the dropdown when the page loads

// Call this function to populate the dropdown when the page loads

function populateprodiDropdown() {
  const prodiDropdown = $("#prodiatauunit");

  // Fetch data from the API
  CihuyDataAPI(
    "https://simbe-dev.ulbi.ac.id/api/v1/prodi/",
    token,
    (error, response) => {
      if (error) {
        console.error("Terjadi kesalahan saat mengambil data prodi:", error);
      } else {
        const prodiData = response.data;
        prodiDropdown.append(
          new Option("--Pilih Prodi Atau Unit--", "", true, true)
        );
        prodiData.forEach((indikator) => {
          prodiDropdown.append(
            new Option(indikator.prodi_unit, indikator.id_prodi)
          );
        });
        prodiDropdown.select2({
          width: "100%",
          minimumResultsForSearch: Infinity, // Menonaktifkan pencarian
          disabled: false, // Sesuaikan dengan kebutuhan
        });
      }
    }
  );
}

// Call this function to populate the dropdown when the page loads
populateprodiDropdown();

function populateprodiupdateDropdown() {
  const prodiDropdown = $("#prodiatauunit-update");

  // Fetch data from the API
  CihuyDataAPI(
    "https://simbe-dev.ulbi.ac.id/api/v1/prodi/",
    token,
    (error, response) => {
      if (error) {
        console.error("Terjadi kesalahan saat mengambil data prodi:", error);
      } else {
        const prodiData = response.data;
        prodiDropdown.append(
          new Option("--Pilih Prodi Atau Unit--", "", true, true)
        );
        prodiData.forEach((indikator) => {
          prodiDropdown.append(
            new Option(indikator.prodi_unit, indikator.id_prodi)
          );
        });
        prodiDropdown.select2({
          width: "100%",
          minimumResultsForSearch: Infinity, // Menonaktifkan pencarian
          disabled: false, // Sesuaikan dengan kebutuhan
        });
      }
    }
  );
}

// Call this function to populate the dropdown when the page loads
populateprodiupdateDropdown();

// Untuk DELETE Data Standar
function deleteStandar(id_standar) {
  // Buat URL untuk mengambil data standar berdasarkan id
  const UrlGetStandarById = `https://simbe-dev.ulbi.ac.id/api/v1/standar/get?id_standar=${id_standar}`;

  // Lakukan permintaan GET untuk mengambil standar berdasarkan id
  CihuyDataAPI(UrlGetStandarById, token, (error, response) => {
    if (error) {
      console.error("Terjadi kesalahan saat mengambil standar: ", error);
    } else {
      const standarData = response.data;
      if (standarData) {
        // Dapatkan id admin dari data yang diterima
        const id_standar = standarData.id_standar;
        const UrlDeleteStandar = `https://simbe-dev.ulbi.ac.id/api/v1/standar/delete?id_standar=${id_standar}`;

        // Menampilkan pesan konfirmasi SweetAlert
        Swal.fire({
          title: "Hapus Standar?",
          text: "Apakah Anda yakin ingin menghapus Standar?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Ya, Hapuskan",
          cancelButtonText: "Batal",
        }).then((result) => {
          if (result.isConfirmed) {
            // Lakukan permintaan DELETE
            CihuyDeleteAPI(
              UrlDeleteStandar,
              token,
              (deleteError, deleteData) => {
                if (deleteError) {
                  console.error(
                    "Terjadi kesalahan saat menghapus Standar:",
                    deleteError
                  );
                  Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Terjadi kesalahan saat menghapus Standar!",
                  });
                } else {
                  console.log("Standar berhasil dihapus:", deleteData);
                  Swal.fire({
                    icon: "success",
                    title: "Sukses!",
                    text: "Standar berhasil dihapus",
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
        console.error("Data Standar tidak ditemukan.");
      }
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
