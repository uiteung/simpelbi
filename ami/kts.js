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
              <a href="#" class="remove" data-kts-id=${item.id_kts}>
                  <i class="uil uil-trash-alt"></i>
              </a>
            </li>
        </ul>
      </td>
      `;
      const removeButton = barisBaru.querySelector(".remove");
      removeButton.addEventListener("click", () => {
        const KtsId = removeButton.getAttribute("data-kts-id");
        if (KtsId) {
          deleteKts(KtsId);
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
      console.log("Data yang diterima:", data);
      ShowDataKTS(data);
    }
  });

// Untuk DELETE Data dengan API
function deleteKts(id_kts) {
  // Buat URL untuk mengambil data KTS berdasarkan id
  const UrlGetKtsById = `https://simbe-dev.ulbi.ac.id/api/v1/kts/get?idkts=${id_kts}`;

  // Lakukan permintaan GET untuk mengambil KTS berdasarkan Id
  CihuyDataAPI(UrlGetKtsById, token, (error, response) => {
    if (error) {
      console.error("Terjadi kesalahan saat mengambil KTS: ", error);
    } else {
      const KtsData = response.data;
      if (KtsData) {
        // Dapatkan id KTS dari data yang diterima
        const KtsId = KtsData.id_kts;
        const UrlDeleteKts = `https://simbe-dev.ulbi.ac.id/api/v1/kts/delete?idkts=${KtsId}`;

        // Menampilkan pesan konfirmasi SweetAlert
        Swal.fire({
          title: "Hapus KTS?",
          text: "Apakah Anda yakin ingin menghapus KTS?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Ya, Hapuskan",
          cancelButtonText: "Batal",
        }).then((result) => {
          if (result.isConfirmed) {
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
          }
        })
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

  // Menampilkan pesan konfirmasi SweetAlert
  Swal.fire({
    title: "Tambahkan KTS?",
    text: "Apakah Anda yakin ingin menambahkan KTS?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Ya, Tambahkan",
    cancelButtonText: "Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      // Jika pengguna menekan tombol "Ya, Tambahkan", kirim permintaan POST
      CihuyPostKTS(UrlPostKts, token, raw)
        .then((responseText) => {
          console.log("Response:", responseText);
          Swal.fire({
            icon: "success",
            title: "Sukses!",
            text: "KTS berhasil ditambahkan"
          }).then(() => {
            // Refresh halaman setelah menutup popup
            window.location.reload();
          });
        })
        .catch((error) => {
          console.error("Error:", error);
          // Tangani kesalahan jika terjadi
        });
    }
  });
});


