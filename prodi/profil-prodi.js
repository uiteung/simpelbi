import { UrlGetProfile, token } from "../js/template/template.js";
import { CihuyDataAPI } from "https://c-craftjs.github.io/simpelbi/api.js";
import { populateUserProfile } from "https://c-craftjs.github.io/simpelbi/profile.js";

// Untuk GET Data Profile
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


// Untuk GET All Data Profil
// Function to populate the form with data
function ShowDataAMI(data) {
    const form = document.getElementById("content");
  
    // Fill the form fields with data
    form.innerHTML = `
      <div class="form-group">
        <label for="nama">Nama :</label>
        <input type="text" class="form-control" id="nama" value="${data.nama_user}" readonly>
      </div>
      <div class="form-group">
        <label for="jabatan">Jabatan :</label>
        <input type="text" class="form-control" id="jabatan" value="${data.nama_level}" readonly>
      </div>
      <div class="form-group">
        <label for="email">Email :</label>
        <input type="email" class="form-control" id="email" value="${data.email}" readonly>
      </div>
      <div class="form-group">
        <label for="file">Foto Sekarang :</label>
        <a href="javascript:;" class="nav-item-toggle">
          <img src="https://simbe-dev.ulbi.ac.id/static/pictures/${data.foto}" alt="foto" class="rounded-circle" style="width: 100px; height: 100px; margin-left: 10px;">
        </a>
      </div>
      <div class="button-group d-flex justify-content-end">
        <a class="btn btn-primary btn-default btn-squared text-capitalize" href="update-profile.html">Update</a>
        <button type="button" class="btn btn-light btn-default btn-squared fw-400 text-capitalize b-light color-light">Kembali</button>
    </div>
    `;
  }

CihuyDataAPI(UrlGetProfile, token, (error, response) => {
  if (error) {
    console.error("Terjadi kesalahan:", error);
  } else {
    const data = response.data;
    console.log("Data yang diterima:", data);
    ShowDataAMI(data);
  }
});
