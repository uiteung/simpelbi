// import { tampilData } from "../js/config/configsiklus.js";
import { CihuyPostKTS } from "../js/config/configkts.js"
import { UrlGetSiklus, token, UrlPostSiklus } from "../js/template/template.js";
import { CihuyDataAPI, CihuyDeleteAPI } from "https://c-craftjs.github.io/simpelbi/api.js";

// Untuk Get Data dari API
export function tampilData(data) {
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
                <h6>${item.tahun}</h6>
              </a>
          </div>
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
              <a href="#" class="edit">
                <i class="uil uil-edit"></i>
              </a>
          </li>
          <li>
              <a href="#" class="remove" data-siklus-id=${item.idSiklus}>
                <i class="uil uil-trash-alt"></i>
              </a>
          </li>
        </ul>
    </td>
      `;
    const removeButton = barisBaru.querySelector(".remove");
    removeButton.addEventListener("click", () => {
      const siklusId = removeButton.getAttribute("data-siklus-id");
      if (siklusId) {
        deleteSiklus(siklusId);
      } else {
        console.log("ID Siklus tidak ditemukan")
      }
    })
    tableBody.appendChild(barisBaru);
    nomor++;
  });
}

CihuyDataAPI(UrlGetSiklus, token, (error, response) => {
    if (error) {
      console.error("Terjadi kesalahan:", error);
    } else {
      const data = response.data;
      console.log("Data yang diterima:", data);
      tampilData(data);
    }
  });

// Untuk POST Data
const Tombol = document.getElementById("simpanbutt");
Tombol.addEventListener("click", async function (e) {
  e.preventDefault();
  console.log("Button Clicked");
  const thnval = document.getElementById("thn").value;
  var raw = JSON.stringify({
    "tahun": thnval
  });
  // Mengirim permintaan POST menggunakan fungsi CihuyPostApi
  CihuyPostKTS(UrlPostSiklus, token, raw)
  .then((responseText) => {
    console.log("Response:", responseText);
    Swal.fire({
      icon: "success",
      title: "Sukses!",
      text: "Data siklus berhasil ditambahkan.",
    }).then(() => {
      // Refresh halaman setelah menutup popup
      window.location.reload();
    });
  })
  .catch((error) => {
    console.error("Error:", error);
    // Tangani kesalahan jika terjadi
  });
});

// Untuk DELETE Data Siklus
function deleteSiklus(idSiklus) {
  // Buat URL untuk mengambil data standar berdasarkan id
  const UrlGetSiklusById = `http://simbe-dev.ulbi.ac.id/api/v1/siklus/get?idsiklus=${idSiklus}`;

  // Lakukan permintaan GET untuk mengambil siklus berdasarkan tahun
  CihuyDataAPI(UrlGetSiklusById, token, (error, response) => {
    if (error) {
      console.error("Terjadi kesalahan saat mengambil admin: ", error);
    } else {
      const siklusData = response.data;
      if (siklusData) {
        // Dapatkan id siklus dari data yang diterima
        const siklusId = siklusData.idSiklus;
        const UrlDeleteSiklus = `https://simbe-dev.ulbi.ac.id/api/v1/siklus/delete?idsiklus=${siklusId}`;

        // Lakukan permintaan DELETE
        CihuyDeleteAPI(UrlDeleteSiklus, token, (deleteError, deleteData) => {
          if (deleteError) {
            console.error(
              "Terjadi kesalahan saat menghapus admin: ", deleteError
            );
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Terjadi kesalahan saat menghapus admin!",
            });
          } else {
            console.log("Admin berhasil dihapus:", deleteData);
            Swal.fire({
              icon: "success",
              title: "Sukses!",
              text: "Admin berhasil dihapus.",
            }).then(() => {
              // Refresh halaman setelah menutup popup
              window.location.reload();
            });
          }
        });
      } else {
        console.error("Data admin tidak ditemukan.");
      }
    }
  });
}
