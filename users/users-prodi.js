import {
  CihuyDataAPI,
  CihuyPostApi,
  CihuyDeleteAPI,
  CihuyUpdateApi,
} from "https://c-craftjs.github.io/simpelbi/api.js";
import {
  token,
  UrlGetUsersProdi,
  UrlGetUsersFakultas,
  UrlGetJenjang,
  UrlGetSiklus,
} from "../js/template/template.js";
// import { ShowDataUsersProdi } from "../js/config/configusersprodi.js";
import { populateUserProfile } from "https://c-craftjs.github.io/simpelbi/profile.js";
import { CihuyPaginations2 } from "https://c-craftjs.github.io/simpelbi/pagenations.js";

// Untuk GET Data Profile
populateUserProfile();
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
          ${item.prodi_unit}
       </div>
    </td>
    <td>
       <div class="userDatatable-content">
          ${item.jenjang}
       </div>
    </td>
    <td>
       <div class="userDatatable-content">
          ${item.nama}
       </div>
    </td>
    <td>
       <div class="userDatatable-content">
          ${item.nidn}
       </div>
    </td>
    <td>
       <div class="userDatatable-content">
       <img src="https://simbe-dev.ulbi.ac.id/static/pictures/${item.foto}" alt="Foto" width="100" height="100">
       </div>
    </td>
    <td>
       <div class="userDatatable-content">
          ${item.telp}
       </div>
    </td>
    <td>
      <div class="userDatatable-content">
          ${item.email}
      </div>
    </td>
    <td>
       <ul class="orderDatatable_actions mb-0 d-flex flex-wrap">
         
          <li>
          <a href="#" class="edit"  data-target="#new-member-update" data-prodi-id="${item.id_prodi}">
          <i class="uil uil-edit"></i>
             </a>
          </li>
          <li>
          <a href="#" class="remove" data-prodi-id="${item.id_prodi}">
                <i class="uil uil-trash-alt"></i>
             </a>
          </li>
       </ul>
    </td>
    `;

    const removeButton = barisBaru.querySelector(".remove");
    removeButton.addEventListener("click", () => {
      const id_prodi = removeButton.getAttribute("data-prodi-id");
      if (id_prodi) {
        deleteprodi(id_prodi);
      } else {
        console.error("ID prodi tidak ditemukan.");
      }
    });
    const editButton = barisBaru.querySelector(".edit");
    editButton.addEventListener("click", () => {
      const id_prodi = editButton.getAttribute("data-prodi-id");
      if (id_prodi) {
        editData(id_prodi);
      } else {
        console.error("ID prodi tidak ditemukan.");
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
CihuyDataAPI(UrlGetUsersProdi, token, (error, response) => {
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

// // Untuk Get Data dari API
// function ShowDataUsersProdi(data) {
//   const tableBody = document.getElementById("content");

//   // Kosongkan isi tabel saat ini
//   tableBody.innerHTML = "";
//   let nomor = 1;

//   // Loop melalui data yang diterima dari API
//   data.forEach((item) => {
//     const barisBaru = document.createElement("tr");
//     barisBaru.innerHTML = `
//       <td>
//          <div class="userDatatable-content">${nomor}</div>
//       </td>
//       <td>
//          <div class="d-flex">
//             <div class="userDatatable-inline-title">
//                <a href="#" class="text-dark fw-500">
//                   <h6>${item.id_prodi}</h6>
//                </a>
//             </div>
//          </div>
//       </td>
//       <td>
//          <div class="userDatatable-content">
//             ${item.prodi}
//          </div>
//       </td>
//       <td>
//          <div class="userDatatable-content">
//             ${item.jenjang}
//          </div>
//       </td>
//       <td>
//          <div class="userDatatable-content">
//             ${item.kaprodi}
//          </div>
//       </td>
//       <td>
//          <div class="userDatatable-content">
//             ${item.nidn}
//          </div>
//       </td>
//       <td>
//          <div class="userDatatable-content">
//          <img src="https://simbe-dev.ulbi.ac.id/static/pictures/${item.foto}" alt="Foto" width="100" height="100">
//          </div>
//       </td>
//       <td>
//          <div class="userDatatable-content">
//             ${item.telp}
//          </div>
//       </td>
//       <td>
//         <div class="userDatatable-content">
//             ${item.email}
//         </div>
//       </td>
//       <td>
//          <ul class="orderDatatable_actions mb-0 d-flex flex-wrap">

