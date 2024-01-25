import {
  CihuyDataAPI,
  CihuyPostApi,
  CihuyDeleteAPI,
  CihuyUpdateApi,
} from "https://c-craftjs.github.io/simpelbi/api.js";
import {
  token,
  UrlGetStandar,
  UrlPostStandar,
  UrlGetSiklus,
} from "../js/template/template.js";
// import { ShowdataStandar } from "../js/config/configstandar.js";
// import { CihuyPostKTS } from "../js/config/configkts.js"
import { populateUserProfile } from "https://c-craftjs.github.io/simpelbi/profile.js";

// Untuk GET Data Profile
populateUserProfile();

// Untuk Get Data dari API
export function ShowdataStandar(data) {
  const tableBody = document.getElementById("content");

  // Kosongkan isi tabel saat ini
  tableBody.innerHTML = "";
  let nomor = 1;

  // Loop melalui data yang diterima dari API
  data.forEach((item) => {
    const barisBaru = document.createElement("tr");
    barisBaru.innerHTML = `<td>
        <div class="userDatatable-content">${nomor}</div>
        </td>
        <td>
          <div class="d-flex">
              <div class="userDatatable-inline-title">
                <a href="#" class="text-dark fw-500">
                    <h6>${item.standar}</h6>
                </a>
              </div>
          </div>
        </td>
        <td>
          <div class="userDatatable-content">
          ${item.nama_indikator}
          </div>
        </td>
        <td>
          <div class="userDatatable-content">
          ${item.isi}
          </div>
        </td>
        <td>
          <div class="userDatatable-content">
          ${item.prodi_unit}
          </div>
        </td>
        <td>
          <div class="userDatatable-content">
          ${item.tahun}
          </div>
        </td>
        <td>
          <ul class="orderDatatable_actions mb-0 d-flex flex-wrap">
              
              <li>
                <a href="#" class="edit" data-target="#new-member-update" data-standar-id="${item.id_standar}">
                    <i class="uil uil-edit"></i>
                </a>
              </li>
              <li>
                <a href="#" class="remove" data-standar-id=${item.id_standar}>
                    <i class="uil uil-trash-alt"></i>
                </a>
              </li>
          </ul>
        </td>`;
    // Untuk Remove Button
    const removeButton = barisBaru.querySelector(".remove");
    removeButton.addEventListener("click", () => {
      const id_standar = removeButton.getAttribute("data-standar-id");
      if (id_standar) {
        deleteStandar(id_standar);
      } else {
        console.error("ID Standar tidak ditemukan");
      }
    });
    // Untuk Update Button
    const editButton = barisBaru.querySelector(".edit");
    editButton.addEventListener("click", () => {
      const id_standar = editButton.getAttribute("data-standar-id");
      if (id_standar) {
        editData(id_standar);
      } else {
        console.error("ID Standar tidak ditemukan");
      }
    });
    tableBody.appendChild(barisBaru);
    nomor++;
  });
}

// Untuk GET All Data dengan menggunakan API
CihuyDataAPI(UrlGetStandar, token, (error, response) => {
  if (error) {
    console.error("Terjadi kesalahan:", error);
  } else {
    const data = response.data;
    console.log("Data yang diterima:", data);
    ShowdataStandar(data);
  }
});

