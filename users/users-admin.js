import {
  CihuyDataAPI,
  CihuyPostApi,
} from "https://c-craftjs.github.io/simpelbi/api.js";
import {
  UrlGetUsersAdmin,
  UrlPostUsersAdmin,
} from "../js/template/template.js";
import { ShowDataUsersAdmin } from "../js/config/configusersadmin.js";
import { CihuyGetCookie } from "https://c-craftjs.github.io/cookies/cookies.js";
const token = CihuyGetCookie("login");

// Untuk Get Data dari API
CihuyDataAPI(UrlGetUsersAdmin, token, (error, response) => {
  if (error) {
    console.error("Terjadi kesalahan:", error);
  } else {
    const data = response.data;
    console.log("Data yang diterima:", data);
    ShowDataUsersAdmin(data);
  }
});
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
  const namaAdmin = document.getElementById("namaAdmin").value;
  const jabatan = document.getElementById("jabatan").value;
  const email = document.getElementById("email").value;
  const nidn = document.getElementById("nidn").value;
  const fotoInput = document.getElementById("fotoInput");
  const username = document.getElementById("username").value;

  console.log("namaAdmin:", namaAdmin);
  console.log("jabatan:", jabatan);
  console.log("email:", email);
  console.log("nidn:", nidn);

  // Dapatkan nama file yang diunggah
  let fileName = ""; // Deklarasikan fileName di sini
  const fotoFile = fotoInput.files[0];
  if (fotoFile) {
    fileName = fotoFile.name;
    getBase64Image(fotoFile, function (base64Image) {
      // Buat objek data JSON yang sesuai dengan format yang Anda inginkan
      const dataToSend = {
        nama: namaAdmin,
        jabatan: jabatan,
        userName: username,
        email: email,
        nidn: nidn,
        foto: {
          fileName: fileName, // Gunakan nama file yang diunggah
          fileType: fotoFile ? fotoFile.type : "",
          payload: base64Image, // Gunakan base64 gambar
        },
      };

      // Sekarang dataToSend lengkap dengan payload gambar
      // Kirim data ke server dengan fungsi CihuyPostApi
      CihuyPostApi(UrlPostUsersAdmin, token, dataToSend)
        .then((responseText) => {
          console.log("Respon sukses:", responseText);
          // Lakukan tindakan lain setelah permintaan POST berhasil
          window.location.reload();
        })
        .catch((error) => {
          console.error("Terjadi kesalahan:", error);
          // Handle kesalahan jika terjadi
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