//             <li>
//             <a href="#" class="edit"  data-target="#new-member-update" data-prodi-id="${item.id_prodi}">
//             <i class="uil uil-edit"></i>
//                </a>
//             </li>
//             <li>
//             <a href="#" class="remove" data-prodi-id="${item.id_prodi}">
//                   <i class="uil uil-trash-alt"></i>
//                </a>
//             </li>
//          </ul>
//       </td>
//       `;
//     const removeButton = barisBaru.querySelector(".remove");
//     removeButton.addEventListener("click", () => {
//       const id_prodi = removeButton.getAttribute("data-prodi-id");
//       if (id_prodi) {
//         deleteprodi(id_prodi);
//       } else {
//         console.error("ID prodi tidak ditemukan.");
//       }
//     });
//     const editButton = barisBaru.querySelector(".edit");
//     editButton.addEventListener("click", () => {
//       const id_prodi = editButton.getAttribute("data-prodi-id");
//       if (id_prodi) {
//         editData(id_prodi);
//       } else {
//         console.error("ID prodi tidak ditemukan.");
//       }
//     });
//     tableBody.appendChild(barisBaru);
//     nomor++;
//   });
// }

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
fetchUsernameDataAndPopulateSuggestions();

CihuyDataAPI(UrlGetUsersProdi, token, (error, response) => {
  if (error) {
    console.error("Terjadi kesalahan:", error);
  } else {
    const data = response.data;
    console.log("Data yang diterima:", data);
    // ShowDataUsersProdi(data);
  }
});

const fakultasDropdown = document.getElementById("fakultas");
const jenjangDropdown = document.getElementById("jenjang");
const siklusDropdown = document.getElementById("idSiklus");

function getFakultasAll(data) {
  data.forEach((fakultas) => {
    const option = document.createElement("option");
    option.value = fakultas.id_fakultas;
    option.textContent = fakultas.fakultas;
    fakultasDropdown.appendChild(option);
  });
}
CihuyDataAPI(UrlGetUsersFakultas, token, (error, response) => {
  if (error) {
    console.error("Terjadi kesalahan:", error);
  } else {
    const data = response.data;
    getFakultasAll(data);
    console.log("Data Fakultas yang diterima:", data);
  }
});

function getJenjangAll(data) {
  data.forEach((jenjang) => {
    const option = document.createElement("option");
    option.value = jenjang.idJenjang;
    option.textContent = jenjang.jenjang;
    jenjangDropdown.appendChild(option);
  });
}
CihuyDataAPI(UrlGetJenjang, token, (error, response) => {
  if (error) {
    console.error("Terjadi kesalahan:", error);
  } else {
    const data = response.data;
    getJenjangAll(data);
    console.log("Data Jenjang yang diterima:", data);
  }
});

function fillSiklusDropdown(data) {
  siklusDropdown.innerHTML = "";

  // Loop melalui data yang diterima di form Update dari API
  data.forEach((item, index) => {
    const optionElement = document.createElement("option");
    optionElement.value = index + 1;
    optionElement.textContent = `${index + 1} - Tahun ${item.tahun}`;
    siklusDropdown.appendChild(optionElement);
  });
}

// Panggil CihuyDataAPI untuk mengambil data Siklus di form Update dari API
CihuyDataAPI(UrlGetSiklus, token, (error, response) => {
  if (error) {
    console.error("Terjadi kesalahan:", error);
  } else {
    const data = response.data;
    console.log("Data Siklus yang diterima:", data);
    fillSiklusDropdown(data);
  }
});

//post data prodi

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

