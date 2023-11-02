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

  // Fungsi untuk menampilkan data pada halaman tertentu
  function displayPage(page) {
    tableBody.innerHTML = "";
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    for (let i = startIndex; i < endIndex && i < data.length; i++) {
      const item = data[i];
      const barisBaru = document.createElement("tr");
      // Isi kolom-kolom tabel dengan data yang diambil
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
          <div class="userDatatable-content">${item.auditor}</div>
        </td>
        <td>
          <div class="userDatatable-content">${item.tgl}</div>
        </td>
      `;
      tableBody.appendChild(barisBaru);
    }
  }

  // Fungsi untuk mengupdate tampilan pagination
  function updatePagination(page) {
    paginationContainer.innerHTML = "";

    // Tambahkan tombol "Previous"
    const prevButton = document.createElement("a");
    prevButton.href = "#";
    prevButton.classList.add("dm-pagination__link", "pagination-control");
    prevButton.innerHTML = '<span class="la la-angle-left"></span>';
    prevButton.addEventListener("click", (e) => {
      e.preventDefault();
      if (page > 1) {
        displayPage(page - 1);
        updatePagination(page - 1);
      }
    });
    paginationContainer.appendChild(prevButton);

    // Tambahkan halaman-halaman
    for (let i = 1; i <= totalPages; i++) {
      const pageLink = document.createElement("a");
      pageLink.href = "#";
      pageLink.classList.add("dm-pagination__link", "page-number");
      pageLink.textContent = i;
      pageLink.addEventListener("click", (e) => {
        e.preventDefault();
        displayPage(i);
        updatePagination(i);
      });

      if (i === page) {
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
      if (page < totalPages) {
        displayPage(page + 1);
        updatePagination(page + 1);
      }
    });
    paginationContainer.appendChild(nextButton);
  }

  // Inisialisasi dengan menampilkan halaman pertama
  displayPage(1);
  updatePagination(1);
}

// Mengatur jumlah item per halaman
const itemsPerPage = 1; // Ubah sesuai kebutuhan

// Panggil function createPagination dengan data yang diinginkan
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
