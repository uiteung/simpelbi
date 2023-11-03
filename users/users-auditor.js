import {
  CihuyDataAPI,
  CihuyPostApi,
  CihuyDeleteAPI,
  CihuyUpdateApi,
} from "https://c-craftjs.github.io/simpelbi/api.js";
import { token, UrlGetUsersAuditor } from "../js/template/template.js";
// import { ShowDataUsersAuditor } from "../js/config/configusersauditor.js";
// import Swal from "sweetalert2";
import { populateUserProfile } from "https://c-craftjs.github.io/simpelbi/profile.js";

import { CihuyPaginations2 } from "https://c-craftjs.github.io/simpelbi/pagenations.js";

// Untuk GET Data Profile
populateUserProfile();

// function ShowDataUsersAuditor(data) {
//   const tableBody = document.getElementById("content");

//   // Kosongkan isi tabel saat ini
//   tableBody.innerHTML = "";
//   let nomor = 1;

//   // Loop melalui data yang diterima dari API
//   data.forEach((item) => {
//     const barisBaru = document.createElement("tr");
//     barisBaru.innerHTML = `
//     <td>
//        <div class="userDatatable-content">${nomor}</div>
//     </td>
//     <td>
//        <div class="d-flex">
//           <div class="userDatatable-inline-title">
//              <a href="#" class="text-dark fw-500">
//                 <h6>${item.fakultas}</h6>
//              </a>
//           </div>
//        </div>
//     </td>
//     <td>
//        <div class="userDatatable-content">
//           ${item.idAuditor}
//        </div>
//     </td>
//     <td>
//        <div class="userDatatable-content">
//           ${item.prodi}
//        </div>
//     </td>
//     <td>
//        <div class="userDatatable-content">
//           ${item.auditor}
//        </div>
//     </td>
//     <td>
//        <div class="userDatatable-content">
//           ${item.nidn}
//        </div>
//     </td>
//     <td>
//        <div class="userDatatable-content">
//           ${item.niknip}
//        </div>
//     </td>
//     <td>
//        <div class="userDatatable-content">
//           ${item.telp}
//        </div>
//     </td>
//     <td>
//        <div class="">
//           ${item.email}
//        </div>
//     </td>
//     <td>
//     <div class="">
//     <img src="https://simbe-dev.ulbi.ac.id/static/pictures/${item.foto}" alt="Foto" width="100" height="100">
//     </div>
//     </td>
//     <td>
//        <ul class="orderDatatable_actions mb-0 d-flex flex-wrap">
//           <li>
//           <a href="#" class="edit"  data-target="#new-member-update" data-auditor-id="${item.idAuditor}">
//           <i class="uil uil-edit"></i>
//              </a>
//           </li>
//           <li>
//           <a href="#" class="remove" data-auditor-id="${item.idAuditor}">
//           <i class="uil uil-trash-alt"></i>
//              </a>
//           </li>
//        </ul>
//     </td>
//     `;
//     const removeButton = barisBaru.querySelector(".remove");
//     removeButton.addEventListener("click", () => {
//       const idAuditor = removeButton.getAttribute("data-auditor-id");
//       if (idAuditor) {
//         deleteAuditor(idAuditor);
//       } else {
//         console.error("ID admin tidak ditemukan.");
//       }
//     });

//     const editButton = barisBaru.querySelector(".edit");
//     editButton.addEventListener("click", () => {
//       const idAuditor = editButton.getAttribute("data-auditor-id");
//       if (idAuditor) {
//         editData(idAuditor);
//       } else {
//         console.error("ID auditor untuk auditor tidak ditemukan.");
//       }
//     });
//     tableBody.appendChild(barisBaru);
//     nomor++;
//   });
// }

const itemsPerPage = 3;
let currentPage = 1;