// Handle form submission when the "Tambah Data prodi" button is clicked
const tambahDataprodiButton = document.getElementById("tambahDataprodiButton");
tambahDataprodiButton.addEventListener("click", function (e) {
  e.preventDefault();

  // Get data from form elements
  const fakultas = document.getElementById("fakultas").value;
  const prodi = document.getElementById("prodi").value;
  const kaprodi = document.getElementById("kaprodi").value;
  const jenjang = document.getElementById("jenjang").value;
  const nidn = document.getElementById("nidn").value;
  const niknip = document.getElementById("niknip").value;
  const telepon = document.getElementById("telp").value;
  const email = document.getElementById("email").value;
  const username = document.getElementById("username").value;
  const siklus = document.getElementById("idSiklus").value;

  const fotoInput = document.getElementById("fotoInput").files[0];

  // Convert the selected image to base64
  getBase64Image(fotoInput, function (base64Image) {
    if (base64Image === null) {
      console.error("Terjadi kesalahan saat mengonversi gambar.");
    } else {
      // Create an object with prodi data including the base64 image
      const data = {
        fakultas: parseInt(fakultas),
        prodi: prodi,
        kaprodi: kaprodi,
        idJenjang: parseInt(jenjang),
        nidn: nidn,
        niknip: niknip,
        telp: telepon,
        email: email,
        user_name: username,
        idSiklus: parseInt(siklus),
        foto: {
          // fileName: fotoInput.name,
          fileType: fotoInput.type,
          payload: base64Image,
        },
      };

      $("#new-member").modal("hide");

      // Show a confirmation SweetAlert
      Swal.fire({
        title: "Tambahkan Data prodi?",
        text: "Apakah Anda yakin ingin menambahkan data prodi ini?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Ya, Tambahkan",
        cancelButtonText: "Batal",
      }).then((result) => {
        if (result.isConfirmed) {
          // Send the prodi data to the server using the sendprodiData function
          sendprodiData(data, UrlpostUsersprodi, token);
        }
      });
    }
  });
});
const UrlpostUsersprodi = "https://simbe-dev.ulbi.ac.id/api/v1/prodi/add";
// Fungsi untuk mengirim permintaan POST dengan data prodi
function sendprodiData(data, UrlpostUsersprodi, token) {
  CihuyPostApi(UrlpostUsersprodi, token, data)
    .then((responseText) => {
      console.log("Respon sukses:", responseText);
      // Menampilkan pesan sukses
      Swal.fire({
        icon: "success",
        title: "Sukses!",
        text: "Data prodi berhasil ditambahkan.",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        // Refresh halaman atau lakukan tindakan lain jika diperlukan
        // window.location.reload();
      });
    })
    .catch((error) => {
      console.error("Terjadi kesalahan:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Terjadi kesalahan saat menambahkan data prodi.",
      });
    });
}

// fungsi untuk delete
function deleteprodi(id_prodi) {
  Swal.fire({
    title: "Apakah Anda yakin ingin menghapus prodi?",
    text: "Penghapusan prodi akan permanen.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Ya, Hapus",
    cancelButtonText: "Tidak, Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      const apiUrlGetprodiById = `https://simbe-dev.ulbi.ac.id/api/v1/prodi/get?id_prodi_unit=${id_prodi}`;

      // Lakukan permintaan GET untuk mengambil prodi berdasarkan ID prodi
      CihuyDataAPI(apiUrlGetprodiById, token, (error, response) => {
        if (error) {
          console.error("Terjadi kesalahan saat mengambil prodi:", error);
        } else {
          const prodidata = response.data;
          if (prodidata) {
            // Dapatkan ID prodi dari data yang diterima
            const id_prodi = prodidata.id_prodi;

            // Buat URL untuk menghapus prodi berdasarkan ID prodi yang telah ditemukan
            const apiUrlprodiDelete = `https://simbe-dev.ulbi.ac.id/api/v1/prodi/delete?id_prodi_unit=${id_prodi}`;

            // Lakukan permintaan DELETE untuk menghapus prodi
            CihuyDeleteAPI(
              apiUrlprodiDelete,
              token,
              (deleteError, deleteData) => {
                if (deleteError) {
                  console.error(
                    "Terjadi kesalahan saat menghapus prodi:",
                    deleteError
                  );
                  Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Terjadi kesalahan saat menghapus prodi!",
                  });
                } else {
                  console.log("prodi berhasil dihapus:", deleteData);
                  Swal.fire({
                    icon: "success",
                    title: "Sukses!",
                    text: "prodi berhasil dihapus.",
                    showConfirmButton: false,
                    timer: 1500,
                  }).then(() => {
                    window.location.reload();
                  });
                }
              }
            );
          } else {
            console.error("Data prodi tidak ditemukan.");
          }
        }
      });
    } else {
      Swal.fire("Dibatalkan", "Penghapusan prodi dibatalkan.", "info");
    }
  });
}

