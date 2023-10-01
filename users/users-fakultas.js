import {
  CihuyDataAPI,
  CihuyPostApi,
  CihuyDeleteAPI,
} from "https://c-craftjs.github.io/simpelbi/api.js";
import {
  token,
  UrlGetUsersFakultas,
  UrlPostUsersFakultas,
} from "../js/template/template.js";
// import { addFormFakultas } from "./fakultas/add.js";
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
          <a href="#" class="remove" data-fakultas-id="${item.id_fakultas}">
             <i class="uil uil-trash-alt"></i>
          </a>
       </li>
       </ul>
    </td>
    `;
    const removeButton = barisBaru.querySelector(".remove");
    removeButton.addEventListener("click", () => {
      const id_fakultas = removeButton.getAttribute("data-fakultas-id");
      if (id_fakultas) {
        deletefakultas(id_fakultas);
      } else {
        console.error("ID fakultas tidak ditemukan.");
      }
    });
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

// //add fakultas
// function getBase64Image(file, callback) {
//   const reader = new FileReader();
//   reader.readAsDataURL(file);
//   reader.onload = function () {
//     const base64Image = reader.result.split(",")[1];
//     callback(base64Image);
//   };
// }

// // Tangani penyerahan formulir saat tombol "Tambah Data" diklik
// const tambahDataButton = document.getElementById("tambahDataButton");
// tambahDataButton.addEventListener("click", function (e) {
//   e.preventDefault();

//   // Ambil data dari elemen-elemen formulir
//   const fakultas = document.getElementById("fakultas").value;
//   const dekan = document.getElementById("dekan").value;
//   const niknip = document.getElementById("niknip").value;
//   const email = document.getElementById("email").value;
//   const nidn = document.getElementById("nidn").value;
//   const telp = document.getElementById("telp").value;
//   const fotoInput = document.getElementById("fotoInput");
//   const username = document.getElementById("username").value;

//   console.log("dekan:", dekan);
//   console.log("fakultas:", fakultas);
//   console.log("email:", email);
//   console.log("nidn:", nidn);
//   console.log("niknip:", niknip);
//   console.log("telp:", telp);

//   // Dapatkan nama file yang diunggah
//   let fileName = ""; // Deklarasikan fileName di sini
//   const fotoFile = fotoInput.files[0];
//   if (fotoFile) {
//     fileName = fotoFile.name;
//     getBase64Image(fotoFile, function (base64Image) {
//       // Buat objek data JSON yang sesuai dengan format yang Anda inginkan
//       const dataToSend = {
//         fakultas: fakultas,
//         user_name: username,
//         email: email,
//         nidn: nidn,
//         niknip: niknip,
//         telp: telp,
//         dekan: dekan,

//         foto: {
//           fileName: fileName, // Gunakan nama file yang diunggah
//           fileType: fotoFile ? fotoFile.type : "",
//           payload: base64Image, // Gunakan base64 gambar
//         },
//       };

//       // Sekarang dataToSend lengkap dengan payload gambar
//       // Kirim data ke server dengan fungsi CihuyPostApi
//       CihuyPostApi(UrlPostUsersFakultas, token, dataToSend)
//         .then((responseText) => {
//           console.log("Respon sukses:", responseText);
//           // Lakukan tindakan lain setelah permintaan POST berhasil
//           Swal.fire({
//             icon: "success",
//             title: "Sukses!",
//             text: "Data berhasil ditambahkan.",
//           }).then(() => {
//             // Refresh halaman setelah menutup popup
//             window.location.reload();
//           });
//         })
//         .catch((error) => {
//           console.error("Terjadi kesalahan:", error);
//           Swal.fire({
//             icon: "error",
//             title: "Oops...",
//             text: "Terjadi kesalahan saat menambahkan data.",
//           });
//         });
//     });
//   }
// });

function deletefakultas(id_fakultas) {
  // Tampilkan dialog konfirmasi menggunakan SweetAlert2
  Swal.fire({
    title: "Apakah Anda yakin ingin menghapus fakultas?",
    text: "Penghapusan fakultas akan permanen.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Ya, Hapus",
    cancelButtonText: "Tidak, Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      // Buat URL untuk mengambil fakultas berdasarkan ID
      const apiUrlGetfakultasById = `https://simbe-dev.ulbi.ac.id/api/v1/fakultas/get?idfakultas=${id_fakultas}`;

      // Lakukan permintaan GET untuk mengambil fakultas berdasarkan ID fakultas
      CihuyDataAPI(apiUrlGetfakultasById, token, (error, response) => {
        if (error) {
          console.error("Terjadi kesalahan saat mengambil fakultas:", error);
        } else {
          const fakultasData = response.data;
          if (fakultasData) {
            // Dapatkan ID fakultas dari data yang diterima
            const fakultasId = fakultasData.id_fakultas;

            // Buat URL untuk menghapus fakultas berdasarkan ID fakultas yang telah ditemukan
            const apiUrlfakultasDelete = `https://simbe-dev.ulbi.ac.id/api/v1/fakultas/delete?idfakultas=${fakultasId}`;

            // Lakukan permintaan DELETE untuk menghapus fakultas
            CihuyDeleteAPI(
              apiUrlfakultasDelete,
              token,
              (deleteError, deleteData) => {
                if (deleteError) {
                  console.error(
                    "Terjadi kesalahan saat menghapus fakultas:",
                    deleteError
                  );
                  Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Terjadi kesalahan saat menghapus fakultas!",
                  });
                } else {
                  console.log("fakultas berhasil dihapus:", deleteData);
                  Swal.fire({
                    icon: "success",
                    title: "Sukses!",
                    text: "fakultas berhasil dihapus.",
                  }).then(() => {
                    // Refresh halaman setelah menutup popup
                    window.location.reload();
                  });
                }
              }
            );
          } else {
            console.error("Data fakultas tidak ditemukan.");
          }
        }
      });
    } else {
      // Tampilkan pesan bahwa penghapusan dibatalkan
      Swal.fire("Dibatalkan", "Penghapusan fakultas dibatalkan.", "info");
    }
  });
}