// Untuk PUT Data dengan menggunakan API
function getStandarDataById(id_standar, callback) {
  const UrlGetStandarById = `https://simbe-dev.ulbi.ac.id/api/v1/standar/get?id_standar=${id_standar}`;

  CihuyDataAPI(UrlGetStandarById, token, (error, response) => {
    if (error) {
      console.error("Terjadi kesalahan saat mengambil data : ", error);
      callback(error, null);
    } else {
      const standarData = response.data;
      callback(null, standarData);
    }
  });
}
function editData(id_standar) {
  getStandarDataById(id_standar, (error, standarData) => {
    if (error) {
      console.error("Gagal mengambil data standar : ", error);
      return;
    }
    // Untuk Ambil nilai dari form
    document.getElementById("standar-update").value = standarData.standar;
    document.getElementById("indikator-update").value =
      standarData.nama_indikator;
    document.getElementById("isi-update").value = standarData.isi;
    document.getElementById("siklus-update").value = standarData.idSiklus;

    // Menampilkan modal edit
    const modal = new bootstrap.Modal(
      document.getElementById("new-member-update")
    );
    modal.show();

    // Membuat event listener untuk button update
    const simpanPerubahanButton = document.getElementById("updateDataButton");
    simpanPerubahanButton.addEventListener("click", function () {
      // Untuk ambil nilai dari element form edit
      const standarBaru = document.getElementById("standar-update").value;
      const utkPilihanBaru = document.getElementById("indikator-update").value;
      const isiBaru = document.getElementById("isi-update").value;
      const siklusBaru = document.getElementById("siklus-update").value;

      // Buat const untuk nampung semuanya
      const dataStandarToUpdate = {
        standar: standarBaru,
        utkPilihan: utkPilihanBaru,
        isi: isiBaru,
        siklus: siklusBaru,
      };

      // Hide modal ketika sudah selesai isi
      $("#new-member-update").modal("hide");

      // Tampilkan SweetAlet konfirmasi sebelum mengirim permintaan
      Swal.fire({
        title: "Update Standar?",
        text: "Apakah Anda yakin ingin update Standar?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Ya, Update",
        cancelButtonText: "Bata;",
      }).then((result) => {
        if (result.isConfirmed) {
          sendUpdateStandar(id_standar, dataStandarToUpdate, modal);
        }
      });
    });
  });
}
// function untuk kirim update data
function sendUpdateStandar(id_standar, dataStandarToUpdate, modal) {
  const UrlPutStandar = `https://simbe-dev.ulbi.ac.id/api/v1/standar/update?id_standar=${id_standar}`;

  CihuyUpdateApi(
    UrlPutStandar,
    token,
    dataStandarToUpdate,
    (error, responseText) => {
      if (error) {
        console.error("Terjadi kesalahan saat update data standar : ", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Terjadi kesalahan saat update data standar",
        });
      } else {
        console.log("Respon sukses :", responseText);
        // Tutup modal
        modal.hide();
        // Tampilkan Sweet Alert sukses
        Swal.fire({
          icon: "success",
          title: "Sukses!",
          text: "Data Standar berhasil diperbarui",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          window.location.reload();
        });
      }
    }
  );
}

// Untuk tampilkan dropdown siklus untuk update
function siklusupdate(data) {
  const selectElement = document.getElementById("siklus-update");
  // Kosongkan isi dropdown saat ini
  selectElement.innerHTML = "";
  // Loop melalui data yang diterima dari API
  data.forEach((item, index) => {
    const optionElement = document.createElement("option");
    optionElement.value = index + 1;
    optionElement.textContent = `${index + 1} - Tahun ${item.tahun}`;
    selectElement.appendChild(optionElement);
  });
  selectElement.addEventListener("change", function () {
    const selectedValue = this.value;
    // Lakukan sesuatu dengan nilai yang dipilih, misalnya, tampilkan di konsol
    console.log("Nilai yang dipilih:", selectedValue);
  });
}
CihuyDataAPI(UrlGetSiklus, token, (error, response) => {
  if (error) {
    console.error("Terjadi kesalahan:", error);
  } else {
    const data = response.data;
    console.log("Data yang diterima:", data);
    siklusupdate(data);
  }
});

// Untuk POST Data dengan menggunakan API
function siklusData(data) {
  const selectElement = document.getElementById("siklus");
  // Kosongkan isi dropdown saat ini
  selectElement.innerHTML = "";

  // Loop data yang diterima dari API
  data.forEach((item, index) => {
    const optionElement = document.createElement("option");
    optionElement.value = index + 1;
    optionElement.textContent = `${index + 1} - Tahun ${item.tahun}`;
    selectElement.appendChild(optionElement);
  });
  selectElement.addEventListener("change", function () {
    const selectedValue = this.value;
    // Lakukan sesuatu dengan nilai yang dipilih, misalnya, tampilkan di konsol
    console.log("Nilai yang dipilih: ", selectedValue);
  });
}
// Panggil API untuk mendapatkan data siklus
CihuyDataAPI(UrlGetSiklus, token, (error, response) => {
  if (error) {
    console.error("Terjadi kesalahan:", error);
  } else {
    const data = response.data;
    console.log("Data yang diterima:", data);
    siklusData(data);
  }
});

const Tombol = document.getElementById("buttonadd");

