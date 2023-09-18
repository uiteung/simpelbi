import {
  CihuyDataAPI,
  CihuyPostApi,
} from "https://c-craftjs.github.io/simpelbi/api.js";
import { CihuyGetCookie } from "https://c-craftjs.github.io/cookies/cookies.js";

const apiUrl = "https://simbe-dev.ulbi.ac.id/api/v1/filesprodi";
const token = CihuyGetCookie("login"); // Get Cookie From SimpelBi
function tampilData(data) {
  const tableBody = document.getElementById("tableBody");

  // Kosongkan isi tabel saat ini
  tableBody.innerHTML = "";
  let nomor = 1;

  // Loop melalui data yang diterima dari API
  data.forEach((item) => {
    const barisBaru = document.createElement("tr");
    barisBaru.innerHTML = `
            <td>${nomor}</td>
            <td>${item.idFile}</td>
            <td>${item.tahun}</td>
            <td>${item.judul}</td>
            <td>
            <a href="https://simbe-dev.ulbi.ac.id/static/pictures/${item.file}" class="btn btn-primary btn-sm" target="_blank">
              Lihat
            </a>
          </td>            
            <td>${item.tgl}</td>
            <td>${item.nm_admin}</td>
            <td>
              <ul class="orderDatatable_actions mb-0 d-flex flex-wrap">
                <li>
                  <a href="#" class="view">
                    <i class="uil uil-eye"></i>
                  </a>
                </li>
                <li>
                  <a href="#" class="edit">
                    <i class="uil uil-edit"></i>
                  </a>
                </li>
                <li>
                  <a href="#" class="remove">
                    <i class="uil uil-trash-alt"></i>
                  </a>
                </li>
              </ul>
            </td>
          `;
    tableBody.appendChild(barisBaru);
    nomor++;
  });
}
const siklusapi = "https://simbe-dev.ulbi.ac.id/api/v1/siklus/";
const apiPostFiles = "https://simbe-dev.ulbi.ac.id/api/v1/filesprodi/add";

function siklusdata(data) {
  const selectElement = document.getElementById("siklus");

  // Kosongkan isi dropdown saat ini
  selectElement.innerHTML = "";

  // Loop melalui data yang diterima dari API
  data.forEach((item, index) => {
    const optionElement = document.createElement("option");
    optionElement.value = index + 1;
    optionElement.textContent = `${index + 1} - Tahun ${item.tahun}`;
    selectElement.appendChild(optionElement);
  });

  selectElement.addEventListener("change", function () {
    const selectedValue = this.value;
    // Lakukan sesuatu dengan nilai yang dipilih, misalnya, tampilkan di konsol
    console.log("Nilai yang dipilih:", selectedValue);
  });
}
// Mendapatkan referensi ke elemen-elemen formulir
const form = document.getElementById("myForm");
const siklusInput = document.getElementById("siklus");
const judulInput = document.getElementById("judul");
const fileInput = document.getElementById("file");

// Menambahkan event listener ke tombol Simpan

document
  .getElementById("tambahDataButton")
  .addEventListener("click", async function () {
    // Mendapatkan nilai dari elemen formulir
    const idSiklus = siklusInput.value;
    const judul = judulInput.value;
    const file = fileInput.files[0];

    // Mengecek apakah file telah dipilih
    if (!idSiklus || !judul || !file) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Harap isi semua bidang formulir!",
      });
      return;
    }

    // Membaca file yang diunggah ke dalam bentuk base64
    const reader = new FileReader();
    reader.onload = async function () {
      const base64Data = reader.result.split(",")[1]; // Mengambil bagian payload dari data base64

      // Membuat objek data yang akan dikirim ke server
      const data = {
        idSiklus: parseInt(idSiklus),
        judul: judul,
        file: {
          fileType: file.type,
          payload: base64Data,
        },
      };

      try {
        // Kirim permintaan POST ke server menggunakan fungsi CihuyPostApi
        await CihuyPostApi(apiPostFiles, token, data);

        // Sembunyikan modal setelah berhasil
        document.getElementById("new-member").style.display = "none";

        // Tampilkan SweetAlert
        window.location.reload();
      } catch (error) {
        console.error("Terjadi kesalahan:", error);
        console.log("Data yang dikirimkan:", data);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Terjadi kesalahan saat menyimpan data.",
        });
        // Handle kesalahan jika terjadi
      }
    };

    // Membaca file sebagai base64
    reader.readAsDataURL(file);
  });
// Panggil API untuk mendapatkan data siklus
CihuyDataAPI(siklusapi, token, (error, response) => {
  if (error) {
    console.error("Terjadi kesalahan:", error);
  } else {
    const data = response.data;
    console.log("Data yang diterima:", data);
    siklusdata(data);
  }
});

// get data
CihuyDataAPI(apiUrl, token, (error, response) => {
  if (error) {
    console.error("Terjadi kesalahan:", error);
  } else {
    const data = response.data;
    console.log("Data yang diterima:", data);
    tampilData(data);
  }
});

// CihuyPostApi(UrlPostUsersAdmin, token, dataToSend)
//   .then((responseText) => {
//     console.log("Respon sukses:", responseText);
//     // Lakukan tindakan lain setelah permintaan POST berhasil
//   })
//   .catch((error) => {
//     console.error("Terjadi kesalahan:", error);
//     // Handle kesalahan jika terjadi
//   });
