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
import { CihuyPaginations } from "https://c-craftjs.github.io/simpelbi/pagenations.js";

import { populateUserProfile } from "https://c-craftjs.github.io/simpelbi/profile.js";
populateUserProfile();

document.addEventListener("DOMContentLoaded", () => {
  // Fungsi untuk menghapus cookie
  function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }

  // Ambil elemen Sign Out
  const signoutButton = document.querySelector(".nav-author__signout");

  // Tambahkan event listener untuk logout
  signoutButton.addEventListener("click", (event) => {
    event.preventDefault(); // Mencegah perilaku default <a>

    // Hapus cookie yang terkait dengan login
    deleteCookie("login");

    // Arahkan pengguna ke halaman yang diinginkan
    window.location.href = signoutButton.getAttribute("href");
  });
});


const currentURL = window.location.href;
const url = new URL(currentURL);
const id_ami = url.searchParams.get("id_ami");
const itemsPerPage = 3; // Ubah sesuai kebutuhan

function dataFotoKegiatan(item, index) {
  // Anda dapat menyesuaikan tampilan isi baris data di sini sesuai kebutuhan
  return `
    <td>
      <div class="userDatatable-content">${index + 1}</div>
    </td>
    <td>
      <div class="userDatatable-content">${item.fakultas}</div>
    </td>
    <td>
      <div class="userDatatable-content">${item.prodi_unit}</div>
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
}
if (id_ami) {
  const apiUrl = `https://simbe-dev.ulbi.ac.id/api/v1/foto/get?id_ami=${id_ami}`;

  CihuyDataAPI(apiUrl, token, (error, response) => {
    if (error) {
      console.error("Terjadi kesalahan:", error);
    } else {
      const data = response.data;
      console.log("Data yang diterima:", data);

      CihuyPaginations(data, itemsPerPage, "content", dataFotoKegiatan, 1, 3);
    }
  });
} else {
  console.log("Parameter id_ami tidak ditemukan dalam URL.");
}
