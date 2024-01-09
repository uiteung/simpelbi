import {
  CihuyDataAPI,
  // CihuyPostApi,
  //   CihuyDeleteAPI,
  CihuyUpdateApi,
} from "https://c-craftjs.github.io/simpelbi/api.js";
import {
  token,
  UrlGetKts,
  //   UrlGetUsersFakultas,
  //   UrlGetJenjang,
  //   UrlGetSiklus,
} from "../js/template/template.js";
function setupFormVisibility() {
  var jawabanSelect = document.getElementById("jawabanindikator");
  jawabanSelect.addEventListener("change", function () {
    var selectedValue = jawabanSelect.value;
    var formElementsToHide = document.querySelectorAll(".form-group-to-hide");
    formElementsToHide.forEach(function (element) {
      if (selectedValue === "Tidak") {
        element.style.visibility = "hidden"; // Menyembunyikan elemen
      } else {
        element.style.visibility = "visible";
      }
    });
  });
}

import { populateUserProfile } from "https://c-craftjs.github.io/simpelbi/profile.js";

// Untuk Get Data Profile
populateUserProfile();

const urlParams = new URLSearchParams(window.location.search);
const idAmi = urlParams.get("id_ami");
const apiUrl = `https://simbe-dev.ulbi.ac.id/api/v1/audit/getbyami?id_ami=${idAmi}`;
const apiUpdateUrl = `https://simbe-dev.ulbi.ac.id/api/v1/audit/updatebyami?id_ami=${idAmi}`;

const handleApiResponse = (error, data) => {
  if (error) {
    console.error("Error fetching data:", error);
  } else {
    console.log("Data received:", data);
  }
};

// Panggil fungsi CihuyDataAPI dengan parameter yang sesuai
CihuyDataAPI(apiUrl, token, handleApiResponse);

document.addEventListener("DOMContentLoaded", function () {
  setupFormVisibility();
});

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
        option.value = item.id_ami;
        option.textContent = item.isi_standar;
        dropdown.appendChild(option);
      });
    }
  });
}

function indikatorDropdown(apiUrl, dropdownId) {
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
        option.value = item.id_ami;
        option.textContent = item.isi_indikator;
        dropdown.appendChild(option);
      });
    }
  });
}
function ktsdropdown(apiUrl, dropdownId) {
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
        option.value = item.id_ami;
        option.textContent = item.kts;
        dropdown.appendChild(option);
      });
    }
  });
}
populateDropdownStandar(apiUrl, "id_standar");
indikatorDropdown(apiUrl, "indikator");
ktsdropdown(UrlGetKts, "id_kts");

document.addEventListener("DOMContentLoaded", function () {
  // Menangkap elemen tombol simpan
  let simpanButton = document.getElementById("simpanButton");

  // Menambahkan event listener untuk menanggapi klik pada tombol simpan
  simpanButton.addEventListener("click", function () {
    // Mendapatkan nilai dari elemen select dengan id jawabanindikator
    let jawabanSelect = document.getElementById("jawabanindikator");
    let jawabanValue = jawabanSelect.value;

    // Membuat objek data untuk dikirimkan ke fungsi CihuyUpdateApi
    let updateData = null;

    // Jika jawaban adalah "ya"
    if (jawabanValue === "ya") {
      let id_kts = document.getElementById("id_kts").value;
      let uraian = document.getElementById("uraian").value;
      let tindakan = document.getElementById("tindakan").value;
      let target = document.getElementById("target").value;

      // Mengisi objek data untuk jawaban "ya"
      updateData = {
        id_kts: id_kts,
        uraian: uraian,
        tindakan: tindakan,
        target: target,
      };
    }

    // Memanggil fungsi CihuyUpdateApi untuk mengirim pembaruan
    CihuyUpdateApi(apiUpdateUrl, token, updateData, function (error, result) {
      if (error) {
        console.error("Error updating data:", error);
      } else {
        console.log("Data updated successfully:", result);
      }
    });
  });
});