// Function to display data for a specific page
function displayPageData(data, currentPage) {
  const tableBody = document.getElementById("content");
  tableBody.innerHTML = "";

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

  let nomor = startIndex + 1;

  paginatedData.forEach((item) => {
    const barisBaru = document.createElement("tr");
    barisBaru.innerHTML = `
    <td>
       <div class="userDatatable-content">${nomor}</div>
    </td>
    <td>
       <div class="d-flex">
          <div class="userDatatable-inline-title">
             <a href="#" class="text-dark fw-500">
                <h6>${item.fakultas}</h6>
             </a>
          </div>
       </div>
    </td>
    <td>
       <div class="userDatatable-content">
          ${item.idAuditor}
       </div>
    </td>
    <td>
       <div class="userDatatable-content">
          ${item.prodi}
       </div>
    </td>
    <td>
       <div class="userDatatable-content">
          ${item.auditor}
       </div>
    </td>
    <td>
       <div class="userDatatable-content">
          ${item.nidn}
       </div>
    </td>
    <td>
       <div class="userDatatable-content">
          ${item.niknip}
       </div>
    </td>
    <td>
       <div class="userDatatable-content">
          ${item.telp}
       </div>
    </td>
    <td>
       <div class="">
          ${item.email}
       </div>
    </td>
    <td>
    <div class="">
    <img src="https://simbe-dev.ulbi.ac.id/static/pictures/${item.foto}" alt="Foto" width="100" height="100">
    </div>
    </td>
    <td>
       <ul class="orderDatatable_actions mb-0 d-flex flex-wrap">
          <li>
          <a href="#" class="edit"  data-target="#new-member-update" data-auditor-id="${item.idAuditor}">
          <i class="uil uil-edit"></i>
             </a>
          </li>
          <li>
          <a href="#" class="remove" data-auditor-id="${item.idAuditor}">
          <i class="uil uil-trash-alt"></i>
             </a>
          </li>
       </ul>
    </td>
    `;
    const removeButton = barisBaru.querySelector(".remove");
    removeButton.addEventListener("click", () => {
      const idAuditor = removeButton.getAttribute("data-auditor-id");
      if (idAuditor) {
        deleteAuditor(idAuditor);
      } else {
        console.error("ID admin tidak ditemukan.");
      }
    });

    const editButton = barisBaru.querySelector(".edit");
    editButton.addEventListener("click", () => {
      const idAuditor = editButton.getAttribute("data-auditor-id");
      if (idAuditor) {
        editData(idAuditor);
      } else {
        console.error("ID auditor untuk auditor tidak ditemukan.");
      }
    });
    tableBody.appendChild(barisBaru);
    nomor++;
  });
}
function createPaginationControls(data) {
  const paginationContainer = document.querySelector(".dm-pagination");

  CihuyPaginations2(
    data,
    currentPage,
    itemsPerPage,
    paginationContainer,
    (newPage) => {
      currentPage = newPage;
      displayPageData(data, currentPage);
      createPaginationControls(data);
    }
  );
}
// Untuk Get Data dari API
CihuyDataAPI(UrlGetUsersAuditor, token, (error, response) => {
  if (error) {
    console.error("Terjadi kesalahan:", error);
  } else {
    const data = response.data;
    console.log("Data yang diterima:", data);
    // ShowDataUsersAuditor(data);
    createPaginationControls(data);
    displayPageData(data, currentPage); // siklusdata(data);
  }
});
const apiUrl = "https://simbe-dev.ulbi.ac.id/api/v1/auditors/get";

const postapiUrl = "https://simbe-dev.ulbi.ac.id/api/v1/auditors/add";
// Mendefinisikan URL API untuk Fakultas, Prodi, dan Siklus
const apiUrlFakultas = "https://simbe-dev.ulbi.ac.id/api/v1/fakultas/";
const apiUrlProdi = "https://simbe-dev.ulbi.ac.id/api/v1/prodi/";
const apiUrlSiklus = "https://simbe-dev.ulbi.ac.id/api/v1/siklus/";

// Mendefinisikan elemen dropdown "Fakultas", "Prodi", dan "Siklus"
const fakultasDropdown = document.getElementById("fakultas");
const prodiDropdown = document.getElementById("prodi");
const siklusDropdown = document.getElementById("idSiklus");
// const usernameInput = document.getElementById("username");
// const usernameSuggestions = document.getElementById("username-suggestions");

