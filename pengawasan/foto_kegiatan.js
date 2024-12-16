import {
  CihuyDataAPI,
  //   CihuyPostApi,
  //   CihuyDeleteAPI,
  //   CihuyUpdateApi,
} from "https://c-craftjs.github.io/simpelbi/api.js";
import { token, UrlGetFoto } from "../js/template/template.js";
import { populateUserProfile } from "https://c-craftjs.github.io/simpelbi/profile.js";
import { CihuyPaginations } from "https://c-craftjs.github.io/simpelbi/pagenations.js";

// Untuk Get Data Profile
populateUserProfile();

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


// // Fungsi Untuk Get All data Audit
// function ShowDataAudit(data) {
//   const tableBody = document.getElementById("content");
//   tableBody.innerHTML = "";
//   let nomor = 1;

//   data.forEach((item) => {
//     const barisBaru = document.createElement("tr");
//     let statusClass = "";
//     if (item.status === "Sudah Dilaksanakan") {
//       statusClass = "success-button";
//     } else if (item.status === "Belum Dilaksanakan") {
//       statusClass = "custom-button";
//     }

//     // Isi kolom-kolom tabel dengan data yang diambil
//     barisBaru.innerHTML = `
//     <td>
//       <div class="userDatatable-content">${nomor}</div>
//     </td>
//         <td>
//             <div class="userDatatable-content">${item.fakultas}</div>
//           </td>
//           <td>
//           <div class="userDatatable-content">${item.prodi}</div>
//         </td>
//         <td>
//         <div class="userDatatable-content">
//         <img src="https://simbe-dev.ulbi.ac.id/static/pictures/${item.foto}" alt="Foto" width="100" height="100">
//         </div>
//       </td>
//       <td>
//           <div class="userDatatable-content">${item.auditor}</div>
//         </td>
//         <td>
//         <div class="userDatatable-content">${item.tgl}</div>
//       </td>
//       `;
//     tableBody.appendChild(barisBaru);
//     nomor++;
//   });
// }

const itemsPerPage = 3;

function dataFotoKegiatan(item, index) {
  return `
  <td>
    <div class="userDatatable-content">${index + 1}</div>
  </td>
      <td>
          <div class="userDatatable-content">${item.fakultas}</div>
        </td>
        <td>
        <div class="userDatatable-content">${item.prodi_unit}</div>
      </td>
      <td>
      <div class="userDatatable-content">          
      <img src="https://simbe-dev.ulbi.ac.id/static/pictures/${
        item.foto
      }" alt="Foto" width="100" height="100">
      </div>
    </td>
    <td>
        <div class="userDatatable-content">${item.auditor}</div>
      </td>
      <td>
      <div class="userDatatable-content">${item.tgl}</div>
    </td>        
    `;
}

CihuyDataAPI(UrlGetFoto, token, (error, response) => {
  if (error) {
    console.error("Terjadi kesalahan:", error);
  } else {
    const data = response.data;
    console.log("Data yang diterima:", data);
    // ShowDataAudit(data);
    CihuyPaginations(data, itemsPerPage, "content", dataFotoKegiatan, 1, 5);
  }
});
