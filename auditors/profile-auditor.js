import { populateUserProfile } from "https://c-craftjs.github.io/simpelbi/profile.js";

// Untuk Get Data Profile
populateUserProfile();
import { token } from "../js/template/template";

function fillFormWithData(data) {
  document.getElementById("nama_user").value = data.data.nama_user;
  document.getElementById("user_level").value = data.data.user_level;
  document.getElementById("nidn").value = data.data.nidn;
  document.getElementById("email").value = data.data.email;

  const fotoElement = document.querySelector(".profile-image");
}

// URL API dan token
const apiUrlprofile = "https://simbe-dev.ulbi.ac.id/api/v1/profile";

// Panggil fungsi untuk mengambil data
CihuyDataAPI(apiUrlprofile, token, (error, data) => {
  if (error) {
    console.error("Error fetching data:", error);
  } else {
    // Panggil fungsi untuk mengisi formulir dengan data yang diterima
    fillFormWithData(data);
  }
});

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
