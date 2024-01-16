import {
  CihuyDataAPI,
  // CihuyPostApi,
  //   CihuyDeleteAPI,
  CihuyUpdateApi,
} from "https://c-craftjs.github.io/simpelbi/api.js";
import {
  token,
  UrlGetKts,
  UrlGetStandar,
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
const idProdiUnit = urlParams.get("id_prodi_unit");
// const apiUrl = `https://simbe-dev.ulbi.ac.id/api/v1/audit/getbyami?id_ami=${idAmi}`;
const apiUrlProdiUnit = `https://simbe-dev.ulbi.ac.id/api/v1/standar/getbyprodiunit?id_prodi_unit=${idProdiUnit}`;

const apiUpdateUrl = `https://simbe-dev.ulbi.ac.id/api/v1/audit/addbyami?id_ami=${idAmi}`;

const handleApiResponse = (error, data) => {
  if (error) {
    console.error("Error fetching data:", error);
  } else {
    console.log("Data received:", data);
  }
};

// Panggil fungsi CihuyDataAPI dengan parameter yang sesuai
CihuyDataAPI(apiUrlProdiUnit, token, handleApiResponse);

document.addEventListener("DOMContentLoaded", function () {
  setupFormVisibility();
});

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

function standarDropdown(apiUrlProdiUnit, dropdownId) {
  const dropdown = document.getElementById(dropdownId);

  CihuyDataAPI(apiUrlProdiUnit, token, (error, response) => {
    if (error) {
      console.error("Terjadi kesalahan:", error);
    } else {
      // Bersihkan dropdown
      dropdown.innerHTML = "";

      // Isi dropdown dengan opsi-opsi dari data API
      response.data.forEach((item, index) => {
        const option = document.createElement("option");
        option.value = item.id_prodi_unit;
        option.textContent = `${index + 1}. ${item.standar}`;
        dropdown.appendChild(option);
      });
    }
  });
}

function indikatorDropdown(apiUrlProdiUnit, dropdownId) {
  const dropdown = document.getElementById(dropdownId);

  CihuyDataAPI(apiUrlProdiUnit, token, (error, response) => {
    if (error) {
      console.error("Terjadi kesalahan:", error);
    } else {
      // Bersihkan dropdown
      dropdown.innerHTML = "";

      // Isi dropdown dengan opsi-opsi dari data API
      response.data.forEach((item, index) => {
        const option = document.createElement("option");
        option.value = item.id_prodi_unit;
        option.textContent = `${index + 1}. ${item.isi_indikator}`;
        dropdown.appendChild(option);
      });
    }
  });
}
// indikatorDropdown(UrlGetStandar, "indikator");

indikatorDropdown(apiUrlProdiUnit, "indikator");

standarDropdown(apiUrlProdiUnit, "id_standar");
ktsdropdown(UrlGetKts, "id_kts");
document.addEventListener("DOMContentLoaded", function () {
  // Menangkap elemen tombol simpan
  let simpanButton = document.getElementById("buttoninsert");

  // Menambahkan event listener untuk menanggapi klik pada tombol simpan
  simpanButton.addEventListener("click", function () {
    console.log("Button clicked!");

    // Mendapatkan nilai dari elemen select dengan id jawabanindikator
    let jawabanSelect = document.getElementById("jawabanindikator");
    let jawabanValue = jawabanSelect.value;

    // Jika jawaban adalah "ya"
    if (jawabanValue === "tidak") {
      let id_standar = document.getElementById("id_standar").value;
      let id_kts = document.getElementById("id_kts").value;
      let uraian = document.getElementById("uraian").value;
      let tindakan = document.getElementById("tindakan").value;
      let target = document.getElementById("target").value;

      // Validation: Check if required fields are not empty
      if (!id_standar || !id_kts || !uraian || !tindakan || !target) {
        console.error("Please fill in all required fields");
        return;
      }

      // Mengisi objek data untuk jawaban "ya"
      let updateData = {
        id_standar: parseInt(id_standar),
        id_kts: parseInt(id_kts),
        uraian: uraian,
        tindakan: tindakan,
        target: target,
      };

      // Memanggil fungsi CihuyPostApi untuk mengirim data dengan metode POST
      CihuyPostApi(apiUpdateUrl, token, updateData)
        .then((result) => {
          console.log("Data updated successfully:", result);
          // Add any additional logic after a successful update
        })
        .catch((error) => {
          console.error("Error updating data:", error);
        });
    }
  });
});