//update suggestion

// Fetch username data from the API and populate suggestions
function fetchUsernameDataAndPopulateSuggestions() {
  const apiUrlConvert = "https://simbe-dev.ulbi.ac.id/api/v1/convert";
  let dataFromApi = [];
  const usernameInput = document.getElementById("username");
  const usernameSuggestions = document.getElementById("username-suggestions");
  //update suggestion
  const usernameInputUpdate = document.getElementById("username-update");
  const usernameSuggestionsUpdate = document.getElementById(
    "username-suggestions-update"
  );
  // Panggil fungsi CihuyDataAPI untuk mengambil data saat halaman dimuat
  CihuyDataAPI(apiUrlConvert, token, (error, response) => {
    if (error) {
      console.error("Terjadi kesalahan:", error);
    } else {
      const data = response.data;
      dataFromApi = data;
    }
  });

  usernameInput.addEventListener("input", (e) => {
    const inputValue = e.target.value.toLowerCase();

    // Bersihkan daftar saran sebelumnya
    usernameSuggestions.innerHTML = "";

    // Filter opsi-opsi yang cocok dengan input pengguna
    const filteredOptions = dataFromApi.filter((item) =>
      item.id_rtm.toLowerCase().includes(inputValue)
    );

    // Tampilkan opsi-opsi dalam div saran
    filteredOptions.forEach((item) => {
      const suggestion = document.createElement("div");
      suggestion.textContent = item.id_rtm;
      suggestion.addEventListener("click", () => {
        // Setel nilai input saat opsi dipilih
        usernameInput.value = item.id_rtm;
        usernameSuggestions.innerHTML = ""; // Bersihkan daftar saran
      });
      usernameSuggestions.appendChild(suggestion);
    });
  });

  usernameInputUpdate.addEventListener("input", (e) => {
    const inputValue = e.target.value.toLowerCase();

    // Bersihkan daftar saran sebelumnya
    usernameSuggestionsUpdate.innerHTML = "";

    // Filter opsi-opsi yang cocok dengan input pengguna
    const filteredOptions = dataFromApi.filter((item) =>
      item.id_rtm.toLowerCase().includes(inputValue)
    );

    // Tampilkan opsi-opsi dalam div saran
    filteredOptions.forEach((item) => {
      const suggestion = document.createElement("div");
      suggestion.textContent = item.id_rtm;
      suggestion.addEventListener("click", () => {
        // Setel nilai input saat opsi dipilih
        usernameInputUpdate.value = item.id_rtm;
        usernameSuggestionsUpdate.innerHTML = "";
      });
      usernameSuggestionsUpdate.appendChild(suggestion);
    });
  });

  // Menutup daftar saran saat klik di luar input
  document.addEventListener("click", (e) => {
    if (e.target !== usernameInput && e.target !== usernameSuggestions) {
      usernameSuggestions.innerHTML = "";
    }
  });
}

// Fungsi untuk mengisi dropdown "Fakultas"
function getFakultasAll(data) {
  data.forEach((fakultas) => {
    const option = document.createElement("option");
    option.value = fakultas.id_fakultas;
    option.textContent = fakultas.fakultas;
    fakultasDropdown.appendChild(option);
  });
}

// Panggil CihuyDataAPI untuk mengambil data Fakultas dari API
CihuyDataAPI(apiUrlFakultas, token, (error, response) => {
  if (error) {
    console.error("Terjadi kesalahan:", error);
  } else {
    const data = response.data;
    getFakultasAll(data);
    console.log("Data Fakultas yang diterima:", data);
  }
});

// Fungsi untuk mengisi dropdown "Prodi"
function getProdiAll(data) {
  data.forEach((prodi) => {
    const option = document.createElement("option");
    option.value = prodi.id_prodi;
    option.textContent = prodi.prodi;
    prodiDropdown.appendChild(option);
  });
}

