import { CihuyPostKTS } from "../js/config/configkts.js"
import { UrlGetKts, token, UrlPostKts } from "../js/template/template.js";
import { CihuyDataAPI, CihuyDeleteAPI } from "https://c-craftjs.github.io/simpelbi/api.js";

// Untuk GET Data dari API
export function ShowDataKTS(data) {
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
                  <h6>${item.kts}</h6>
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
              <a href="#" class="remove">
                  <i class="uil uil-trash-alt" data-kts-id=${item.idKts}></i>
              </a>
            </li>
        </ul>
      </td>
      `;
      const removeButton = barisBaru.querySelector(".remove");
      removeButton.addEventListener("click", () => {
        const standarId = removeButton.getAttribute("data-kts-id");
        if (standarId) {
          deleteKts(standarId);
        } else {
          console.error("ID KTS tidak ditemukan")
        }
      })
    tableBody.appendChild(barisBaru);
    nomor++;
  });
}
CihuyDataAPI(UrlGetKts, token, (error, response) => {
    if (error) {
      console.error("Terjadi kesalahan:", error);
    } else {
      const data = response.data;
    //   console.log("Data yang diterima:", data);
      ShowDataKTS(data);
    }
  });

// Untuk DELETE Data dengan API
function deleteKts(idKts) {
  // Buat URL untuk mengambil data KTS berdasarkan id
  const UrlGetKtsById = `http://simbe-dev.ulbi.ac.id/api/v1/kts/get?idkts=${idKts}`;

  // Lakukan permintaan GET untuk mengambil KTS berdasarkan Id
  CihuyDataAPI(UrlGetKtsById, token, (error, response) => {
    if (error) {
      console.error("Terjadi kesalahan saat mengambil admin: ", error);
    } else {
      const KtsData = response.data;
      if (KtsData) {
        // Dapatkan id KTS dari data yang diterima
        const KtsId = KtsData.idKts;
        const UrlDeleteKts = `http://simbe-dev.ulbi.ac.id/api/v1/kts/get?idkts=${KtsId}`;

        // Lakukan permintaan DELETE
        CihuyDeleteAPI(UrlDeleteKts, token, (deleteError, deleteData) => {
          if (deleteError) {
            console.error(
              "Terjadi kesalahan saat menghapus KTS: ",
              deleteError
            );
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Terjadi kesalahan saaat menghapus KTS",
            });
          } else {
            console.log("KTS berhasil dihapus: ", deleteData);
            Swal.fire({
              icon: "success",
              title: "Sukses!",
              text: "KTS berhasil dihapus.",
            }).then(() => {
              // Refresh halaman setelah menutup popup
              window.location.reload();
            });
          }
        });
      } else {
        console.error("Data KTS tidak ditemukan.")
      }
    }
  })
}

// Untuk POST Data dengan API
const Tombol = document.getElementById("buttoninsert");
Tombol.addEventListener("click", async function (e) {
  e.preventDefault();
  console.log("Button Clicked");

  const ktsval = document.getElementById("kts").value;
  
  var raw = JSON.stringify({
    "kts": ktsval
  });

  // Mengirim permintaan POST menggunakan fungsi CihuyPostApi
  CihuyPostKTS(UrlPostKts, token, raw)
  .then((responseText) => {
    console.log("Response:", responseText);
    window.alert("Data berhasil ditambahkan!");
    window.location.replace("https://euis.ulbi.ac.id/simpelbi/ami/kts.html")
  })
  .catch((error) => {
    console.error("Error:", error);
    // Tangani kesalahan jika terjadi
  });

});

