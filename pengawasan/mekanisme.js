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
import { UrlGetMekanisme } from "../js/template/template.js";
import { populateUserProfile } from "https://c-craftjs.github.io/simpelbi/profile.js";

// Untuk Get Data Profile
populateUserProfile()

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


// Untuk Get Data Mekanisme
function ShowDataMekanisme(data) {
  const tableBody = document.getElementById("content");
  tableBody.innerHTML = "";
  let nomor = 1;

  const pertanyaan = [
    "Pembukaan dan pertemuan dengan Kaprodi",
    "Pembukaan dan pertemuan dengan Kaprodi",

    "Pertemuan dengan staf dosen",
    "Pertemuan dengan karyawan",
    "Pertemuan dengan mahasiswa",
    "Pertemuan dengan alumni/pengguna lulusan (jika ada)",
    "Penyampaian temuan dan penutup",
  ];
  data.forEach((item) => {
    const mekanismeCount = Object.keys(item).filter((key) =>
      key.startsWith("question")
    ).length;

    for (let i = 1; i <= mekanismeCount; i++) {
      const barisBaru = document.createElement("tr");
      barisBaru.innerHTML = `
        <td>
          <div class="userDatatable-content">${nomor}</div>
        </td>
        <td>
        <div class="userDatatable-content">${pertanyaan[i]}</div>
        </td>
        <td>
          <div class="userDatatable-content">${item["question" + i]}</div>
        </td>
      `;

      tableBody.appendChild(barisBaru);
      nomor++;
    }
  });
}

const currentURL = window.location.href;
const url = new URL(currentURL);
const id_ami = url.searchParams.get("id_ami");

if (id_ami) {
  const apiUrl = `https://simbe-dev.ulbi.ac.id/api/v1/mekanisme/getbyami?id_ami=${id_ami}`;

  CihuyDataAPI(apiUrl, token, (error, response) => {
    if (error) {
      console.error("Terjadi kesalahan:", error);
    } else {
      const data = response.data;
      console.log("Data yang diterima:", data);

      // Memanggil fungsi ShowDataMekanisme dengan data yang diterima
      ShowDataMekanisme([data]); // Mengubah data menjadi array tunggal
    }
  });
} else {
  console.log("Parameter id_ami tidak ditemukan dalam URL.");
}
