import { UrlGetProfile, token } from "../js/template/template.js";
import { CihuyDataAPI } from "https://c-craftjs.github.io/simpelbi/api.js";

// Function to populate the form with data
function ShowDataAMI(data) {
  const form = document.getElementById("content");

  // Fill the form fields with data
  form.querySelector("#nama").value = data.nama_user;
  form.querySelector("#jabatan").value = data.nama_level;
  form.querySelector("#email").value = data.email;
  form.querySelector("#file").value = data.foto;

  // Menampilkan foto dalam elemen gambar
  const fotoContainer = form.querySelector(".nav-item-toggle");
  const fotoImg = fotoContainer.querySelector("img");
  fotoImg.src = `https://simbe-dev.ulbi.ac.id/static/pictures/${data.foto}`;
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