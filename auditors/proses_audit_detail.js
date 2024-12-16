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
        element.style.visibility = "hidden";
      } else {
        element.style.visibility = "visible";
      }
    });
  });
}

import { populateUserProfile } from "https://c-craftjs.github.io/simpelbi/profile.js";

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
      updateAuditData();
    }
  });
});

function collectData() {
  const jawabanValue = document.getElementById("jawabanindikator").value;
  return {
    id_standar:
      jawabanValue === "Ya"
        ? null
        : parseInt(document.getElementById("id_standar").value),
    indikator:
      jawabanValue === "Ya" ? null : document.getElementById("indikator").value,
    id_kts:
      jawabanValue === "Ya"
        ? null
        : parseInt(document.getElementById("id_kts").value),
    jawaban: jawabanValue,
    uraian:
      jawabanValue === "Ya" ? null : document.getElementById("uraian").value,
    tindakan:
      jawabanValue === "Ya"
        ? null
        : document.getElementById("tindakPerbaikan").value,
    target:
      jawabanValue === "Ya" ? null : document.getElementById("target").value,
    status: document.getElementById("status").value,
  };
}

function updateAuditData() {
  const idAudit = urlParams.get("id_audit");
  const apiUrl = `https://simbe-dev.ulbi.ac.id/api/v1/audit/update?id_audit=${idAudit}`;
  const data = collectData();
  fetch(apiUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      LOGIN: `${token}`, // Assuming token is globally available
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((response) => {
      console.log(response);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Audit data updated successfully.",
        showConfirmButton: true,
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.value) {
          redirectToNewLocation();
        }
      });
    })
    .catch((error) => {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to update data.",
      });
    });
}

function redirectToNewLocation() {
  const queryParams = new URLSearchParams(window.location.search);
  const id_ami = queryParams.get("id_ami");
  const id_prodi_unit = queryParams.get("id_prodi_unit");
  const newUrl = `https://euis.ulbi.ac.id/simpelbi/auditors/pengawasan-audit.html?id_ami=${id_ami}&id_prodi_unit=${id_prodi_unit}`;
  window.location.href = newUrl;
}

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
