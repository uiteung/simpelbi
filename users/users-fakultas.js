import {
  CihuyDataAPI,
  CihuyPostApi,
} from "https://c-craftjs.github.io/simpelbi/api.js";
import {
  token,
  UrlGetUsersFakultas,
  UrlPostUsersFakultas,
} from "../js/template/template.js";

function ShowDataUsersFakultas(data) {
  const tableBody = document.getElementById("content");

  // Kosongkan isi tabel saat ini
  tableBody.innerHTML = "";
  let nomor = 1;

  // Loop melalui data yang diterima dari API
  data.forEach((item) => {
    const barisBaru = document.createElement("tr");
    barisBaru.innerHTML = `
    <td>
       <div class="userDatatable-content">${nomor}</div>
    </td>
    <td>
       <div class="d-flex">
          <div class="userDatatable-inline-title">
             <a href="#" class="text-dark fw-500">
                <h6>${item.fakultas}</h6>
             </a>
          </div>
       </div>
    </td>
    <td>
       <div class="userDatatable-content">
          ${item.dekan}
       </div>
    </td>
    <td>
       <div class="userDatatable-content">
          ${item.nidn}
       </div>
    </td>
    <td>
       <div class="userDatatable-content">
          ${item.niknip}
       </div>
    </td>
    <td>
       <div class="userDatatable-content">
          ${item.telp}
       </div>
    </td>
    <td>
       <div class="">
          ${item.email}
       </div>
    </td>
    <td>
         <div class="userDatatable-content">
         <img src="https://simbe-dev.ulbi.ac.id/static/pictures/${item.foto_data}" alt="Foto" width="100" height="100">
         </div>
      </td>
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
// Untuk Get Data dari API
CihuyDataAPI(UrlGetUsersFakultas, token, (error, response) => {
  if (error) {
    console.error("Terjadi kesalahan:", error);
  } else {
    const data = response.data;
    console.log("Data yang diterima:", data);
    ShowDataUsersFakultas(data);
  }
});

//add fakultas
function getBase64Image(file, callback) {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function () {
    const base64Image = reader.result.split(",")[1];
    callback(base64Image);
  };
}

// Tangani penyerahan formulir saat tombol "Tambah Data" diklik
const tambahDataButton = document.getElementById("tambahDataButton");
tambahDataButton.addEventListener("click", function (e) {
  e.preventDefault();

  // Ambil data dari elemen-elemen formulir
  const fakultas = document.getElementById("fakultas").value;
  const dekan = document.getElementById("dekan").value;
  const niknip = document.getElementById("niknip").value;
  const email = document.getElementById("email").value;
  const nidn = document.getElementById("nidn").value;
  const fotoInput = document.getElementById("fotoInput");
  const username = document.getElementById("username").value;

  console.log("dekan:", dekan);
  console.log("fakultas:", fakultas);
  console.log("email:", email);
  console.log("nidn:", nidn);
  console.log("niknip:", niknip);

  // Dapatkan nama file yang diunggah
  let fileName = ""; // Deklarasikan fileName di sini
  const fotoFile = fotoInput.files[0];
  if (fotoFile) {
    fileName = fotoFile.name;
    getBase64Image(fotoFile, function (base64Image) {
      // Buat objek data JSON yang sesuai dengan format yang Anda inginkan
      const dataToSend = {
        fakultas: fakultas,
        user_name: username,
        email: email,
        nidn: nidn,
        niknip: niknip,
        dekan: dekan,

        foto: {
          fileName: fileName, // Gunakan nama file yang diunggah
          fileType: fotoFile ? fotoFile.type : "",
          payload: base64Image, // Gunakan base64 gambar
        },
      };

      // Sekarang dataToSend lengkap dengan payload gambar
      // Kirim data ke server dengan fungsi CihuyPostApi
      CihuyPostApi(UrlPostUsersFakultas, token, dataToSend)
        .then((responseText) => {
          console.log("Respon sukses:", responseText);
          // Lakukan tindakan lain setelah permintaan POST berhasil
          Swal.fire({
            icon: "success",
            title: "Sukses!",
            text: "Data berhasil ditambahkan.",
          }).then(() => {
            // Refresh halaman setelah menutup popup
            // window.location.reload();
          });
        })
        .catch((error) => {
          console.error("Terjadi kesalahan:", error);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Terjadi kesalahan saat menambahkan data.",
          });
        });
    });
  }
});

const apiUrlConvert = "https://simbe-dev.ulbi.ac.id/api/v1/convert";
let dataFromApi = [];
const usernameInput = document.getElementById("username");
const usernameSuggestions = document.getElementById("username-suggestions");
// Panggil fungsi CihuyDataAPI untuk mengambil data saat halaman dimuat
CihuyDataAPI(apiUrlConvert, token, (error, response) => {
  if (error) {
    console.error("Terjadi kesalahan:", error);
  } else {
    const data = response.data;
    dataFromApi = data;
  }
});

usernameInput.addEventListener("input", (e) => {
  const inputValue = e.target.value.toLowerCase();

  // Bersihkan daftar saran sebelumnya
  usernameSuggestions.innerHTML = "";

  // Filter opsi-opsi yang cocok dengan input pengguna
  const filteredOptions = dataFromApi.filter((item) =>
    item.id_rtm.toLowerCase().includes(inputValue)
  );

  // Tampilkan opsi-opsi dalam div saran
  filteredOptions.forEach((item) => {
    const suggestion = document.createElement("div");
    suggestion.textContent = item.id_rtm;
    suggestion.addEventListener("click", () => {
      // Setel nilai input saat opsi dipilih
      usernameInput.value = item.id_rtm;
      usernameSuggestions.innerHTML = ""; // Bersihkan daftar saran
    });
    usernameSuggestions.appendChild(suggestion);
  });
});

// Menutup daftar saran saat klik di luar input
document.addEventListener("click", (e) => {
  if (e.target !== usernameInput && e.target !== usernameSuggestions) {
    usernameSuggestions.innerHTML = "";
  }
});
