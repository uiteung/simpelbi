import { UrlGetProfile, token } from "../js/template/template.js";
import { CihuyDataAPI } from "https://c-craftjs.github.io/simpelbi/api.js";

// Untuk GET All Data Profil
// Function to populate the form with data
function ShowDataAMI(data) {
    const form = document.getElementById("content");
  
    // Fill the form fields with data
    form.innerHTML = `
      <div class="form-group">
        <label for="nama">Nama :</label>
        <input type="text" class="form-control" id="nama" value="${data.nama_user}">
      </div>
      <div class="form-group">
        <label for="jabatan">Jabatan :</label>
        <input type="text" class="form-control" id="jabatan" value="${data.nama_level}">
      </div>
      <div class="form-group">
        <label for="email">Email :</label>
        <input type="email" class="form-control" id="email" value="${data.email}">
      </div>
      <div class="form-group">
        <label for="file">Foto Sekarang :</label>
        <input id="fotoInput" type="file" class="form-control" placeholder="Email Aktif">
      </div>
      <div class="button-group d-flex justify-content-end">
        <a class="btn btn-primary btn-default btn-squared text-capitalize" type="button">Simpan</a>
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

// Untuk UPDATE Data Menggunakan API
// Buat fungsi untuk get Profile
function getProfile(callback) {
    CihuyDataAPI(UrlGetProfile, token, (error, response) => {
        if (error) {
            console.error("Terjadi kesalahan saat mengambil data profile:", error);
            callback(error, null);
        } else {
            const profileData = response.data;
            callback(null, profileData);
        }
    });
}
// Buat fungsi untuk Edit Data Profile
function editData() {
    getProfile((error, profileData) => {
        
    })
}