const fakultasDropdownUpdate = document.getElementById("fakultas-update");
const siklusDropdownUpdate = document.getElementById("idSiklus-update");
const jenjangDropdownUpdate = document.getElementById("jenjang-update");

function getFakultasAllUpdate(data) {
  data.forEach((fakultas) => {
    const option = document.createElement("option");
    option.value = fakultas.id_fakultas;
    option.textContent = fakultas.fakultas;
    fakultasDropdownUpdate.appendChild(option);
  });
}

// Panggil CihuyDataAPI untuk mengambil data Fakultas di form Update dari API
CihuyDataAPI(UrlGetUsersFakultas, token, (error, response) => {
  if (error) {
    console.error("Terjadi kesalahan:", error);
  } else {
    const data = response.data;
    getFakultasAllUpdate(data);
    console.log("Data Fakultas yang diterima:", data);
  }
});

function getJenjangAllUpdate(data) {
  data.forEach((jenjang) => {
    const option = document.createElement("option");
    option.value = jenjang.jenjang;
    option.textContent = jenjang.jenjang;
    jenjangDropdownUpdate.appendChild(option);
  });
}

// Panggil CihuyDataAPI untuk mengambil data Fakultas di form Update dari API
CihuyDataAPI(UrlGetJenjang, token, (error, response) => {
  if (error) {
    console.error("Terjadi kesalahan:", error);
  } else {
    const data = response.data;
    getJenjangAllUpdate(data);
    console.log("Data Fakultas yang diterima:", data);
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
CihuyDataAPI(UrlGetSiklus, token, (error, response) => {
  if (error) {
    console.error("Terjadi kesalahan:", error);
  } else {
    const data = response.data;
    console.log("Data Siklus yang diterima:", data);
    fillSiklusDropdownUpdate(data);
  }
});

function getprodiDataById(id_prodi, callback) {
  const ApiurlGetprodibyid = `https://simbe-dev.ulbi.ac.id/api/v1/prodi/get?id_prodi_unit=${id_prodi}`;

  CihuyDataAPI(ApiurlGetprodibyid, token, (error, response) => {
    if (error) {
      console.error("Terjadi kesalahan saat mengambil prodi:", error);
      callback(error, null);
    } else {
      const prodiData = response.data;
      callback(null, prodiData);
    }
  });
}

function editData(id_prodi) {
  getprodiDataById(id_prodi, (error, prodiData) => {
    if (error) {
      console.error("Gagal mengambil data prodi:", error);
      return;
    }

    // Mengisi formulir edit dengan data prodi yang diperoleh

    document.getElementById("prodi-update").value = prodiData.prodi_unit;
    document.getElementById("niknip-update").value = prodiData.niknip;
    document.getElementById("telp-update").value = prodiData.telp;
    document.getElementById("kaprodi-update").value = prodiData.nama;
    document.getElementById("email-update").value = prodiData.email;
    document.getElementById("nidn-update").value = prodiData.nidn;
    document.getElementById("username-update").value = prodiData.user_name;
    fakultasDropdownUpdate.value = prodiData.idFakultas;
    siklusDropdownUpdate.value = prodiData.idSiklus;
    jenjangDropdownUpdate.value = prodiData.jenjang;

    // prodiDropdownUpdate.value = prodiData.idProdi;

    // Mengatur nilai input fakultas dalam formulir
    // Menampilkan modal edit
    const modal = new bootstrap.Modal(
      document.getElementById("new-member-update")
    );
    modal.show();

    // Mengatur event listener untuk tombol "Simpan Perubahan"
    const simpanPerubahanButton = document.getElementById("updateDataButton");
    simpanPerubahanButton.addEventListener("click", function () {
      const prodiUpdate = document.getElementById("prodi-update").value;
      const fakultasDropdownUpdate = document.getElementById("fakultas-update");
      const niknipUpdate = document.getElementById("niknip-update").value;
      const telpUpdate = document.getElementById("telp-update").value;
      const emailUpdate = document.getElementById("email-update").value;
      const nidnUpdate = document.getElementById("nidn-update").value;
      const siklusDropdownUpdate = document.getElementById("idSiklus-update");
      const usernameUpdate = document.getElementById("username-update").value;
      // getJenjangAllUpdate(prodiData.jenjangData);
      const jenjangDropdownUpdate = document.getElementById("jenjang-update");
      const jenjangValue = jenjangDropdownUpdate.value;

      // Mendapatkan file gambar yang akan diunggah
      const fotoInput = document.getElementById("fotoInput-update");
      const fotoFile = fotoInput.files[0];
      const dataprodiToUpdate = {
        prodi: prodiUpdate,
        idFakultas: parseInt(fakultasDropdownUpdate.value),
        niknip: niknipUpdate,
        telp: telpUpdate,
        email: emailUpdate,
        jenjang: jenjangValue,
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
          dataprodiToUpdate.foto.fileName = fotoFile.name;
          dataprodiToUpdate.foto.fileType = fotoFile.type;
          dataprodiToUpdate.foto.payload = reader.result.split(",")[1];

          // Hide modal ketika sudah selesai isi
          $("#new-member-update").modal("hide");

          // Tampilkan SweetAlert konfirmasi sebelum mengirim permintaan
          Swal.fire({
            title: "Update Data prodi?",
            text: "Apakah Anda yakin ingin mengupdate data prodi ini?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Ya, Update",
            cancelButtonText: "Batal",
          }).then((result) => {
            if (result.isConfirmed) {
              // Kirim permintaan PUT/UPDATE ke server dengan gambar
              sendUpdateRequestWithImage(id_prodi, dataprodiToUpdate, modal);
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
          title: "Update Data prodi?",
          text: "Apakah Anda yakin ingin mengupdate data prodi ini?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Ya, Update",
          cancelButtonText: "Batal",
        }).then((result) => {
          if (result.isConfirmed) {
            // Kirim permintaan PUT/UPDATE ke server tanpa gambar
            sendUpdateRequestWithoutImage(id_prodi, dataprodiToUpdate, modal);
          }
        });
      }
    });

    // Fungsi untuk mengirim permintaan PUT/UPDATE dengan gambar
    function sendUpdateRequestWithImage(id_prodi, dataprodiToUpdate, modal) {
      const apiUrlprodiUpdate = `https://simbe-dev.ulbi.ac.id/api/v1/prodi/update?id_prodi_unit=${id_prodi}`;

      CihuyUpdateApi(
        apiUrlprodiUpdate,
        token,
        dataprodiToUpdate,
        (error, responseText) => {
          if (error) {
            console.error(
              "Terjadi kesalahan saat mengupdate data prodi:",
              error
            );
            // Menampilkan pesan kesalahan
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Terjadi kesalahan saat mengupdate data prodi.",
            });
          } else {
            console.log("Respon sukses:", responseText);
            // Menutup modal edit
            modal.hide();
            // Menampilkan pesan sukses
            Swal.fire({
              icon: "success",
              title: "Sukses!",
              text: "Data prodi berhasil diperbarui.",
              showConfirmButton: false,
              timer: 1500,
            }).then(() => {
              // Refresh halaman atau lakukan tindakan lain jika diperlukan
              // window.location.reload();
            });
          }
        }
      );
    }

    // Fungsi untuk mengirim permintaan PUT/UPDATE tanpa gambar
    function sendUpdateRequestWithoutImage(id_prodi, dataprodiToUpdate, modal) {
      // Hapus properti foto dari dataprodiToUpdate
      delete dataprodiToUpdate.foto;

      const apiUrlprodiUpdate = `https://simbe-dev.ulbi.ac.id/api/v1/prodi/update?idprodi=${id_prodi}`;

      CihuyUpdateApi(
        apiUrlprodiUpdate,
        token,
        dataprodiToUpdate,
        (error, responseText) => {
          if (error) {
            console.error(
              "Terjadi kesalahan saat mengupdate data prodi:",
              error
            );
            // Menampilkan pesan kesalahan
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Terjadi kesalahan saat mengupdate data prodi.",
            });
          } else {
            console.log("Respon sukses:", responseText);
            // Menutup modal edit
            modal.hide();
            // Menampilkan pesan sukses
            Swal.fire({
              icon: "success",
              title: "Sukses!",
              text: "Data prodi berhasil diperbarui.",
              showConfirmButton: false,
              timer: 1500,
            }).then(() => {
              // Refresh halaman atau lakukan tindakan lain jika diperlukan
              // window.location.reload();
            });
          }
        }
      );
    }
  });
}