// Panggil CihuyDataAPI untuk mengambil data Prodi dari API
CihuyDataAPI(apiUrlProdi, token, (error, response) => {
  if (error) {
    console.error("Terjadi kesalahan:", error);
  } else {
    const data = response.data;
    getProdiAll(data);
    console.log("Data Prodi yang diterima:", data);
  }
});

// Fungsi untuk mengisi dropdown "Siklus"
function fillSiklusDropdown(data) {
  // Kosongkan isi dropdown saat ini
  siklusDropdown.innerHTML = "";

  // Loop melalui data yang diterima dari API
  data.forEach((item, index) => {
    const optionElement = document.createElement("option");
    optionElement.value = index + 1;
    optionElement.textContent = `${index + 1} - Tahun ${item.tahun}`;
    siklusDropdown.appendChild(optionElement);
  });
}

// Panggil CihuyDataAPI untuk mengambil data Siklus dari API
CihuyDataAPI(apiUrlSiklus, token, (error, response) => {
  if (error) {
    console.error("Terjadi kesalahan:", error);
  } else {
    const data = response.data;
    console.log("Data Siklus yang diterima:", data);
    fillSiklusDropdown(data);
  }
});

function getBase64Image(file, callback) {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function () {
    const base64Image = reader.result.split(",")[1];
    callback(base64Image);
  };
  reader.onerror = function (error) {
    console.error("Terjadi kesalahan saat membaca file:", error);
    callback(null); // Call the callback with null if there's an error
  };
}

// Handle form submission when the "Tambah Data Auditor" button is clicked
const tambahDataAuditorButton = document.getElementById(
  "tambahDataAuditorButton"
);
tambahDataAuditorButton.addEventListener("click", function (e) {
  e.preventDefault();

  // Get data from form elements
  const auditor = document.getElementById("namaAuditor").value;
  const nidn = document.getElementById("nidn").value;
  const niknip = document.getElementById("niknip").value;
  const telepon = document.getElementById("telepon").value;
  const email = document.getElementById("email").value;
  const fakultas = document.getElementById("fakultas").value;
  const prodi = document.getElementById("prodi").value;
  const idSiklus = document.getElementById("idSiklus").value;
  const username = document.getElementById("username").value;

  const fotoInput = document.getElementById("fotoInput").files[0];

  // Convert the selected image to base64
  getBase64Image(fotoInput, function (base64Image) {
    if (base64Image === null) {
      console.error("Terjadi kesalahan saat mengonversi gambar.");
    } else {
      // Create an object with auditor data including the base64 image
      const data = {
        auditor: auditor,
        nidn: nidn,
        niknip: niknip,
        telp: telepon,
        email: email,
        foto: {
          // fileName: fotoInput.name,
          fileType: fotoInput.type,
          payload: base64Image,
        },
        idFakultas: parseInt(fakultas),
        idProdi: parseInt(prodi),
        idSiklus: parseInt(idSiklus),
        user_name: username,
      };

      $("#new-member").modal("hide");

      // Show a confirmation SweetAlert
      Swal.fire({
        title: "Tambahkan Data Auditor?",
        text: "Apakah Anda yakin ingin menambahkan data auditor ini?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Ya, Tambahkan",
        cancelButtonText: "Batal",
      }).then((result) => {
        if (result.isConfirmed) {
          // Send the auditor data to the server using the sendAuditorData function
          sendAuditorData(data, postapiUrl, token);
        }
      });
    }
  });
});

// Fungsi untuk mengirim permintaan POST dengan data auditor
function sendAuditorData(data, postapiUrl, token) {
  CihuyPostApi(postapiUrl, token, data)
    .then((responseText) => {
      console.log("Respon sukses:", responseText);
      // Menampilkan pesan sukses
      Swal.fire({
        icon: "success",
        title: "Sukses!",
        text: "Data auditor berhasil ditambahkan.",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        // Refresh halaman atau lakukan tindakan lain jika diperlukan
        window.location.reload();
      });
    })
    .catch((error) => {
      console.error("Terjadi kesalahan:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Terjadi kesalahan saat menambahkan data auditor.",
      });
    });
}

// Call the function to fetch username data and populate suggestions
fetchUsernameDataAndPopulateSuggestions();

