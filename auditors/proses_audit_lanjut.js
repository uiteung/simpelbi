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
import { CihuyNavigateBack } from "https://c-craftjs.github.io/simpelbi/navigasi.js";

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
        <div class="userDatatable-content">${nomor}</div>
      </td>
      <td>
  <a href="pengawasan-kesimpulan.html?id_ami=${item.id_ami}" class="${statusClass}" data-id-ami="${item.id_ami}">
    ${item.status}
  </a>
</td>
      <td>
      <div class="userDatatable-content" data-id-standar="${item.standar}"></div>
      </td>
      <td>
      <div class="userDatatable-content" data-id-standarisi="${item.standar}"></div>

      </td>
      <td>
      <div class="userDatatable-content" data-id-kts="${item.id_kts}"></div>
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
     
    
      
    `;

    tableBody.appendChild(barisBaru);
    ambildatastandar(item.id_standar);
    ambildatakts(item.id_kts);
    nomor++;
  });
} // Dapatkan semua elemen tombol

function ambildatastandar(id_standar) {
  const apiUrl = `https://simbe-dev.ulbi.ac.id/api/v1/standar/get?idstandar=${id_standar}`;
  CihuyDataAPI(apiUrl, token, (error, response) => {
    if (error) {
      console.error("Terjadi kesalahan:", error);
    } else {
      const standarData = response.data;
      console.log("Data Standar yang diterima:", standarData);

      const standarContents = document.querySelectorAll(
        `[data-id-standar="${standarData.id_standar}"]`
      );
      standarContents.forEach((standarContent) => {
        standarContent.textContent = standarData.standar;
      });

      const standarisi = document.querySelectorAll(
        `[data-id-standarisi="${standarData.id_kts}"]`
      );
      standarisi.forEach((standarContent) => {
        standarContent.textContent = standarData.isi;
      });
    }
  });
}
function ambildatakts(id_kts) {
  const apiUrl = `https://simbe-dev.ulbi.ac.id/api/v1/kts/get?idkts=${id_kts}`;
  CihuyDataAPI(apiUrl, token, (error, response) => {
    if (error) {
      console.error("Terjadi kesalahan:", error);
    } else {
      const standarData = response.data;
      console.log("Data kts yang diterima:", standarData);

      const idKTSContents = document.querySelectorAll(
        `[data-id-kts="${standarData.id_kts}"]`
      );
      idKTSContents.forEach((contentKts) => {
        contentKts.textContent = standarData.kts;
      });
    }
  });
}

const currentURL = window.location.href;
const url = new URL(currentURL);
const id_ami = url.searchParams.get("id_ami");

if (id_ami) {
  const apiUrl = `https://simbe-dev.ulbi.ac.id/api/v1/audit/getbyami?id_ami=${id_ami}`;

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

// Fungsi untuk mengisi dropdown menggunakan CihuyDataAPI
function populateDropdownStandar(apiUrl, dropdownId) {
  const dropdown = document.getElementById(dropdownId);

  CihuyDataAPI(apiUrl, token, (error, response) => {
    if (error) {
      console.error("Terjadi kesalahan:", error);
    } else {
      // Bersihkan dropdown
      dropdown.innerHTML = "";

      // Isi dropdown dengan opsi-opsi dari data API
      response.data.forEach((item) => {
        const option = document.createElement("option");
        option.value = item.idStandar;
        option.textContent = item.standar;
        dropdown.appendChild(option);
      });
    }
  });
}

// Fungsi untuk mengisi dropdown menggunakan CihuyDataAPI
function populateDropdownKTS(apiUrl, dropdownId) {
  const dropdown = document.getElementById(dropdownId);

  CihuyDataAPI(apiUrl, token, (error, response) => {
    if (error) {
      console.error("Terjadi kesalahan:", error);
    } else {
      // Bersihkan dropdown
      dropdown.innerHTML = "";

      // Isi dropdown dengan opsi-opsi dari data API
      response.data.forEach((item) => {
        const option = document.createElement("option");
        option.value = item.id_kts;
        option.textContent = item.kts;
        dropdown.appendChild(option);
      });
    }
  });
}

// Panggil fungsi populateDropdown untuk "Butir Standar" dan "Temuan KTS"
const standarApiUrl = "https://simbe-dev.ulbi.ac.id/api/v1/standar/";
const ktsApiUrl = "https://simbe-dev.ulbi.ac.id/api/v1/kts/";

populateDropdownStandar(standarApiUrl, "idStandar");
populateDropdownKTS(ktsApiUrl, "idKts");

//post data di tambah data audit
// Dapatkan elemen-elemen formulir
const idStandarSelect = document.getElementById("idStandar");
const idKtsSelect = document.getElementById("idKts");
const uraianInput = document.getElementById("uraian");
const tindakanInput = document.getElementById("tindakan");
const targetInput = document.getElementById("target");

// Dapatkan tombol "Simpan Data"
const simpanButton = document.getElementById("simpanButton");

// Tambahkan event listener untuk tombol "Simpan Data"
simpanButton.addEventListener("click", function (e) {
  e.preventDefault();

  // Dapatkan nilai dari elemen-elemen formulir
  const idStandar = idStandarSelect.value;
  const idKts = idKtsSelect.value;
  const uraian = uraianInput.value;
  const tindakan = tindakanInput.value;
  const target = targetInput.value;

  // Buat objek data yang akan dikirim
  const postData = {
    id_standar: parseInt(idStandar),
    id_kts: parseInt(idKts),
    uraian: uraian,
    tindakan: tindakan,
    target: target,
  };

  const url = `https://simbe-dev.ulbi.ac.id/api/v1/audit/addbyami?id_ami=${getIdAmiFromURL()}`;

  // Kirim permintaan POST dengan data yang sesuai
  CihuyPostApi(url, token, postData)
    .then((responseText) => {
      console.log("Respon sukses:", responseText);
      // Lakukan tindakan lain setelah permintaan POST berhasil
      Swal.fire({
        icon: "success",
        title: "Sukses!",
        text: "Data berhasil ditambahkan.",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        // Refresh halaman atau lakukan tindakan lain yang diperlukan
        CihuyNavigateBack();
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

document.getElementById("addbutton").addEventListener("click", function () {
  const idAmi = getIdAmiFromURL();
  if (idAmi) {
    window.location.href = `pengawasan-audit-add.html?id_ami=${idAmi}`;
  } else {
    alert("Parameter 'id_ami' tidak ditemukan dalam URL");
  }
});
