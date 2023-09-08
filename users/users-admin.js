import { CihuyGetHeaders } from "https://c-craftjs.github.io/api/api.js";
import { CihuyGetCookie } from "https://c-craftjs.github.io/cookies/cookies.js";

const apiUrl = 'https://simbe-dev.ulbi.ac.id/api/v1/admins/';
const token = CihuyGetCookie("login");

// Target the table body
const adminTableBody = document.getElementById('adminTableBody');

CihuyGetHeaders(apiUrl, token)
  .then((data) => {
    // Check if the response contains data and it's an array
    if (data && data.data && Array.isArray(data.data)) {
      // Clear the existing table body content
      adminTableBody.innerHTML = '';

      // Loop through the data and populate the table
      data.data.forEach((admin) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>
            <div class="userDatatable-content">${admin.id_admin}</div>
          </td>
          <td>
            <div class="d-flex">
              <div class="userDatatable-inline-title">
                <a href="#" class="text-dark fw-500">
                  <h6>${admin.nama}</h6>
                </a>
              </div>
            </div>
          </td>
          <td>
            <div class="userDatatable-content">${admin.email}</div>
          </td>
          <td>
            <div class="userDatatable-content">${admin.jabatan}</div>
          </td>
          <td>
            <div class="userDatatable-content">${admin.nidn}</div>
          </td>
          <td>
            <div class="userDatatable-content">${admin.foto_data}</div>
          </td>
          <td>
            <ul class="orderDatatable_actions mb-0 d-flex flex-wrap">
              <li><a href="#" class="view"><i class="uil uil-eye"></i></a></li>
              <li><a href="#" class="edit"><i class="uil uil-edit"></i></a></li>
              <li><a href="#" class="remove"><i class="uil uil-trash-alt"></i></a></li>
            </ul>
          </td>
        `;
        adminTableBody.appendChild(row);
      });
    }
  })
  .catch((error) => {
    console.error("Error:", error);
  });