function deleteAuditor(idAuditor) {
  Swal.fire({
    title: "Apakah Anda yakin ingin menghapus auditor?",
    text: "Penghapusan auditor akan permanen.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Ya, Hapus",
    cancelButtonText: "Tidak, Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      const apiUrlGetauditorById = `https://simbe-dev.ulbi.ac.id/api/v1/auditors/get?idauditor=${idAuditor}`;

      // Lakukan permintaan GET untuk mengambil auditor berdasarkan ID auditor
      CihuyDataAPI(apiUrlGetauditorById, token, (error, response) => {
        if (error) {
          console.error("Terjadi kesalahan saat mengambil auditor:", error);
        } else {
          const auditordata = response.data;
          if (auditordata) {
            // Dapatkan ID auditor dari data yang diterima
            const idAuditor = auditordata.idAuditor;

            // Buat URL untuk menghapus auditor berdasarkan ID auditor yang telah ditemukan
            const apiUrlauditorDelete = `https://simbe-dev.ulbi.ac.id/api/v1/auditors/delete?idauditor=${idAuditor}`;

            // Lakukan permintaan DELETE untuk menghapus auditor
            CihuyDeleteAPI(
              apiUrlauditorDelete,
              token,
              (deleteError, deleteData) => {
                if (deleteError) {
                  console.error(
                    "Terjadi kesalahan saat menghapus auditor:",
                    deleteError
                  );
                  Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Terjadi kesalahan saat menghapus auditor!",
                  });
                } else {
                  console.log("auditor berhasil dihapus:", deleteData);
                  Swal.fire({
                    icon: "success",
                    title: "Sukses!",
                    text: "auditor berhasil dihapus.",
                    showConfirmButton: false,
                    timer: 1500,
                  }).then(() => {
                    window.location.reload();
                  });
                }
              }
            );
          } else {
            console.error("Data auditor tidak ditemukan.");
          }
        }
      });
    } else {
      Swal.fire("Dibatalkan", "Penghapusan auditor dibatalkan.", "info");
    }
  });
}
function getAuditorDataById(idAuditor, callback) {
  const getAuditorDataById = `https://simbe-dev.ulbi.ac.id/api/v1/auditors/get?idauditor=${idAuditor}`;

  CihuyDataAPI(getAuditorDataById, token, (error, response) => {
    if (error) {
      console.error("Terjadi kesalahan saat mengambil auditor:", error);
      callback(error, null);
    } else {
      const auditorData = response.data;
      callback(null, auditorData);
    }
  });
}

// fungsi edit
// Fungsi untuk mengisi dropdown "Fakultas di form Update"
const fakultasDropdownUpdate = document.getElementById("fakultas-update");
const prodiDropdownUpdate = document.getElementById("prodi-update");
const siklusDropdownUpdate = document.getElementById("idSiklus-update");
function getFakultasAllUpdate(data) {
  data.forEach((fakultas) => {
    const option = document.createElement("option");
    option.value = fakultas.id_fakultas;
    option.textContent = fakultas.fakultas;
    fakultasDropdownUpdate.appendChild(option);
  });
}

// Panggil CihuyDataAPI untuk mengambil data Fakultas di form Update dari API
CihuyDataAPI(apiUrlFakultas, token, (error, response) => {
  if (error) {
    console.error("Terjadi kesalahan:", error);
  } else {
    const data = response.data;
    getFakultasAllUpdate(data);
    console.log("Data Fakultas yang diterima:", data);
  }
});

// Fungsi untuk mengisi dropdown "Prodi di form Update"
function getProdiAllUpdate(data) {
  data.forEach((prodi) => {
    const option = document.createElement("option");
    option.value = prodi.id_prodi;
    option.textContent = prodi.prodi;
    prodiDropdownUpdate.appendChild(option);
  });
}

// Panggil CihuyDataAPI untuk mengambil data Prodi di form Update dari API
CihuyDataAPI(apiUrlProdi, token, (error, response) => {
  if (error) {
    console.error("Terjadi kesalahan:", error);
  } else {
    const data = response.data;
    getProdiAllUpdate(data);
    console.log("Data Prodi yang diterima:", data);
  }
});

