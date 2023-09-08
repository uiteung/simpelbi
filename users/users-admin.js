import { CihuyGet } from "https://c-craftjs.github.io/api/api.js";
import { CihuyGetCookie } from "https://c-craftjs.github.io/cookies/cookies.js";
import { CihuyGetHeaders } from "../js/getfunc.js";
// import { createTableCell, createNameCell } from "../users/element.js";
const apiUrl = "https://simbe-dev.ulbi.ac.id/api/v1/admins/";
const token = CihuyGetCookie("login");
function populateTable() {
  CihuyGetHeaders(apiUrl, token)
    .then((response) => response.data) // Access the 'data' property of the response
    .then((data) => {
      const tableBody = document.querySelector(".table tbody");

      // Clear any existing rows in the table body
      tableBody.innerHTML = "";

      // Check if data is an array before iterating
      if (Array.isArray(data)) {
        data.forEach((item) => {
          const row = document.createElement("tr");

          // Create and populate table cells for each column
          const idCell = createTableCell("userDatatable-content", item.id);
          const namaCell = createNameCell("text-dark fw-500", item.nama);
          const jabatanCell = createTableCell(
            "userDatatable-content",
            item.jabatan
          );
          const emailCell = createTableCell(
            "userDatatable-content",
            item.email
          );
          const nidnCell = createTableCell("userDatatable-content", item.nidn);

          if (tableBody.children.length % 2 === 0) {
            row.classList.add("even-row"); // Add a custom CSS class for even rows
          } else {
            row.classList.add("odd-row");
          }

          // Append the cells to the row
          row.appendChild(idCell);
          row.appendChild(namaCell);
          row.appendChild(jabatanCell);
          row.appendChild(emailCell);
          row.appendChild(nidnCell);

          // Append the row to the table body
          tableBody.appendChild(row);
        });
      } else {
        console.error("Data is not an array:", data);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// Function to create a generic table cell
function createTableCell(className, textContent) {
  const cell = document.createElement("td");
  const div = document.createElement("div");
  div.className = className;
  div.textContent = textContent;
  cell.appendChild(div);
  return cell;
}

// Function to create a name cell with a link
function createNameCell(className, name) {
  const cell = document.createElement("td");
  const div = document.createElement("div");
  div.className = "d-flex";
  const titleDiv = document.createElement("div");
  titleDiv.className = "userDatatable-inline-title";
  const link = document.createElement("a");
  link.className = className;
  link.href = "#";
  const h6 = document.createElement("h6");
  h6.textContent = name;
  link.appendChild(h6);
  titleDiv.appendChild(link);
  div.appendChild(titleDiv);
  cell.appendChild(div);
  return cell;
}

// Call the populateTable function to fetch and display data
populateTable();
