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

function ShowDataMekanisme(data) {
  const tableBody = document.getElementById("content");
  tableBody.innerHTML = "";
  let nomor = 1;

  const pertanyaan = [
    "Pembukaan dan pertemuan dengan Kaprodi",
    "Pertemuan dengan staf dosen",
    "Pertemuan dengan karyawan",
    "Pertemuan dengan mahasiswa",
    "Pertemuan dengan alumni/pengguna lulusan (jika ada)",
    "Penyampaian temuan dan penutup",
  ];

  if (data && data.length > 0) {
    data = data[0]; // Ambil data pertama dari array jika ada
    const mekanismeCount = Object.keys(data).filter((key) =>
      key.startsWith("question")
    ).length;

    for (let i = 1; i <= mekanismeCount; i++) {
      const barisBaru = document.createElement("tr");
      barisBaru.innerHTML = `
        <td>
          <div class="userDatatable-content">${nomor}</div>
        </td>
        <td>
          <div class="userDatatable-content">${pertanyaan[i - 1]}</div>
        </td>
        <td>
          <div class="userDatatable-content">
            <select>
              <option value="Ya">Ya</option>
              <option value="Tidak">Tidak</option>
            </select>
          </div>
        </td>
      `;

      tableBody.appendChild(barisBaru);
      nomor++;
    }
  } // Masukkan HTML formulir ke dalam elemen dengan ID "content"
  tableBody.innerHTML = formHtml;
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
      if (response.code === 404 && response.data === null) {
        // Handle 404 response with data null by showing the form
        ShowDataMekanisme(null);
      } else {
        const data = response.data;
        console.log("Data yang diterima:", data);
        ShowDataMekanisme([data]);
      }
    }
  });
} else {
  console.log("Parameter id_ami tidak ditemukan dalam URL.");
}
