import {
  CihuyDataAPI,
  CihuyPostApi,
  CihuyUpdateApi,
} from "https://c-craftjs.github.io/simpelbi/api.js";
import { token, UrlGetKts, UrlGetStandar } from "../js/template/template.js";
import { populateUserProfile } from "https://c-craftjs.github.io/simpelbi/profile.js";

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

// Fungsi untuk mengupdate jawaban indikator
function updateJawabanIndikator(value) {
  const jawabanSelect = document.getElementById("jawabanindikator");

  if (value !== undefined) {
    jawabanSelect.value = value;
  }
  syncWithJawabanIndikator(jawabanSelect.value);
}

// Sinkronisasi logika berdasarkan jawaban indikator
function syncWithJawabanIndikator(currentValue) {
  const formElementsToHide = document.querySelectorAll(".form-group-to-hide");
  formElementsToHide.forEach((element) => {
    element.style.visibility = currentValue === "Tidak" ? "hidden" : "visible";
  });
}

// Event listener untuk perubahan dropdown
function setupFormVisibility() {
  const jawabanSelect = document.getElementById("jawabanindikator");
  jawabanSelect.addEventListener("change", function () {
    updateJawabanIndikator(jawabanSelect.value);
  });
}

// URL parameter untuk mendapatkan id
const urlParams = new URLSearchParams(window.location.search);
const idAmi = urlParams.get("id_ami");
const idAudit = urlParams.get("id_audit");
const idProdiUnit = urlParams.get("id_prodi_unit");
const apiUrl = `https://simbe-dev.ulbi.ac.id/api/v1/audit/get?id_audit=${idAudit}`;

// Callback untuk API response
function handleApiResponse(error, data) {
  if (error) {
    console.error("Error fetching data:", error);
  } else {
    console.log("Data received:", data);
    const auditData = data.data;

    document.getElementById("jawabanindikator").value =
      auditData.jawaban || "Ya";
    document.getElementById("link_perbaikan").value =
      auditData.link_perbaikan || "";

    syncWithJawabanIndikator(auditData.jawaban);
  }
}

// Mengambil data audit secara realtime
function fetchAuditDataRealtime() {
  fetchWithLoginHeader(apiUrl)
    .then((data) => handleApiResponse(null, data))
    .catch((error) => handleApiResponse(error, null));
}

// Fungsi validasi URL
function isValidURL(url) {
  const pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protokol
      "((([a-zA-Z0-9-]+)\\.)+([a-zA-Z]{2,})|" + // domain
      "localhost|" + // atau localhost
      "\\d{1,3}(\\.\\d{1,3}){3})" + // atau IP
      "(:\\d+)?(\\/[-a-zA-Z0-9%_.~+]*)*" + // port dan path
      "(\\?[;&a-zA-Z0-9%_.~+=-]*)?" + // query string
      "(#[-a-zA-Z0-9_]*)?$", // fragment locator
    "i"
  );
  return pattern.test(url);
}

// Fungsi untuk mengumpulkan data dari form untuk update
function collectData() {
  const jawabanValue = document.getElementById("jawabanindikator").value;
  const linkPerbaikan = document.getElementById("link_perbaikan").value.trim();

  // Validasi jika jawaban "Ya" dan link_perbaikan tidak valid
  if (jawabanValue === "Ya" && (!linkPerbaikan || !isValidURL(linkPerbaikan))) {
    Swal.fire({
      icon: "error",
      title: "Invalid Link!",
      text: "Please provide a valid link for improvement.",
    });
    return null; // Hentikan proses jika validasi gagal
  }

  return {
    id_standar: null,
    indikator: null,
    id_kts: null,
    jawaban: jawabanValue,
    uraian: null,
    tindakan: null,
    target: null,
    status: "Open",
    link_perbaikan: jawabanValue === "Ya" ? linkPerbaikan || null : null,
  };
}

// Update data audit secara realtime
function updateAuditData() {
  const data = collectData();
  if (!data) return; // Hentikan jika validasi gagal

  const apiUpdateUrl = `https://simbe-dev.ulbi.ac.id/api/v1/audit/update?id_audit=${idAudit}`;

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
        }).then(() => {
          redirectToNewLocation();
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
  const newUrl = `https://euis.ulbi.ac.id/simpelbi/prodi/pengawasan-audit.html?id_ami=${idAmi}&id_prodi_unit=${idProdiUnit}`;
  window.location.href = newUrl;
}

// Event listener untuk tombol insert
const buttonInsert = document.getElementById("buttoninsert");
buttonInsert.addEventListener("click", function () {
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

// Inisialisasi dropdown untuk real-time data
function ktsDropdown(apiUrl, dropdownId) {
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
    .catch((error) => console.error("Error fetching dropdown data:", error));
}

function standarDropdown(apiUrl, dropdownId) {
  const dropdown = document.getElementById(dropdownId);
  fetchWithLoginHeader(apiUrl)
    .then((data) => {
      dropdown.innerHTML = "";
      const option = document.createElement("option");
      option.value = data.data.id_standar;
      option.textContent = data.data.isi_standar || "Pilih Standar";
      dropdown.appendChild(option);
    })
    .catch((error) => console.error("Error fetching dropdown data:", error));
}

function indikatorDropdown(apiUrl, dropdownId) {
  const dropdown = document.getElementById(dropdownId);
  fetchWithLoginHeader(apiUrl)
    .then((data) => {
      dropdown.innerHTML = "";
      const option = document.createElement("option");
      option.value = data.data.id_indikator;
      option.textContent = data.data.isi_indikator || "Pilih Indikator";
      dropdown.appendChild(option);
    })
    .catch((error) => console.error("Error fetching dropdown data:", error));
}

// Panggil fungsi saat halaman dimuat
document.addEventListener("DOMContentLoaded", function () {
  setupFormVisibility();
  fetchAuditDataRealtime();
  ktsDropdown(UrlGetKts, "id_kts");
  standarDropdown(apiUrl, "id_standar");
  indikatorDropdown(apiUrl, "indikator");

  // Untuk Get Data Profile
  populateUserProfile();
});
