import { CihuyDataAPI } from "https://c-craftjs.github.io/simpelbi/api.js";
import { token, UrlRekapTemuan } from "../js/template/template.js";
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


function tampilData(data) {
  const tableBody = document.getElementById("content");

  // Kosongkan isi tabel saat ini
  tableBody.innerHTML = "";
  let nomor = 1;

  // Loop melalui data yang diterima dari API
  data.forEach((item) => {
    const barisBaru = document.createElement("tr");
    barisBaru.innerHTML = `
            <td>${nomor}</td>
            <td>${item.fakultas}</td>
            
            <td>${item.skor}</td>
          `;

    tableBody.appendChild(barisBaru);
    nomor++;
  });
}

CihuyDataAPI(UrlRekapTemuan, token, (error, response) => {
  if (error) {
    console.error("Terjadi kesalahan:", error);
  } else {
    const data = response.data;
    console.log("Data Rekap Temuan yang diterima:", data);

    // Tambahkan perhitungan Skor dan tambahkan ke setiap item data
    data.forEach((item) => {
      item.skor =
        parseInt(item.observasi) +
        parseInt(item.minor) * 10 +
        parseInt(item.mayor) * 50;
    });

    // Group data by "fakultas" and calculate the total "skor" for each "fakultas"
    const fakultasSkorTotal = {};
    data.forEach((item) => {
      const fakultas = item.fakultas;
      if (fakultasSkorTotal[fakultas] === undefined) {
        fakultasSkorTotal[fakultas] = 0;
      }
      fakultasSkorTotal[fakultas] += item.skor;
    });

    // Create a unique list of "fakultas"
    const uniqueFakultas = [...new Set(data.map((item) => item.fakultas))];

    // Create a new array with one row for each unique "fakultas"
    const uniqueFakultasData = uniqueFakultas.map((fakultas) => {
      return {
        fakultas: fakultas,
        skor: fakultasSkorTotal[fakultas],
      };
    });

    tampilData(uniqueFakultasData);
  }
});
