import {
  CihuyDataAPI,
  CihuyPostApi,
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
      if (selectedValue === "Ya") {
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
const idAudit = urlParams.get("id_audit");
// const apiUrl = `https://simbe-dev.ulbi.ac.id/api/v1/audit/getbyami?id_ami=${idAmi}`;
// const apiUrl = `https://simbe-dev.ulbi.ac.id/api/v1/standar/getbyprodiunit?id_prodi_unit=${idProdiUnit}`;
const apiUrl = `https://simbe-dev.ulbi.ac.id/api/v1/audit/getallbyami?id_ami=${idAmi}`;

const apiUpdateUrl = `https://simbe-dev.ulbi.ac.id/api/v1/audit/addbyami?id_ami=${idAmi}`;
const apiUrlProdiUnit = `https://simbe-dev.ulbi.ac.id/api/v1/audit/get?id_audit=${idAudit}`;

const handleApiResponse = (error, data) => {
  if (error) {
    console.error("Error fetching data:", error);
  } else {
    console.log("Data received:", data);
  }
};
document.getElementById("buttoninsert").addEventListener("click", function () {
  // Show a confirmation dialog with SweetAlert
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, save it!",
  }).then((result) => {
    if (result.isConfirmed) {
      // Retrieve form values
      const idStandar = document.getElementById("id_standar").value;
      const indikator = document.getElementById("indikator").value;
      const jawabanValue = document.getElementById("jawabanindikator").value;
      const idKts = document.getElementById("id_kts").value;
      const uraian = document.getElementById("uraian").value;
      const tindakPerbaikan = document.getElementById("tindakPerbaikan").value;
      const targetWaktuPerbaikan = document.getElementById("target").value;

      // Construct the data object
      let data = null;

      if (jawabanValue === "Ya") {
        data = {
          id_standar: parseInt(idStandar),
          id_kts: parseInt(idKts),
          jawaban_indikator: jawabanValue,
          uraian: null,
          tindakan: null,
          target: null,
        };
      } else {
        data = {
          id_standar: parseInt(idStandar),
          indikator: indikator,
          jawaban_indikator: jawabanValue,
          id_kts: parseInt(idKts),
          uraian: uraian,
          tindakan: tindakPerbaikan,
          target: targetWaktuPerbaikan,
        };
      }

      const apiUrl = `https://simbe-dev.ulbi.ac.id/api/v1/audit/update?id_audit=${idAudit}`;

      // Call the CihuyUpdateApi function
      CihuyUpdateApi(apiUrl, token, data, (error, response) => {
        if (error) {
          // Handle errors
          console.error(error);
          // Show error message using SweetAlert
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: "Failed to update data.",
          });
        } else {
          // Handle the response as needed
          console.log(response);

          // Show success message using SweetAlert
          Swal.fire({
            icon: "success",
            title: "Sukses!",
            text: "Data audit berhasil diperbarui.",
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            // Refresh halaman atau lakukan tindakan lain jika diperlukan
            const redirectUrl = `https://euis.ulbi.ac.id/simpelbi/auditors/dashboard-auditor.html`;
            window.location.href = redirectUrl;
            // window.location.href = "";
          });
        }
      });
    }
  });
});

// Panggil fungsi CihuyDataAPI dengan parameter yang sesuai
CihuyDataAPI(apiUrl, token, handleApiResponse);

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
        option.value = item.id_kts;
        option.textContent = `${item.id_kts}. ${item.kts}`;
        dropdown.appendChild(option);
      });
    }
  });
}

function standarDropdown(apiUrlProdiUnit, dropdownId) {
  const dropdown = document.getElementById(dropdownId);

  // Assuming CihuyDataAPI is an asynchronous function
  CihuyDataAPI(apiUrlProdiUnit, token, (error, data) => {
    if (error) {
      console.error("Terjadi kesalahan:", error);
    } else {
      // Bersihkan dropdown
      dropdown.innerHTML = "";

      // Isi dropdown dengan opsi-opsi dari data API
      const option = document.createElement("option");
      option.value = data.data.id_standar;
      option.textContent = `${data.data.isi_standar}`;
      dropdown.appendChild(option);
    }
  });
}

function indikatorDropdown(apiUrlProdiUnit, dropdownId) {
  const dropdown = document.getElementById(dropdownId);

  // Assuming CihuyDataAPI is an asynchronous function
  CihuyDataAPI(apiUrlProdiUnit, token, (error, data) => {
    if (error) {
      console.error("Terjadi kesalahan:", error);
    } else {
      // Bersihkan dropdown
      dropdown.innerHTML = "";

      // Isi dropdown dengan opsi-opsi dari data API
      const option = document.createElement("option");
      option.value = data.data.id_indikator;
      option.textContent = `${data.data.isi_indikator}`;
      dropdown.appendChild(option);
    }
  });
}

// indikatorDropdown(UrlGetStandar, "indikator");

indikatorDropdown(apiUrlProdiUnit, "indikator");

standarDropdown(apiUrlProdiUnit, "id_standar");
ktsdropdown(UrlGetKts, "id_kts");
