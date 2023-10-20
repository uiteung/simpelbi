import { CihuyDataAPI } from "https://c-craftjs.github.io/simpelbi/api.js";
import { token, UrlRekapTemuan } from "../js/template/template.js";

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

    tampilData(uniqueFakultasData);
  }
});
