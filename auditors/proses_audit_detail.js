import {
  CihuyDataAPI,
  CihuyPostApi,
  CihuyUpdateApi,
} from "https://c-craftjs.github.io/simpelbi/api.js";
import { token, UrlGetKts, UrlGetStandar } from "../js/template/template.js";

// Fungsi fetch dengan header LOGIN secara konsisten
async function fetchWithLoginHeader(url, options = {}) {
  const headers = {
    LOGIN: token, // Pastikan token terisi dengan benar
    "Content-Type": "application/json",
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return await response.json();
}

// Setup untuk menampilkan/menyembunyikan elemen form berdasarkan jawaban
function setupFormVisibility() {
  const jawabanSelect = document.getElementById("jawabanindikator");
  jawabanSelect.addEventListener("change", function () {
    const selectedValue = jawabanSelect.value;
    const formElementsToHide = document.querySelectorAll(".form-group-to-hide");
    formElementsToHide.forEach(function (element) {
      element.style.visibility = selectedValue === "Ya" ? "hidden" : "visible";
    });
  });
}

// Mengambil URL parameter untuk id
const urlParams = new URLSearchParams(window.location.search);
const idAmi = urlParams.get("id_ami");
const idAudit = urlParams.get("id_audit");

// API URL
const apiUrl = `https://simbe-dev.ulbi.ac.id/api/v1/audit/get?id_audit=${idAudit}`;
const apiUpdateUrl = `https://simbe-dev.ulbi.ac.id/api/v1/audit/update?id_audit=${idAudit}`;

// Fungsi untuk mengambil data audit dari API
function fetchAuditData() {
  fetchWithLoginHeader(apiUrl)
    .then((data) => handleApiResponse(null, data))
    .catch((error) => handleApiResponse(error, null));
}

// Callback untuk menangani data audit
function handleApiResponse(error, data) {
  if (error) {
    console.error("Error fetching data:", error);
  } else {
    console.log("Data received:", data);

    // Perbarui nilai pada form
    document.getElementById("uraian").value = data.data.uraian || "";
    document.getElementById("tindakPerbaikan").value = data.data.tindakan || "";
    document.getElementById("target").value = data.data.target || "";
    document.getElementById("status").value = data.data.status || "";
    document.getElementById("jawabanindikator").value =
      data.data.jawaban || "Tidak";

    // Perbarui dropdown real-time
    document.getElementById("id_standar").value = data.data.id_standar || "";
    document.getElementById("indikator").value = data.data.indikator || "";
    document.getElementById("id_kts").value = data.data.id_kts || "";
  }
}

// Fungsi untuk mengumpulkan data dari form
function collectData() {
  return {
    id_standar: parseInt(document.getElementById("id_standar").value),
    indikator: document.getElementById("indikator").value,
    id_kts: parseInt(document.getElementById("id_kts").value),
    jawaban: document.getElementById("jawabanindikator").value,
    uraian: document.getElementById("uraian").value,
    tindakan: document.getElementById("tindakPerbaikan").value,
    target: document.getElementById("target").value,
    status: document.getElementById("status").value,
  };
}

// Fungsi untuk mengupdate data audit melalui API
function updateAuditData() {
  const data = collectData();
  fetchWithLoginHeader(apiUpdateUrl, {
    method: "PUT",
    body: JSON.stringify(data),
  })
    .then((response) => {
      console.log("Update Response:", response);
      if (response.success) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Audit data updated successfully.",
        }).then((result) => {
          if (result.isConfirmed) {
            redirectToNewLocation();
          }
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: response.message || "Failed to update data.",
        });
      }
    })
    .catch((error) => {
      console.error("Error updating audit data:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to update data.",
      });
    });
}

// Fungsi redirect ke halaman lain setelah data berhasil diperbarui
function redirectToNewLocation() {
  const idProdiUnit = urlParams.get("id_prodi_unit");
  const newUrl = `https://euis.ulbi.ac.id/simpelbi/auditors/pengawasan-audit.html?id_ami=${idAmi}&id_prodi_unit=${idProdiUnit}`;
  window.location.href = newUrl;
}

// Event listener untuk tombol submit
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

// Fungsi untuk inisialisasi dropdown
function ktsdropdown(apiUrl, dropdownId) {
  const dropdown = document.getElementById(dropdownId);
  fetchWithLoginHeader(apiUrl)
    .then((data) => {
      dropdown.innerHTML = "";
      data.data.forEach((item) => {
        const option = document.createElement("option");
        option.value = item.id_kts;
        option.textContent = `${item.id_kts}. ${item.kts}`;
        dropdown.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("Error fetching dropdown data:", error);
    });
}

function standarDropdown(apiUrlProdiUnit, dropdownId) {
  const dropdown = document.getElementById(dropdownId);
  fetchWithLoginHeader(apiUrlProdiUnit)
    .then((data) => {
      dropdown.innerHTML = "";
      const option = document.createElement("option");
      option.value = data.data.id_standar;
      option.textContent = data.data.isi_standar || "Pilih Standar";
      dropdown.appendChild(option);
    })
    .catch((error) => {
      console.error("Error fetching dropdown data:", error);
    });
}

function indikatorDropdown(apiUrlProdiUnit, dropdownId) {
  const dropdown = document.getElementById(dropdownId);
  fetchWithLoginHeader(apiUrlProdiUnit)
    .then((data) => {
      dropdown.innerHTML = "";
      const option = document.createElement("option");
      option.value = data.data.id_indikator;
      option.textContent = data.data.isi_indikator || "Pilih Indikator";
      dropdown.appendChild(option);
    })
    .catch((error) => {
      console.error("Error fetching dropdown data:", error);
    });
}

// Panggil fungsi saat halaman selesai dimuat
document.addEventListener("DOMContentLoaded", function () {
  if (!token || token.trim() === "") {
    console.error("Error: LOGIN token is missing or invalid.");
    Swal.fire({
      icon: "error",
      title: "Authentication Error",
      text: "LOGIN token is missing or invalid. Please re-authenticate.",
    });
    return;
  }

  setupFormVisibility();
  fetchAuditData();
  ktsdropdown(UrlGetKts, "id_kts");
  standarDropdown(apiUrl, "id_standar");
  indikatorDropdown(apiUrl, "indikator");
});
