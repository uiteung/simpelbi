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
function ShowDataAudit(data) {
  const tableBody = document.getElementById("content");
  tableBody.innerHTML = "";
  let nomor = 1;

  data.forEach((item) => {
    const barisBaru = document.createElement("tr");
    let statusClass = "";
    if (item.status === "Sudah Dilaksanakan") {
      statusClass = "success-button";
    } else if (item.status === "Belum Dilaksanakan") {
      statusClass = "custom-button";
    }

    // Isi kolom-kolom tabel dengan data yang diambil
    barisBaru.innerHTML = `
      
      <td>
          <div class="userDatatable-content">${item.ckp_lengkap}</div>
        </td>
        <td>
        <div class="userDatatable-content">${item.sebutkan}</div>
      </td>
      <td>
      <div class="userDatatable-content">${item.tgl}</div>
    </td>
      
        
      `;

    tableBody.appendChild(barisBaru);
    ambildatastandar(item.id_standar);
    ambildatakts(item.id_kts);
    nomor++;
  });
}

const currentURL = window.location.href;
const url = new URL(currentURL);
const id_ami = url.searchParams.get("id_ami");

if (id_ami) {
  const apiUrl = `https://simbe-dev.ulbi.ac.id/api/v1/kesimpulan/getbyami?id_ami=${id_ami}`;

  CihuyDataAPI(apiUrl, token, (error, response) => {
    if (error) {
      console.error("Terjadi kesalahan:", error);
    } else {
      const data = response.data;
      console.log("Data yang diterima:", data);
      ShowDataAudit([data]);
    }
  });
} else {
  console.log("Parameter id_ami tidak ditemukan dalam URL.");
}

const sistemDokumenSelect = document.getElementById("sistemDokumen");
const lainnyaInput = document.getElementById("lainnyaInput");
sistemDokumenSelect.addEventListener("change", function () {
  const selectedValue =
    sistemDokumenSelect.value === "Tidak" ||
    sistemDokumenSelect.value === "Lainnya";
  if (selectedValue) {
    lainnyaInput.style.display = "block";
  } else {
    lainnyaInput.style.display = "none";
  }
});

function postDataKesimpulan(idAmi, ckpLengkap, sebutkan) {
  // Ambil data dari elemen-elemen formulir

  // Buat URL sesuai dengan ID AMI yang diberikan
  const url = `https://simbe-dev.ulbi.ac.id/api/v1/kesimpulan/addbyami?id_ami=${encodeURIComponent(
    idAmi
  )}`;
  const kesimpulanData = {
    ckp_lengkap: ckpLengkap,
    sebutkan: sebutkan,
  };

  // Kirim permintaan POST dengan data mekanisme
  CihuyPostApi(url, token, kesimpulanData)
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
        window.history.back();
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

  // Mendapatkan 'id_ami' dari URL
  const idAmi = getIdAmiFromURL();

  // Mendapatkan pilihan dari dropdown
  const dropdown = document.getElementById("sistemDokumen");
  const ckpLengkap = dropdown.value;

  // Mendapatkan teks kesimpulan dari textarea
  const kesimpulanTextarea = document.getElementById("question2");
  const sebutkan = kesimpulanTextarea.value;

  postDataKesimpulan(idAmi, ckpLengkap, sebutkan);
});