// Fungsi untuk mengisi dropdown "Siklus di form Update"
function fillSiklusDropdownUpdate(data) {
  // Kosongkan isi dropdown saat ini
  siklusDropdownUpdate.innerHTML = "";

  // Loop melalui data yang diterima di form Update dari API
  data.forEach((item, index) => {
    const optionElement = document.createElement("option");
    optionElement.value = index + 1;
    optionElement.textContent = `${index + 1} - Tahun ${item.tahun}`;
    siklusDropdownUpdate.appendChild(optionElement);
  });
}

// Panggil CihuyDataAPI untuk mengambil data Siklus di form Update dari API
CihuyDataAPI(apiUrlSiklus, token, (error, response) => {
  if (error) {
    console.error("Terjadi kesalahan:", error);
  } else {
    const data = response.data;
    console.log("Data Siklus yang diterima:", data);
    fillSiklusDropdownUpdate(data);
  }
});
function editData(idAuditor) {
  getAuditorDataById(idAuditor, (error, auditorData) => {
    if (error) {
      console.error("Gagal mengambil data auditor:", error);
      return;
    }

    // Mengisi formulir edit dengan data auditor yang diperoleh

    document.getElementById("namaAuditor-update").value = auditorData.auditor;
    document.getElementById("niknip-update").value = auditorData.niknip;
    document.getElementById("telp-update").value = auditorData.telp;
    // document.getElementById("fakultas-update").value = auditorData.fakultas;
    document.getElementById("email-update").value = auditorData.email;
    document.getElementById("nidn-update").value = auditorData.nidn;
    document.getElementById("username-update").value = auditorData.user_name;
    fakultasDropdownUpdate.value = auditorData.idFakultas;

    prodiDropdownUpdate.value = auditorData.idProdi;

    siklusDropdownUpdate.value = auditorData.idSiklus;
    // Mengatur nilai input fakultas dalam formulir
    // Menampilkan modal edit
    const modal = new bootstrap.Modal(
      document.getElementById("new-member-update")
    );
    modal.show();

    // Mengatur event listener untuk tombol "Simpan Perubahan"
    const simpanPerubahanButton = document.getElementById("updateDataButton");
    simpanPerubahanButton.addEventListener("click", function () {
      const auditorUpdate = document.getElementById("namaAuditor-update").value;
      const fakultasDropdownUpdate = document.getElementById("fakultas-update");
      const niknipUpdate = document.getElementById("niknip-update").value;
      const telpUpdate = document.getElementById("telp-update").value;
      const emailUpdate = document.getElementById("email-update").value;
      const nidnUpdate = document.getElementById("nidn-update").value;
      const prodiDropdownUpdate = document.getElementById("prodi-update");
      const siklusDropdownUpdate = document.getElementById("idSiklus-update");
      const usernameUpdate = document.getElementById("username-update").value;

      // Mendapatkan file gambar yang akan diunggah
      const fotoInput = document.getElementById("fotoInput-update");
      const fotoFile = fotoInput.files[0];
      const dataAuditorToUpdate = {
        auditor: auditorUpdate,
        idFakultas: parseInt(fakultasDropdownUpdate.value),
        idProdi: parseInt(prodiDropdownUpdate.value),
        niknip: niknipUpdate,
        telp: telpUpdate,
        email: emailUpdate,
        nidn: nidnUpdate,
        user_name: usernameUpdate,
        idSiklus: parseInt(siklusDropdownUpdate.value),
        foto: {
          fileName: "", // Nama file gambar yang diunggah
          fileType: "", // Tipe file gambar
          payload: "", // Base64 gambar
        },
      };

      if (fotoFile) {
        // Jika ada perubahan pada gambar, maka proses gambar dan kirim dengan gambar
        const reader = new FileReader();
        reader.onload = function () {
          dataAuditorToUpdate.foto.fileName = fotoFile.name;
          dataAuditorToUpdate.foto.fileType = fotoFile.type;
          dataAuditorToUpdate.foto.payload = reader.result.split(",")[1];

          // Hide modal ketika sudah selesai isi
          $("#new-member-update").modal("hide");

          // Tampilkan SweetAlert konfirmasi sebelum mengirim permintaan
          Swal.fire({
            title: "Update Data Auditor?",
            text: "Apakah Anda yakin ingin mengupdate data auditor ini?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Ya, Update",
            cancelButtonText: "Batal",
          }).then((result) => {
            if (result.isConfirmed) {
              // Kirim permintaan PUT/UPDATE ke server dengan gambar
              sendUpdateRequestWithImage(idAuditor, dataAuditorToUpdate, modal);
            }
          });
        };
        reader.readAsDataURL(fotoFile);
      } else {
        // Hide modal ketika sudah selesai isi
        $("#new-member-update").modal("hide");

        // Jika tidak ada perubahan pada gambar, kirim tanpa gambar
        // Tampilkan SweetAlert konfirmasi sebelum mengirim permintaan
        Swal.fire({
          title: "Update Data Auditor?",
          text: "Apakah Anda yakin ingin mengupdate data auditor ini?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Ya, Update",
          cancelButtonText: "Batal",
        }).then((result) => {
          if (result.isConfirmed) {
            // Kirim permintaan PUT/UPDATE ke server tanpa gambar
            sendUpdateRequestWithoutImage(
              idAuditor,
              dataAuditorToUpdate,
              modal
            );
          }
        });
      }
    });

    // Fungsi untuk mengirim permintaan PUT/UPDATE dengan gambar
    function sendUpdateRequestWithImage(idAuditor, dataAuditorToUpdate, modal) {
      const apiUrlAuditorUpdate = `https://simbe-dev.ulbi.ac.id/api/v1/auditors/update?idauditor=${idAuditor}`;

      CihuyUpdateApi(
        apiUrlAuditorUpdate,
        token,
        dataAuditorToUpdate,
        (error, responseText) => {
          if (error) {
            console.error(
              "Terjadi kesalahan saat mengupdate data auditor:",
              error
            );
            // Menampilkan pesan kesalahan
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Terjadi kesalahan saat mengupdate data auditor.",
            });
          } else {
            console.log("Respon sukses:", responseText);
            // Menutup modal edit
            modal.hide();
            // Menampilkan pesan sukses
            Swal.fire({
              icon: "success",
              title: "Sukses!",
              text: "Data auditor berhasil diperbarui.",
              showConfirmButton: false,
              timer: 1500,
            }).then(() => {
              // Refresh halaman atau lakukan tindakan lain jika diperlukan
              window.location.reload();
            });
          }
        }
      );
    }

    // Fungsi untuk mengirim permintaan PUT/UPDATE tanpa gambar
    function sendUpdateRequestWithoutImage(
      idAuditor,
      dataAuditorToUpdate,
      modal
    ) {
      // Hapus properti foto dari dataAuditorToUpdate
      delete dataAuditorToUpdate.foto;

      const apiUrlAuditorUpdate = `https://simbe-dev.ulbi.ac.id/api/v1/auditors/update?idauditor=${idAuditor}`;

      CihuyUpdateApi(
        apiUrlAuditorUpdate,
        token,
        dataAuditorToUpdate,
        (error, responseText) => {
          if (error) {
            console.error(
              "Terjadi kesalahan saat mengupdate data auditor:",
              error
            );
            // Menampilkan pesan kesalahan
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Terjadi kesalahan saat mengupdate data auditor.",
            });
          } else {
            console.log("Respon sukses:", responseText);
            // Menutup modal edit
            modal.hide();
            // Menampilkan pesan sukses
            Swal.fire({
              icon: "success",
              title: "Sukses!",
              text: "Data auditor berhasil diperbarui.",
              showConfirmButton: false,
              timer: 1500,
            }).then(() => {
              // Refresh halaman atau lakukan tindakan lain jika diperlukan
              window.location.reload();
            });
          }
        }
      );
    }
  });
}
