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
    barisBaru.innerHTML = `
    
        <td class="align-top" style="white-space: pre-line;">
        <div class="userDatatable-content" style="font-size: 12px;">${nomor}</div>
        </td>
        <td class="align-top">
        <div class="userDatatable-content align-top" style="white-space: pre-line; font-size: 12px;">
                ${item.standar}
              </div>
        </td>
        <td  class="align-top">
          <div class="userDatatable-content" style="font-size: 12px;  white-space: pre-line;">
            ${item.isi}
          </div>
        </td>
        <td class="align-top">
        <div class="userDatatable-content" style="font-size: 12px;  white-space: pre-line;">
        ${item.isi_indikator}
          </div>
        </td>
        <td class="align-top">
          <div class="userDatatable-content" style="font-size: 12px; white-space: pre-line; width: 3rem;">
          ${item.prodi_unit}
          </div>
        </td>
        <td   class="align-top">
          <div class="userDatatable-content" style="font-size: 12px; white-space: pre-line; width: 2rem;">
          ${item.tahun}
          </div>
        </td>
        <td class="align-top">
          <ul class="orderDatatable_actions mb-0 d-flex flex-wrap mt-2">    
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
    // const editButton = barisBaru.querySelector(".edit");
    // editButton.addEventListener("click", () => {
    //   const id_standar = editButton.getAttribute("data-standar-id");
    //   if (id_standar) {
    //     editData(id_standar);
    //   } else {
    //     console.error("ID Standar tidak ditemukan");
    //   }
    // });
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

function customizeData(data) {
  return data.map((item) => ({
    // Hanya tambahkan kolom yang diperlukan dan ubah nama kolom
    Nomor: item.id_standar,
    "Nama Standar": item.standar,
    "Pernyataan Standar": item.isi,
    Indikator: item.isi_indikator,
    Role: item.prodi_unit,
    Periode: item.tahun,
  }));
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
          exportToExcel(customizeData(data), filename + ".xlsx");
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

// Event listener untuk Export
document.getElementById("exportexcel").addEventListener("click", function () {
  processDataAndExport("excel", "standar_export");
});

// document.getElementById("exportcsv").addEventListener("click", function () {
//   processDataAndExport("csv", "standar_export");
// });

// document.getElementById("print").addEventListener("click", function () {
//   processDataAndExport("print");
// });

// Event listener untuk Import
document
  .getElementById("import-excel")
  .addEventListener("change", async function (event) {
    const file = event.target.files[0];

    if (!file) {
      Swal.fire({
        icon: "info",
        title: "Info!",
        text: "Please select a file.",
      });
      return;
    }

    // Buat FormData untuk mengirim file ke server
    const formData = new FormData();
    formData.append("file", file); // Ganti "file" jika server mengharapkan nama parameter berbeda

    // console.log(file);
    // for (const pair of formData.entries()) {
    //   console.log(`${pair[0]}:`, pair[1]);
    // }

    try {
      const response = await fetch(
        "https://simbe-dev.ulbi.ac.id/api/v1/standar/insert/import",
        {
          method: "POST",
          headers: {
            login: token, // Pastikan token benar
          },
          body: formData, // Jangan gunakan JSON.stringify
        }
      );

      if (!response.ok) {
        const errorText = await response.text(); // Ambil pesan error dari server
        throw new Error(
          `HTTP error! Status: ${response.status}, Message: ${errorText}`
        );
      }
      const result = await response.json();

      Swal.fire({
        icon: "success",
        title: "Sukses!",
        text: `${result.message}`,
        showConfirmButton: false,
        timer: 2500,
      });
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Gagal mengunggah file. Error: ${error.message}`,
      });
    }
  });
