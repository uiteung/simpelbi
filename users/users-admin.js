import { CihuyGet } from "https://c-craftjs.github.io/api/api.js";
import { CihuyGetCookie } from "https://c-craftjs.github.io/cookies/cookies.js";
import { CihuyGetHeaders } from "../js/getfunc.js";
import { CihuyNameCell } from "./element/namecell.js";
import { CihuyTableCell } from "./element/tablecell.js";
import { CihuyAppend } from "./element/append.js";

const apiUrl = "https://simbe-dev.ulbi.ac.id/api/v1/admins/";
const token = CihuyGetCookie("login");

function populateTable() {
  const tableBody = document.querySelector(".table tbody");

  // Clear any existing rows in the table body
  tableBody.innerHTML = "";

  CihuyGetHeaders(apiUrl, token)
    .then((response) => response.data) // Access the 'data' property of the response
    .then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        data.forEach((item) => {
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
          setTimeout(populateTable, 1000);
        } else {
          console.error("Data is not an array:", data);
          tableBody.innerHTML = '<tr><td colspan="7">No results</td></tr>';
        }
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      tableBody.innerHTML = '<tr><td colspan="5">Error loading data</td></tr>';
      setTimeout(populateTable, 1000);
    });
}

populateTable();