// document.addEventListener("DOMContentLoaded", function () {
//   const addDataLink = document.getElementById("add-data-link");
//   const contentsDiv = document.querySelector(".contents");

//   addDataLink.addEventListener("click", function (event) {
//     event.preventDefault();

//     // Load content from add.html
//     fetch("addfakultas.html")
//       .then((response) => response.text())
//       .then((data) => {
//         contentsDiv.innerHTML = data;
//       })
//       .catch((error) => {
//         console.error("Error loading add.html:", error);
//       });
//   });
// });

const apiUrlConvert = "https://simbe-dev.ulbi.ac.id/api/v1/convert";
let dataFromApi = [];
// Panggil fungsi CihuyDataAPI untuk mengambil data saat halaman dimuat
CihuyDataAPI(apiUrlConvert, token, (error, response) => {
  if (error) {
    console.error("Terjadi kesalahan:", error);
  } else {
    const data = response.data;
    dataFromApi = data;
    console.log(dataFromApi);
  }
});
// // Ambil elemen input dan div untuk saran username
// const inputUsername = document.getElementById("username");
// const usernameSuggestions = document.getElementById("username-suggestions");

// // Tambahkan event listener untuk memantau input
// inputUsername.addEventListener("input", function () {
//   const userInput = inputUsername.value.toLowerCase();

//   // Kosongkan div saran sebelum menambahkan saran baru
//   usernameSuggestions.innerHTML = "";

//   // Filter data API berdasarkan input pengguna
//   const filteredData = dataFromApi.filter((item) =>
//     item.id_rtm.toLowerCase().includes(userInput)
//   );

//   // Tampilkan saran dalam div saran
//   filteredData.forEach((item) => {
//     const suggestion = document.createElement("div");
//     suggestion.textContent = item.id_rtm;
//     suggestion.classList.add("suggestion");

//     // Tambahkan event listener untuk menambahkan nilai ke input saat saran dipilih
//     suggestion.addEventListener("click", function () {
//       inputUsername.value = item.id_rtm;
//       usernameSuggestions.innerHTML = ""; // Kosongkan div saran setelah memilih
//     });

//     usernameSuggestions.appendChild(suggestion);
//   });
// });
function redirectToAddPage() {
  window.location.href = "fakultas/addfakultas.html";
}

// Tangani klik tombol "Tambah Data Baru"
var replaceButton = document.getElementById("replaceButton");
replaceButton.addEventListener("click", function (event) {
  event.preventDefault(); 
  redirectToAddPage(); 
});
