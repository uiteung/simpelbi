import {
  CihuyDataAPI,
  CihuyPostApi,
  CihuyUpdateApi,
} from "https://c-craftjs.github.io/simpelbi/api.js";
import { token, UrlGetKts, UrlGetStandar } from "../js/template/template.js";

// Fungsi untuk mengupdate jawaban indikator
function updateJawabanIndikator(value) {
  const jawabanSelect = document.getElementById("jawabanindikator");

  // Jika nilai diberikan, atur nilai dropdown
  if (value !== undefined) {
    jawabanSelect.value = value;
  }

  // Sinkronisasi perubahan
  syncWithJawabanIndikator(jawabanSelect.value);
}

// Fungsi untuk sinkronisasi logika berdasarkan nilai jawaban indikator
function syncWithJawabanIndikator(currentValue) {
  const formElementsToHide = document.querySelectorAll(".form-group-to-hide");
  formElementsToHide.forEach((element) => {
    if (currentValue === "Ya") {
      element.style.visibility = "hidden"; // Menyembunyikan elemen
    } else {
      element.style.visibility = "visible"; // Menampilkan elemen
    }
  });
}

// Setup untuk event listener pada perubahan nilai dropdown
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
const apiUrl = `https://simbe-dev.ulbi.ac.id/api/v1/audit/getallbyami?id_ami=${idAmi}`;

let jawabanDefault;

// Callback untuk API Response
const handleApiResponse = (error, data) => {
  if (error) {
    console.error("Error fetching data:", error);
  } else {
    console.log("Data received:", data);

    jawabanDefault = data.data[0].jawaban; // Ambil jawaban default dari API
    updateJawabanIndikator(jawabanDefault); // Update nilai dropdown
  }
};

// Event listener untuk tombol insert
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
      const jawabanValue = document.getElementById("jawabanindikator").value;
      const linkPerbaikan = document.getElementById("link_perbaikan").value;

      // Data yang akan dikirim ke API
      let data =
        jawabanValue === "Ya"
          ? {
              id_standar: null,
              indikator: null,
              id_kts: null,
              jawaban: jawabanValue,
              uraian: null,
              tindakan: null,
              target: null,
              status: "open",
            }
          : {
              id_standar: null,
              indikator: null,
              jawaban: jawabanValue,
              id_kts: null,
              uraian: null,
              tindakan: null,
              target: null,
              status: "open",
              link_perbaikan: linkPerbaikan,
            };

      const apiUpdateUrl = `https://simbe-dev.ulbi.ac.id/api/v1/audit/update?id_audit=${idAudit}`;

      // Panggil API Update
      CihuyUpdateApi(apiUpdateUrl, token, data, (error, response) => {
        if (error) {
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: "Failed to update data.",
          });
        } else {
          Swal.fire({
            icon: "success",
            title: "Sukses!",
            text: "Data audit berhasil diperbarui.",
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            window.location.reload(true);
          });
        }
      });
    }
  });
});

// Panggil API untuk mendapatkan data awal
CihuyDataAPI(apiUrl, token, handleApiResponse);

// Setup event listener saat halaman selesai dimuat
document.addEventListener("DOMContentLoaded", function () {
  setupFormVisibility();
});

// Dropdown untuk data KTS
function ktsdropdown(apiUrl, dropdownId) {
  const dropdown = document.getElementById(dropdownId);

  CihuyDataAPI(apiUrl, token, (error, response) => {
    if (error) {
      console.error("Terjadi kesalahan:", error);
    } else {
      dropdown.innerHTML = ""; // Bersihkan dropdown

      // Isi dropdown dengan opsi dari API
      response.data.forEach((item) => {
        const option = document.createElement("option");
        option.value = item.id_kts;
        option.textContent = `${item.id_kts}. ${item.kts}`;
        dropdown.appendChild(option);
      });
    }
  });
}

// Dropdown untuk data Standar
function standarDropdown(apiUrlProdiUnit, dropdownId) {
  const dropdown = document.getElementById(dropdownId);

  CihuyDataAPI(apiUrlProdiUnit, token, (error, data) => {
    if (error) {
      console.error("Terjadi kesalahan:", error);
    } else {
      dropdown.innerHTML = ""; // Bersihkan dropdown

      const option = document.createElement("option");
      option.value = data.data.id_standar;
      option.textContent = `${data.data.isi_standar}`;
      dropdown.appendChild(option);

      // Inisialisasi Select2
      $(document).ready(function () {
        $(dropdownId).select2({
          width: "100%",
          minimumResultsForSearch: Infinity,
        });
      });
    }
  });
}

// Dropdown untuk data Indikator
function indikatorDropdown(apiUrlProdiUnit, dropdownId) {
  const dropdown = document.getElementById(dropdownId);

  CihuyDataAPI(apiUrlProdiUnit, token, (error, data) => {
    if (error) {
      console.error("Terjadi kesalahan:", error);
    } else {
      dropdown.innerHTML = ""; // Bersihkan dropdown

      const option = document.createElement("option");
      option.value = data.data.id_indikator;
      option.textContent = `${data.data.isi_indikator}`;
      dropdown.appendChild(option);
    }
  });
}

// Inisialisasi dropdown
const apiUrlProdiUnit = `https://simbe-dev.ulbi.ac.id/api/v1/audit/get?id_audit=${idAudit}`;
indikatorDropdown(apiUrlProdiUnit, "indikator");
standarDropdown(apiUrlProdiUnit, "id_standar");
ktsdropdown(UrlGetKts, "id_kts");

// Fungsi untuk logout
document.addEventListener("DOMContentLoaded", () => {
  function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }

  const signoutButton = document.querySelector(".nav-author__signout");
  signoutButton.addEventListener("click", (event) => {
    event.preventDefault();
    deleteCookie("login");
    window.location.href = signoutButton.getAttribute("href");
  });
});
