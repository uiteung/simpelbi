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

const apiUrl = "https://simbe-dev.ulbi.ac.id/api/v1/kepuasanmitra";
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
    <td>${item.id_kepuasan_tendik}</td>
    <td>${item.tahun}</td>
    <td>${item.judul}</td>
    <td>
    <a href="https://simbe-dev.ulbi.ac.id/static/pictures/${item.file}" class="btn btn-primary btn-sm" target="_blank">
      Lihat
    </a>
  </td>          
  <td>${item.tanggal}</td>
    <td>${item.nm_admin}</td>

    <td>
      <ul class="orderDatatable_actions mb-0 d-flex flex-wrap">
        
        <li>
        <a href="#" class="edit" data-target="#new-member-update" data-files-id="${item.id_kepuasan_tendik}">
        <i class="uil uil-edit"></i>
          </a>
        </li>
        <li>
        <a href="#" class="remove" data-files-id="${item.id_kepuasan_tendik}">
        <i class="uil uil-trash-alt"></i>
          </a>
        </li>
      </ul>
    </td>
  `;
    const removeButton = barisBaru.querySelector(".remove");
    removeButton.addEventListener("click", () => {
      const id_kepuasan_tendik = removeButton.getAttribute("data-files-id");
      if (id_kepuasan_tendik) {
        deleteFile(id_kepuasan_tendik);
      } else {
        console.error("id hasil survei untuk Auditor tidak ditemukan.");
      }
    });
    const editButton = barisBaru.querySelector(".edit");
    editButton.addEventListener("click", () => {
      const id_kepuasan_tendik = editButton.getAttribute("data-files-id");
      if (id_kepuasan_tendik) {
        editData(id_kepuasan_tendik);
      } else {
        console.error("id hasil survei untuk Auditor tidak ditemukan.");
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

function editData(id_kepuasan_tendik) {
  // Gunakan CihuyDataAPI untuk mengambil data dari server
  CihuyDataAPI(
    apiUrl + `?id_kepuasan_tendik=${id_kepuasan_tendik}`,
    token,
    (error, response) => {
      if (error) {
        console.error("Terjadi kesalahan:", error);
      } else {
        const data = response.data;
        console.log("Data yang diterima:", data);
        const fileData = data.find(
          (item) => item.id_kepuasan_tendik === parseInt(id_kepuasan_tendik)
        );
        document.getElementById("judul-update").value = fileData.judul;

        // Set nilai idFileToUpdate dengan idFile yang ingin diupdate
        idFileToUpdate = fileData.id_kepuasan_tendik;

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
