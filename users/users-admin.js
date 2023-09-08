import { CihuyDataAPI } from "https://c-craftjs.github.io/simpelbi/api.js";
import { CihuyGetCookie } from "https://c-craftjs.github.io/cookies/cookies.js";
import { CihuyGetHeaders } from "../js/getfunc.js";
import { CihuyNameCell } from "./element/namecell.js";
import { CihuyTableCell } from "./element/tablecell.js";
import { CihuyAppend } from "./element/append.js";

const apiUrl = "https://simbe-dev.ulbi.ac.id/api/v1/admins/";
const token = CihuyGetCookie("login");

CihuyDataAPI(apiUrl, token, (error, data) => {
  const tableBody = document.getElementById("tableBody");

  tableBody.innerHTML = "";

  if (error) {
    console.error("Ada masalah saat mengambil data:", error);
  } else {
    // Lakukan sesuatu dengan data yang Anda dapatkan
    console.log(data);
    if (Array.isArray(data.data) && data.data.length > 0) {
      data.data.forEach((item) => {
        const row = document.createElement("tr");

        // Create and populate table cells for each column
        const idCell = CihuyTableCell("userDatatable-content", item.id);
        const namaCell = CihuyNameCell("text-dark fw-500", item.nama);
        const jabatanCell = CihuyTableCell(
          "userDatatable-content",
          item.jabatan
        );
        const emailCell = CihuyTableCell("userDatatable-content", item.email);
        const nidnCell = CihuyTableCell("userDatatable-content", item.nidn);

        CihuyAppend(row, idCell, namaCell, jabatanCell, emailCell, nidnCell);
        tableBody.appendChild(row);
      });
    } else {
      const table = document.querySelector(".table");
      if (table.classList.contains("footable-empty")) {
        setTimeout(CihuyDataAPI, 1000);
      } else {
        console.error("Data is not an array:", data);
        tableBody.innerHTML = '<tr><td colspan="7">No results</td></tr>';
      }
    }
  }
});
// const tableBody = document.getElementById("tableBody"); // Menambahkan ini

// CihuyDataAPI(apiUrl, token, tableBody, (error, data) => {
//   if (error) {
//     console.error("Ada masalah saat mengambil data:", error);
//   } else {
//     // Inisialisasi AG Grid dan atur data
//     const gridOptions = {
//       columnDefs: [
//         { headerName: "Id", field: "id" },
//         { headerName: "Nama", field: "nama" },
//         { headerName: "Jabatan", field: "jabatan" },
//         { headerName: "Email", field: "email" },
//         { headerName: "NIDN", field: "nidn" },
//         { headerName: "Foto", field: "foto" },
//       ],
//       rowData: data.data,
//     };
//     new agGrid.Grid(document.querySelector("#agGridContainer"), gridOptions);
//   }
// });
