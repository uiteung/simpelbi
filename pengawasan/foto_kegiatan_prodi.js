import {
  CihuyDataAPI,
  //   CihuyPostApi,
  //   CihuyDeleteAPI,
  //   CihuyUpdateApi,
} from "https://c-craftjs.github.io/simpelbi/api.js";
import {
  token,
  //   UrlGetUsersProdi,
  //   UrlGetUsersFakultas,
  //   UrlGetJenjang,
  //   UrlGetSiklus,
} from "../js/template/template.js";
import { UrlGetAudit } from "../js/template/template.js";
import { populateUserProfile } from "https://c-craftjs.github.io/simpelbi/profile.js";
populateUserProfile();

// Fungsi untuk menampilkan data audit dengan pagination
function createPagination(data, itemsPerPage) {
  const tableBody = document.getElementById("content");
  const paginationContainer = document.querySelector(".dm-pagination");

  const totalPages = Math.ceil(data.length / itemsPerPage);
  let currentPage = 1;

  function displayPage(page) {
    tableBody.innerHTML = "";
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, data.length);

    for (let i = startIndex; i < endIndex; i++) {
      const item = data[i];
      const barisBaru = document.createElement("tr");
      barisBaru.innerHTML = `
        <td>
          <div class="userDatatable-content">${i + 1}</div>
        </td>
        <td>
          <div class="userDatatable-content">${item.fakultas}</div>
        </td>
        <td>
          <div class="userDatatable-content">${item.prodi}</div>
        </td>
        <td>
          <div class="userDatatable-content">
            <img src="https://simbe-dev.ulbi.ac.id/static/pictures/${
              item.foto
            }" alt="Foto" width="100" height="100">
          </div>
        </td>
        <td>
          <div class "userDatatable-content">${item.auditor}</div>
        </td>
        <td>
          <div class="userDatatable-content">${item.tgl}</div>
        </td>
      `;
      tableBody.appendChild(barisBaru);
    }
  }

  // Fungsi untuk mengupdate tampilan pagination
  function updatePagination() {
    paginationContainer.innerHTML = "";

    const maxPagesToShow = 3; // Jumlah maksimal halaman yang ditampilkan pada pagination
    const pageLinks = [];

    // Hitung halaman yang akan ditampilkan
    let startPage = Math.max(currentPage - Math.floor(maxPagesToShow / 2), 1);
    let endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(endPage - maxPagesToShow + 1, 1);
    }

    // Tambahkan tombol "Previous"
    const prevButton = document.createElement("a");
    prevButton.href = "#";
    prevButton.classList.add("dm-pagination__link", "pagination-control");
    prevButton.innerHTML = '<span class="la la-angle-left"></span>';
    prevButton.addEventListener("click", (e) => {
      e.preventDefault();
      if (currentPage > 1) {
        currentPage--;
        displayPage(currentPage);
        updatePagination();
      }
    });
    paginationContainer.appendChild(prevButton);

    // Tambahkan halaman-halaman
    for (let i = startPage; i <= endPage; i++) {
      const pageLink = document.createElement("a");
      pageLink.href = "#";
      pageLink.classList.add("dm-pagination__link", "page-number");
      pageLink.textContent = i;
      pageLink.addEventListener("click", (e) => {
        e.preventDefault();
        currentPage = i;
        displayPage(currentPage);
        updatePagination();
      });

      if (i === currentPage) {
        pageLink.classList.add("active");
      }

      paginationContainer.appendChild(pageLink);
    }

    // Tambahkan tombol "Next"
    const nextButton = document.createElement("a");
    nextButton.href = "#";
    nextButton.classList.add("dm-pagination__link", "pagination-control");
    nextButton.innerHTML = '<span class="la la-angle-right"></span>';
    nextButton.addEventListener("click", (e) => {
      e.preventDefault();
      if (currentPage < totalPages) {
        currentPage++;
        displayPage(currentPage);
        updatePagination();
      }
    });
    paginationContainer.appendChild(nextButton);
  }

  displayPage(currentPage);
  updatePagination();
}

const itemsPerPage = 1; // Ubah sesuai kebutuhan

const currentURL = window.location.href;
const url = new URL(currentURL);
const id_ami = url.searchParams.get("id_ami");

if (id_ami) {
  const apiUrl = `https://simbe-dev.ulbi.ac.id/api/v1/foto/get?id_ami=${id_ami}`;

  CihuyDataAPI(apiUrl, token, (error, response) => {
    if (error) {
      console.error("Terjadi kesalahan:", error);
    } else {
      const data = response.data;
      console.log("Data yang diterima:", data);
      createPagination(data, itemsPerPage);
    }
  });
} else {
  console.log("Parameter id_ami tidak ditemukan dalam URL.");
}
