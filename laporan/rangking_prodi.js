import { CihuyDataAPI } from "https://c-craftjs.github.io/simpelbi/api.js";
import { token, UrlGetKts, UrlRekapTemuan } from "../js/template/template.js";

// Fungsi untuk mengisi elemen <th> dengan data dari API
CihuyDataAPI(UrlGetKts, token, (error, response) => {
  if (error) {
    console.error("Terjadi kesalahan:", error);
  } else {
    const data = response.data;
    console.log("Data KTS yang diterima:", data);

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
      item.skor = item.observasi + item.minor * 10 + item.mayor * 50;
    });

    tampilData(data);
  }
});
