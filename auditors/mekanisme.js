import {
  CihuyDataAPI,
  CihuyPostApi,
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

import { getIdAmiFromURL } from "https://c-craftjs.github.io/simpelbi/paramurl.js";
import { populateUserProfile } from "https://c-craftjs.github.io/simpelbi/profile.js";


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


// Untuk Get Data Profile
populateUserProfile()

// Untuk Get All Data Mekanisme
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

// ADD MEKANISME

function postDataMekanisme(idAmi) {
  // Ambil data dari elemen-elemen formulir
  const question1 = document.getElementById("question1").value;
  const question2 = document.getElementById("question2").value;
  const question3 = document.getElementById("question3").value;
  const question4 = document.getElementById("question4").value;
  const question5 = document.getElementById("question5").value;
  const question6 = document.getElementById("question6").value;

  // Buat objek data JSON sesuai dengan body request yang diperlukan
  const mekanismeData = {
    question1: question1,
    question2: question2,
    question3: question3,
    question4: question4,
    question5: question5,
    question6: question6,
  };

  // Buat URL sesuai dengan ID AMI yang diberikan
  const url = `https://simbe-dev.ulbi.ac.id/api/v1/mekanisme/addbyami?id_ami=${encodeURIComponent(
    idAmi
  )}`;

  // Kirim permintaan POST dengan data mekanisme
  CihuyPostApi(url, token, mekanismeData)
    .then((responseText) => {
      console.log("Respon sukses:", responseText);
      // Lakukan tindakan lain setelah permintaan POST berhasil
      Swal.fire({
        icon: "success",
        title: "Sukses!",
        text: "Data mekanisme berhasil ditambahkan.",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        // Refresh halaman atau lakukan tindakan lain yang diperlukan
        window.location.back();
      });
    })
    .catch((error) => {
      console.error("Terjadi kesalahan:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Terjadi kesalahan saat menambahkan data mekanisme.",
      });
    });
}

// Tambahkan event listener untuk tombol "Simpan"
const simpanButton = document.getElementById("simpanButton");
simpanButton.addEventListener("click", function (e) {
  e.preventDefault();

  // Mendapatkan URL saat ini
  const idAmi = getIdAmiFromURL();

  // Periksa apakah 'id_ami' sudah ada
  if (idAmi) {
    // Panggil postDataMekanisme dengan 'id_ami' yang diperoleh dari URL
    postDataMekanisme(idAmi);
  } else {
    console.error("Parameter 'id_ami' tidak ditemukan dalam URL.");
    // Atau tampilkan pesan kesalahan kepada pengguna
  }
});
