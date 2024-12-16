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
// import { UrlGetAudit } from "../js/template/template.js";
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


// Untuk Get All Data Audit
document.addEventListener("DOMContentLoaded", function () {
  // Tempatkan seluruh kode Anda di sini
  const currentURL = window.location.href;
  const url = new URL(currentURL);
  const id_ami = url.searchParams.get("id_ami");
  const itemsPerPage = 4;

  function dataProsesAudit(item, index) {
    let statusClass = ""; // Definisikan statusClass sesuai logika bisnis Anda
    if (item.status === "Closed") {
      statusClass = "success-button";
    } else if (item.status === "Opened") {
      statusClass = "custom-button";
    } else if (item.status === "Ada Perbaikan") {
      statusClass = "fix-button";
    }

    return `
    <td>
      <div class="userDatatable-content">${index + 1}</div>
    </td>
    <td>
      <div class="userDatatable-content">${item.standar}</div>
    </td>
    <td>
      <div class="userDatatable-content">${item.isi_standar}</div>
    </td>
    <td>
    <div class="userDatatable-content">${
      item.kts ? item.kts : "belum ada kts"
    }</div>
    </td>
    <td>
      <div class="userDatatable-content">${item.uraian}</div>
    </td>
    <td>
      <div class="userDatatable-content">${item.tindakan}</div>
    </td>
    <td>
      <div class="userDatatable-content">${item.target}</div>
    </td>
    <td>
      <div class="userDatatable-content">
        <span class="${statusClass}">${item.status}</span>
      </div>
    </td>
  `;
  }
  if (id_ami) {
    const apiUrl = `https://simbe-dev.ulbi.ac.id/api/v1/audit/getallbyami?id_ami=${id_ami}`;

    CihuyDataAPI(apiUrl, token, (error, response) => {
      if (error) {
        console.error("Terjadi kesalahan:", error);
      } else {
        const data = response.data;
        console.log("Data yang diterima:", data);

        CihuyPaginations(data, itemsPerPage, "content", dataProsesAudit, 1, 5);
      }
    });
  } else {
    console.log("Parameter id_ami tidak ditemukan dalam URL.");
  }
});

// function ambildatastandar(id_standar) {
//   const apiUrl = `https://simbe-dev.ulbi.ac.id/api/v1/standar/get?id_standar=${id_standar}`;
//   CihuyDataAPI(apiUrl, token, (error, response) => {
//     if (error) {
//       console.error("Terjadi kesalahan:", error);
//     } else {
//       const standarData = response.data;
//       console.log("Data Standar yang diterima:", standarData);

//       const standarContents = document.querySelectorAll(
//         `[data-id-standar="${standarData.id_standar}"]`
//       );
//       standarContents.forEach((standarContent) => {
//         standarContent.textContent = standarData.standar;
//       });

//       const standarisi = document.querySelectorAll(
//         `[data-id-standarisi="${standarData.id_kts}"]`
//       );
//       standarisi.forEach((standarContent) => {
//         standarContent.textContent = standarData.isi;
//       });
//     }
//   });
// }
// function ambildatakts(id_kts) {
//   const apiUrl = `https://simbe-dev.ulbi.ac.id/api/v1/kts/get?idkts=${id_kts}`;
//   CihuyDataAPI(apiUrl, token, (error, response) => {
//     if (error) {
//       console.error("Terjadi kesalahan:", error);
//     } else {
//       const standarData = response.data;
//       console.log("Data kts yang diterima:", standarData);

//       const idKTSContents = document.querySelectorAll(
//         `[data-id-kts="${standarData.id_kts}"]`
//       );
//       idKTSContents.forEach((contentKts) => {
//         contentKts.textContent = standarData.kts;
//       });
//     }
//   });
// }

// const currentURL = window.location.href;
// const url = new URL(currentURL);
// const id_ami = url.searchParams.get("id_ami");

// if (id_ami) {
//   const apiUrl = `https://simbe-dev.ulbi.ac.id/api/v1/audit/getbyami?id_ami=${id_ami}`;

//   CihuyDataAPI(apiUrl, token, (error, response) => {
//     if (error) {
//       console.error("Terjadi kesalahan:", error);
//     } else {
//       const data = response.data;
//       console.log("Data yang diterima:", data);
//       ShowDataAudit(data);
//     }
//   });
// } else {
//   console.log("Parameter id_ami tidak ditemukan dalam URL.");
// }
