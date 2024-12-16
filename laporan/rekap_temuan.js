import {
  CihuyDataAPI,
  //   CihuyPostApi,
  //   CihuyDeleteAPI,
  //   CihuyUpdateApi,
} from "https://c-craftjs.github.io/simpelbi/api.js";
import { CihuyBarChart } from "https://c-craftjs.github.io/simpelbi/grafik.js";
import {
  token,
  UrlGetKts,
  // UrlGetAmi,
  UrlRekapTemuan,
  //   UrlGetSiklus,
} from "../js/template/template.js";
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


// Fungsi untuk mengisi elemen <th> dengan data dari API
CihuyDataAPI(UrlGetKts, token, (error, response) => {
  if (error) {
    console.error("Terjadi kesalahan:", error);
  } else {
    const data = response.data;
    console.log("Data yang diterima:", data);

    data.forEach((item) => {
      const th = document.createElement("th");
      th.innerHTML = `<span class="userDatatable-title">${item.kts}</span>`;
      thead.children[0].appendChild(th);
    });
  }
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
            <td>${item.prodi}</td>
            <td>${item.observasi}</td>
            <td>${item.minor}</td>
            <td>${item.mayor}</td>

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
    console.log("Data yang diterima:", data);
    const formattedData = data.map((item) => ({
      prodi: item.prodi,
      observasi: parseInt(item.observasi),
      minor: parseInt(item.minor),
      mayor: parseInt(item.mayor),
    }));

    tampilData(data);
    CihuyBarChart(formattedData);
  }
});
