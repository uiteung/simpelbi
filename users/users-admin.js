import { CihuyDataAPI ,CihuyPostApi} from "https://c-craftjs.github.io/simpelbi/api.js";
import { CihuyGetCookie } from "https://c-craftjs.github.io/cookies/cookies.js";
import { Cihuytobase64 } from "https://c-craftjs.github.io/simpelbi/conv.js";
import { CihuyNameCell } from "./element/namecell.js";
import { CihuyTableCell } from "./element/tablecell.js";
import { CihuyAppend } from "./element/append.js";

const apiUrl = "https://simbe-dev.ulbi.ac.id/api/v1/admins/";
const token = CihuyGetCookie("login");
// get data
CihuyDataAPI(apiUrl, token, (error, data) => {
  const tableBody = document.getElementById("tableBody");

  tableBody.innerHTML = "";

  if (error) {
    console.error("Ada masalah saat mengambil data:", error);
  } else {
    // Lakukan sesuatu dengan data yang Anda dapatkan
    console.log(data);
    if (Array.isArray(data.data) && data.data.length > 0) {
      data.data.forEach((item) => {
        const row = document.createElement("tr");

        // Create and populate table cells for each column
        const idCell = CihuyTableCell("userDatatable-content", item.id_admin);
        const namaCell = CihuyNameCell("text-dark fw-500", item.nama);
        const jabatanCell = CihuyTableCell(
          "userDatatable-content",
          item.jabatan
        );
        const emailCell = CihuyTableCell("userDatatable-content", item.email);
        const nidnCell = CihuyTableCell("userDatatable-content", item.nidn);

        CihuyAppend(row, idCell, namaCell, jabatanCell, emailCell, nidnCell);
        tableBody.appendChild(row);
      });
    } else {
      const table = document.querySelector(".table");
      if (table.classList.contains("footable-empty")) {
        setTimeout(CihuyDataAPI, 1000);
      } else {
        console.error("Data is not an array:", data);
        tableBody.innerHTML = '<tr><td colspan="7">No results</td></tr>';
      }
    }
  }
});


//postdata
const tambahDataButton = document.getElementById('tambahDataButton');

tambahDataButton.addEventListener('click', async function (e) {
  e.preventDefault();

  const namaAdmin = document.getElementById('namaAdmin').value;
  const jabatan = document.getElementById('jabatan').value;
  const email = document.getElementById('email').value;
  const nidn = document.getElementById('nidn').value;
  const fotoInput = document.getElementById('fotoInput');

  const formData = new FormData();
  formData.append('nama', namaAdmin);
  formData.append('jabatan', jabatan);
  formData.append('email', email);
  formData.append('nidn', nidn);

  if (fotoInput.files[0]) {
    const fotoFile = fotoInput.files[0];

    // Mengonversi file gambar menjadi base64
    const reader = new FileReader();
    reader.readAsDataURL(fotoFile);

    reader.onload = function () {
      // Mendapatkan hasil konversi base64
      const fotoBase64 = reader.result;

      // Menambahkan base64 ke FormData
      formData.append('foto', fotoBase64);

      // URL endpoint yang sesuai dengan fungsi CihuyPostApi
      const url = 'https://simbe-dev.ulbi.ac.id/api/v1/admins/add'; // Gantilah dengan URL yang sesuai

      const jsonData = {
        nama: namaAdmin,
        jabatan: jabatan,
        email: email,
        nidn: nidn,
        foto: fotoBase64
    };
      // Mengirim permintaan POST menggunakan fungsi CihuyPostApi
      CihuyPostApi(url, token, jsonData)
        .then(responseText => {
          console.log('Response:', responseText);
          window.alert('Data berhasil ditambahkan!');
        })
        .catch(error => {
          console.error('Error:', error);
          // Tangani kesalahan jika terjadi
        });
    };
  } else {
    // Jika tidak ada file gambar yang dipilih, Anda masih dapat mengirim data lainnya
    // URL endpoint yang sesuai dengan fungsi CihuyPostApi
    const url = 'https://simbe-dev.ulbi.ac.id/api/v1/admins/add'; // Gantilah dengan URL yang sesuai

    // Mengirim permintaan POST menggunakan fungsi CihuyPostApi
    CihuyPostApi(url, token, formData)
      .then(responseText => {
        console.log('Response:', responseText);
        window.alert('Data berhasil ditambahkan!');
      })
      .catch(error => {
        console.error('Error:', error);
        // Tangani kesalahan jika terjadi
      });
  }
});
