import { CihuyDataAPI } from "https://c-craftjs.github.io/simpelbi/api.js";
import { token, UrlGetUsersProdi } from "../js/template/template.js";
// import { ShowDataUsersProdi } from "../js/config/configusersprodi.js";

// Untuk Get Data dari API
function ShowDataUsersProdi(data) {
  const tableBody = document.getElementById("content");

  // Kosongkan isi tabel saat ini
  tableBody.innerHTML = "";
  let nomor = 1;

  // Loop melalui data yang diterima dari API
  data.forEach((item) => {
    const barisBaru = document.createElement("tr");
    barisBaru.innerHTML = `
      <td>
         <div class="userDatatable-content">${nomor}</div>
      </td>
      <td>
         <div class="d-flex">
            <div class="userDatatable-inline-title">
               <a href="#" class="text-dark fw-500">
                  <h6>${item.idFakultas}</h6>
               </a>
            </div>
         </div>
      </td>
      <td>
         <div class="userDatatable-content">
            ${item.prodi}
         </div>
      </td>
      <td>
         <div class="userDatatable-content">
            ${item.jenjang}
         </div>
      </td>
      <td>
         <div class="userDatatable-content">
            ${item.kaprodi}
         </div>
      </td>
      <td>
         <div class="userDatatable-content">
            ${item.nidn}
         </div>
      </td>
      <td>
         <div class="userDatatable-content">
         <img src="https://simbe-dev.ulbi.ac.id/static/pictures/${item.foto_data}" alt="Foto" width="100" height="100">
         </div>
      </td>
      <td>
         <div class="userDatatable-content">
            ${item.telp}
         </div>
      </td>
      <td>
        <div class="userDatatable-content">
            ${item.email}
        </div>
      </td>
      <td>
         <ul class="orderDatatable_actions mb-0 d-flex flex-wrap">
            <li>
               <a href="#" class="view">
                  <i class="uil uil-eye"></i>
               </a>
            </li>
            <li>
            <a href="#" class="edit"  data-target="#new-member-update" data-prodi-id="${item.id_prodi}">
            <i class="uil uil-edit"></i>
               </a>
            </li>
            <li>
            <a href="#" class="remove" data-prodi-id="${item.id_prodi}">
                  <i class="uil uil-trash-alt"></i>
               </a>
            </li>
         </ul>
      </td>
      `;
    const removeButton = barisBaru.querySelector(".remove");
    removeButton.addEventListener("click", () => {
      const id_prodi = removeButton.getAttribute("data-prodi-id");
      if (id_prodi) {
        deletefakultas(id_prodi);
      } else {
        console.error("ID prodi tidak ditemukan.");
      }
    });
    const editButton = barisBaru.querySelector(".edit");
    editButton.addEventListener("click", () => {
      const id_prodi = editButton.getAttribute("data-prodi-id");
      if (id_prodi) {
        editData(id_prodi);
      } else {
        console.error("ID prodi tidak ditemukan.");
      }
    });
    tableBody.appendChild(barisBaru);
    nomor++;
  });
}
function editData(id_prodi) {
  // Gunakan CihuyDataAPI untuk mengambil data dari server
  CihuyDataAPI(
    UrlGetUsersProdi + `get?idprodi=${id_prodi}`,
    token,
    (error, response) => {
      if (error) {
        console.error("Terjadi kesalahan:", error);
      } else {
        const data = response.data;
        console.log("Data yang diterima:", data);

        // Isi input dalam modal dengan data yang diterima dari server
        // document.getElementById("fakultas-update").value = data.prodi;
        // document.getElementById("dekan-update").value = data.prodi;
        // document.getElementById("nidn-update").value = data.prodi;
        // document.getElementById("niknip-update").value = data.prodi;
        // document.getElementById("telp-update").value = data.prodi;
        // document.getElementById("email-update").value = data.prodi;

        // Tampilkan modal
        const modal = new bootstrap.Modal(
          document.getElementById("new-member-update")
        );
        modal.show();
      }
    }
  );
}

function populateDropdown() {
  const apiUrl = "https://simbe-dev.ulbi.ac.id/api/v1/fakultas/";
  const dropdown = document.getElementById("fakultasDropdown-update");

  // Call the CihuyDataAPI function to fetch the Fakultas data
  CihuyDataAPI(apiUrl, token, (error, response) => {
    if (error) {
      console.error("Terjadi kesalahan:", error);
    } else {
      const data = response.data;
      console.log("Data Fakultas yang diterima:", data);

      // Clear the dropdown options
      dropdown.innerHTML = "";

      // Create and append option elements to the dropdown
      data.forEach((item) => {
        const option = document.createElement("option");
        option.value = item.fakultas;
        option.textContent = item.fakultas;
        dropdown.appendChild(option);
      });
    }
  });
}

populateDropdown();

CihuyDataAPI(UrlGetUsersProdi, token, (error, response) => {
  if (error) {
    console.error("Terjadi kesalahan:", error);
  } else {
    const data = response.data;
    console.log("Data yang diterima:", data);
    ShowDataUsersProdi(data);
  }
});