Tombol.addEventListener("click", async function (e) {
  e.preventDefault();
  console.log("Button Clicked");

  // Untuk Ambil nilai dari elemen
  const standarInput = document.getElementById("standar").value;
  const untukPilihan = document.getElementById("indikator").value;
  const isiInput = document.getElementById("isi").value;
  const siklusInput = document.getElementById("siklus").value;

  const data = {
    standar: standarInput,
    utkPilihan: untukPilihan,
    isi: isiInput,
    idSiklus: parseInt(siklusInput),
  };

  // Tutup modal setelah menampilkan SweetAlert
  $("#new-member").modal("hide");

  // Menampilkan pesan konfirmasi SweetAlert
  Swal.fire({
    title: "Tambahkan Standar?",
    text: "Apakah Anda yakin ingin menambahkan Standar?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Ya, Tambahkan",
    cancelButtonText: "Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      // Mengirimkan Permintaan POST Menggunakan Fungsi CihuyPostApi
      CihuyPostApi(UrlPostStandar, token, data)
        .then((responseText) => {
          console.log("Respon sukses:", responseText);
          // Tutup modal setelah menampilkan SweetAlert
          $("#new-member").modal("hide");
          // Lakukan tindakan lain setelah permintaan POST berhasil
          Swal.fire({
            icon: "success",
            title: "Sukses!",
            text: "Standar berhasil ditambahkan",
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            // Reload halaman
            // window.location.reload();
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
    }
  });
});
function populateIndikatorDropdown() {
  const indikatorDropdown = document.getElementById("indikator");

  // Fetch data from the API
  CihuyDataAPI(
    "https://simbe-dev.ulbi.ac.id/api/v1/indikator/",
    token,
    (error, response) => {
      if (error) {
        console.error(
          "Terjadi kesalahan saat mengambil data indikator:",
          error
        );
      } else {
        const indikatorData = response.data;

        // Clear existing options
        indikatorDropdown.innerHTML = "";

        // Add a default option
        const defaultOption = document.createElement("option");
        defaultOption.disabled = true;
        defaultOption.textContent = "--Pilih Indikator--";
        indikatorDropdown.appendChild(defaultOption);

        // Populate the dropdown with data from the API
        indikatorData.forEach((indikator) => {
          const option = document.createElement("option");
          option.value = indikator.isi; // You may need to adjust this based on the actual structure of your indikator data

          option.textContent = indikator.isi;

          option.title = indikator.isi;

          indikatorDropdown.appendChild(option);
        });
      }
    }
  );
}

// Call this function to populate the dropdown when the page loads

// Call this function to populate the dropdown when the page loads
populateIndikatorDropdown();

function populateprodiDropdown() {
  const indikatorDropdown = document.getElementById("prodiatauunit");

  // Fetch data from the API
  CihuyDataAPI(
    "https://simbe-dev.ulbi.ac.id/api/v1/prodi/",
    token,
    (error, response) => {
      if (error) {
        console.error(
          "Terjadi kesalahan saat mengambil data indikator:",
          error
        );
      } else {
        const indikatorData = response.data;

        // Clear existing options
        indikatorDropdown.innerHTML = "";

        // Add a default option
        const defaultOption = document.createElement("option");
        defaultOption.disabled = true;
        defaultOption.textContent = "--Pilih Indikator--";
        indikatorDropdown.appendChild(defaultOption);

        // Populate the dropdown with data from the API
        indikatorData.forEach((indikator) => {
          const option = document.createElement("option");
          option.value = indikator.id_prodi; // You may need to adjust this based on the actual structure of your indikator data

          // Adjust this based on the actual structure of your indikator data
          option.textContent = indikator.prodi_unit;

          // Set the title attribute to the full text
          option.title = indikator.isi;

          indikatorDropdown.appendChild(option);
        });
      }
    }
  );
}

// Call this function to populate the dropdown when the page loads
populateprodiDropdown();

// Untuk DELETE Data Standar
function deleteStandar(id_standar) {
  // Buat URL untuk mengambil data standar berdasarkan id
  const UrlGetStandarById = `https://simbe-dev.ulbi.ac.id/api/v1/standar/get?id_standar=${id_standar}`;

  // Lakukan permintaan GET untuk mengambil standar berdasarkan id
  CihuyDataAPI(UrlGetStandarById, token, (error, response) => {
    if (error) {
      console.error("Terjadi kesalahan saat mengambil standar: ", error);
    } else {
      const standarData = response.data;
      if (standarData) {
        // Dapatkan id admin dari data yang diterima
        const id_standar = standarData.id_standar;
        const UrlDeleteStandar = `https://simbe-dev.ulbi.ac.id/api/v1/standar/delete?id_standar=${id_standar}`;

        // Menampilkan pesan konfirmasi SweetAlert
        Swal.fire({
          title: "Hapus Standar?",
          text: "Apakah Anda yakin ingin menghapus Standar?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Ya, Hapuskan",
          cancelButtonText: "Batal",
        }).then((result) => {
          if (result.isConfirmed) {
            // Lakukan permintaan DELETE
            CihuyDeleteAPI(
              UrlDeleteStandar,
              token,
              (deleteError, deleteData) => {
                if (deleteError) {
                  console.error(
                    "Terjadi kesalahan saat menghapus Standar:",
                    deleteError
                  );
                  Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Terjadi kesalahan saat menghapus Standar!",
                  });
                } else {
                  console.log("Standar berhasil dihapus:", deleteData);
                  Swal.fire({
                    icon: "success",
                    title: "Sukses!",
                    text: "Standar berhasil dihapus",
                    showConfirmButton: false,
                    timer: 1500,
                  }).then(() => {
                    // Refresh halaman setelah menutup popup
                    window.location.reload();
                  });
                }
              }
            );
          }
        });
      } else {
        console.error("Data Standar tidak ditemukan.");
      }
    }
  });
}
