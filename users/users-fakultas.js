import {
  CihuyDataAPI,
  CihuyPostApi,
  CihuyDeleteAPI,
  CihuyUpdateApi,
} from "https://c-craftjs.github.io/simpelbi/api.js";
import {
  token,
  UrlGetUsersFakultas,
  UrlPostUsersFakultas,
} from "../js/template/template.js";
// import { addFormFakultas } from "./fakultas/add.js";
import { populateUserProfile } from "https://c-craftjs.github.io/simpelbi/profile.js";
import { CihuyPaginations2 } from "https://c-craftjs.github.io/simpelbi/pagenations.js";

// Untuk GET Data Profile
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
          ${item.dekan}
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
         <div class="userDatatable-content">
         <img src="https://simbe-dev.ulbi.ac.id/static/pictures/${item.foto}" alt="Foto" width="100" height="100">
         </div>
      </td>
    <td>
       <ul class="orderDatatable_actions mb-0 d-flex flex-wrap">

          <li>
             <a href="#" class="edit"  data-target="#new-member-update" data-fakultas-id="${item.id_fakultas}">
                <i class="uil uil-edit"></i>
             </a>
          </li>
          <li>
            <a href="#" class="remove" data-fakultas-id="${item.id_fakultas}">
               <i class="uil uil-trash-alt"></i>
            </a>
          </li>
       </ul>
    </td>
    `;

    const removeButton = barisBaru.querySelector(".remove");
    removeButton.addEventListener("click", () => {
      const id_fakultas = removeButton.getAttribute("data-fakultas-id");
      if (id_fakultas) {
        deletefakultas(id_fakultas);
      } else {
        console.error("ID fakultas tidak ditemukan.");
      }
    });
    const editButton = barisBaru.querySelector(".edit");
    editButton.addEventListener("click", () => {
      const id_fakultas = editButton.getAttribute("data-fakultas-id");
      if (id_fakultas) {
        editData(id_fakultas);
      } else {
        console.error("ID fakultas tidak ditemukan.");
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
CihuyDataAPI(UrlGetUsersFakultas, token, (error, response) => {
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
// function ShowDataUsersFakultas(data) {
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
//           ${item.dekan}
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
//          <div class="userDatatable-content">
//          <img src="https://simbe-dev.ulbi.ac.id/static/pictures/${item.foto}" alt="Foto" width="100" height="100">
//          </div>
//       </td>
//     <td>
//        <ul class="orderDatatable_actions mb-0 d-flex flex-wrap">

//           <li>
//              <a href="#" class="edit"  data-target="#new-member-update" data-fakultas-id="${item.id_fakultas}">
//                 <i class="uil uil-edit"></i>
//              </a>
//           </li>
//           <li>
//             <a href="#" class="remove" data-fakultas-id="${item.id_fakultas}">
//                <i class="uil uil-trash-alt"></i>
//             </a>
//           </li>
//        </ul>
//     </td>
//     `;
// const removeButton = barisBaru.querySelector(".remove");
// removeButton.addEventListener("click", () => {
//   const id_fakultas = removeButton.getAttribute("data-fakultas-id");
//   if (id_fakultas) {
//     deletefakultas(id_fakultas);
//   } else {
//     console.error("ID fakultas tidak ditemukan.");
//   }
// });
// const editButton = barisBaru.querySelector(".edit");
// editButton.addEventListener("click", () => {
//   const id_fakultas = editButton.getAttribute("data-fakultas-id");
//   if (id_fakultas) {
//     editData(id_fakultas);
//   } else {
//     console.error("ID fakultas tidak ditemukan.");
//   }
// });

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

// fungsi post data

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

// Handle form submission when the "Tambah Data fakultas" button is clicked
const tambahDatafakultasButton = document.getElementById(
  "tambahDatafakultasButton"
);
tambahDatafakultasButton.addEventListener("click", function (e) {
  e.preventDefault();

  // Get data from form elements
  const fakultas = document.getElementById("fakultas").value;
  const dekan = document.getElementById("dekan").value;
  const nidn = document.getElementById("nidn").value;
  const niknip = document.getElementById("niknip").value;
  const telepon = document.getElementById("telp").value;
  const email = document.getElementById("email").value;
  const username = document.getElementById("username").value;

  const fotoInput = document.getElementById("fotoInput").files[0];

  // Convert the selected image to base64
  getBase64Image(fotoInput, function (base64Image) {
    if (base64Image === null) {
      console.error("Terjadi kesalahan saat mengonversi gambar.");
    } else {
      // Create an object with fakultas data including the base64 image
      const data = {
        fakultas: fakultas,
        dekan: dekan,
        nidn: nidn,
        niknip: niknip,
        telp: telepon,
        email: email,
        user_name: username,

        foto: {
          // fileName: fotoInput.name,
          fileType: fotoInput.type,
          payload: base64Image,
        },
      };

      $("#new-member").modal("hide");

      // Show a confirmation SweetAlert
      Swal.fire({
        title: "Tambahkan Data fakultas?",
        text: "Apakah Anda yakin ingin menambahkan data fakultas ini?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Ya, Tambahkan",
        cancelButtonText: "Batal",
      }).then((result) => {
        if (result.isConfirmed) {
          // Send the fakultas data to the server using the sendfakultasData function
          sendfakultasData(data, UrlpostUsersFakultas, token);
        }
      });
    }
  });
});
const UrlpostUsersFakultas = "https://simbe-dev.ulbi.ac.id/api/v1/fakultas/add";
// Fungsi untuk mengirim permintaan POST dengan data fakultas
function sendfakultasData(data, UrlpostUsersFakultas, token) {
  CihuyPostApi(UrlpostUsersFakultas, token, data)
    .then((responseText) => {
      console.log("Respon sukses:", responseText);
      // Menampilkan pesan sukses
      Swal.fire({
        icon: "success",
        title: "Sukses!",
        text: "Data fakultas berhasil ditambahkan.",
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
        text: "Terjadi kesalahan saat menambahkan data fakultas.",
      });
    });
}

// fungsi edit

function getfakultasDataById(id_fakultas, callback) {
  const getfakultasDataById = `https://simbe-dev.ulbi.ac.id/api/v1/fakultas/get?idfakultas=${id_fakultas}`;

  CihuyDataAPI(getfakultasDataById, token, (error, response) => {
    if (error) {
      console.error("Terjadi kesalahan saat mengambil fakultas:", error);
      callback(error, null);
    } else {
      const fakultasData = response.data;
      callback(null, fakultasData);
    }
  });
}

// fungsi edit
// Fungsi untuk mengisi dropdown "Fakultas di form Update"

function editData(id_fakultas) {
  getfakultasDataById(id_fakultas, (error, fakultasData) => {
    if (error) {
      console.error("Gagal mengambil data fakultas:", error);
      return;
    }

    // Mengisi formulir edit dengan data fakultas yang diperoleh

    document.getElementById("dekan-update").value = fakultasData.dekan;
    document.getElementById("niknip-update").value = fakultasData.niknip;
    document.getElementById("telp-update").value = fakultasData.telp;
    document.getElementById("email-update").value = fakultasData.email;
    document.getElementById("nidn-update").value = fakultasData.nidn;
    document.getElementById("username-update").value = fakultasData.user_name;
    document.getElementById("fakultas-update").value = fakultasData.fakultas;

    // Mengatur nilai input fakultas dalam formulir
    // Menampilkan modal edit
    const modal = new bootstrap.Modal(
      document.getElementById("new-member-update")
    );
    modal.show();

    // Mengatur event listener untuk tombol "Simpan Perubahan"
    const simpanPerubahanButton = document.getElementById("updateDataButton");
    simpanPerubahanButton.addEventListener("click", function () {
      const fakultasUpdate = document.getElementById("fakultas-update").value;
      const niknipUpdate = document.getElementById("niknip-update").value;
      const telpUpdate = document.getElementById("telp-update").value;
      const emailUpdate = document.getElementById("email-update").value;
      const nidnUpdate = document.getElementById("nidn-update").value;
      const dekanUpdate = document.getElementById("dekan-update").value;
      const usernameUpdate = document.getElementById("username-update").value;

      // Mendapatkan file gambar yang akan diunggah
      const fotoInput = document.getElementById("fotoInput-update");
      const fotoFile = fotoInput.files[0];
      const datafakultasToUpdate = {
        fakultas: fakultasUpdate,
        niknip: niknipUpdate,
        telp: telpUpdate,
        email: emailUpdate,
        nidn: nidnUpdate,
        dekan: dekanUpdate,
        user_name: usernameUpdate,
        foto: {
          fileName: "", // Nama file gambar yang diunggah
          fileType: "image/jpeg", // Tipe file gambar
          payload: "", // Base64 gambar
        },
      };

      if (fotoFile) {
        // Jika ada perubahan pada gambar, maka proses gambar dan kirim dengan gambar
        const reader = new FileReader();
        reader.onload = function () {
          datafakultasToUpdate.foto.fileName = fotoFile.name;
          datafakultasToUpdate.foto.fileType = fotoFile.type;
          datafakultasToUpdate.foto.payload = reader.result.split(",")[1];

          // Hide modal ketika sudah selesai isi
          $("#new-member-update").modal("hide");

          // Tampilkan SweetAlert konfirmasi sebelum mengirim permintaan
          Swal.fire({
            title: "Update Data fakultas?",
            text: "Apakah Anda yakin ingin mengupdate data fakultas ini?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Ya, Update",
            cancelButtonText: "Batal",
          }).then((result) => {
            if (result.isConfirmed) {
              // Kirim permintaan PUT/UPDATE ke server dengan gambar
              sendUpdateRequestWithImage(
                id_fakultas,
                datafakultasToUpdate,
                modal
              );
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
          title: "Update Data fakultas?",
          text: "Apakah Anda yakin ingin mengupdate data fakultas ini?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Ya, Update",
          cancelButtonText: "Batal",
        }).then((result) => {
          if (result.isConfirmed) {
            // Kirim permintaan PUT/UPDATE ke server tanpa gambar
            sendUpdateRequestWithoutImage(
              id_fakultas,
              datafakultasToUpdate,
              modal
            );
          }
        });
      }
    });

    // Fungsi untuk mengirim permintaan PUT/UPDATE dengan gambar
    function sendUpdateRequestWithImage(
      id_fakultas,
      datafakultasToUpdate,
      modal
    ) {
      const apiUrlfakultasUpdate = `https://simbe-dev.ulbi.ac.id/api/v1/fakultas/update?idfakultas=${id_fakultas}`;

      CihuyUpdateApi(
        apiUrlfakultasUpdate,
        token,
        datafakultasToUpdate,
        (error, responseText) => {
          if (error) {
            console.error(
              "Terjadi kesalahan saat mengupdate data fakultas:",
              error
            );
            // Menampilkan pesan kesalahan
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Terjadi kesalahan saat mengupdate data fakultas.",
            });
          } else {
            console.log("Respon sukses:", responseText);
            // Menutup modal edit
            modal.hide();
            // Menampilkan pesan sukses
            Swal.fire({
              icon: "success",
              title: "Sukses!",
              text: "Data fakultas berhasil diperbarui.",
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
      id_fakultas,
      datafakultasToUpdate,
      modal
    ) {
      // Hapus properti foto dari datafakultasToUpdate
      delete datafakultasToUpdate.foto;

      const apiUrlfakultasUpdate = `https://simbe-dev.ulbi.ac.id/api/v1/fakultas/update?idfakultas=${id_fakultas}`;

      CihuyUpdateApi(
        apiUrlfakultasUpdate,
        token,
        datafakultasToUpdate,
        (error, responseText) => {
          if (error) {
            console.error(
              "Terjadi kesalahan saat mengupdate data fakultas:",
              error
            );
            // Menampilkan pesan kesalahan
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Terjadi kesalahan saat mengupdate data fakultas.",
            });
          } else {
            console.log("Respon sukses:", responseText);
            // Menutup modal edit
            modal.hide();
            // Menampilkan pesan sukses
            Swal.fire({
              icon: "success",
              title: "Sukses!",
              text: "Data fakultas berhasil diperbarui.",
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

// Untuk Get Data dari API
CihuyDataAPI(UrlGetUsersFakultas, token, (error, response) => {
  if (error) {
    console.error("Terjadi kesalahan:", error);
  } else {
    const data = response.data;
    console.log("Data yang diterima:", data);
    // ShowDataUsersFakultas(data);
    // CihuyPagination(data, itemsPerPage, "content", dataProsesAudit);
  }
});

function deletefakultas(id_fakultas) {
  // Tampilkan dialog konfirmasi menggunakan SweetAlert2
  Swal.fire({
    title: "Apakah Anda yakin ingin menghapus fakultas?",
    text: "Penghapusan fakultas akan permanen.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Ya, Hapus",
    cancelButtonText: "Tidak, Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      // Buat URL untuk mengambil fakultas berdasarkan ID
      const apiUrlGetfakultasById = `https://simbe-dev.ulbi.ac.id/api/v1/fakultas/get?idfakultas=${id_fakultas}`;

      // Lakukan permintaan GET untuk mengambil fakultas berdasarkan ID fakultas
      CihuyDataAPI(apiUrlGetfakultasById, token, (error, response) => {
        if (error) {
          console.error("Terjadi kesalahan saat mengambil fakultas:", error);
        } else {
          const fakultasData = response.data;
          if (fakultasData) {
            // Dapatkan ID fakultas dari data yang diterima
            const fakultasId = fakultasData.id_fakultas;

            // Buat URL untuk menghapus fakultas berdasarkan ID fakultas yang telah ditemukan
            const apiUrlfakultasDelete = `https://simbe-dev.ulbi.ac.id/api/v1/fakultas/delete?idfakultas=${fakultasId}`;

            // Lakukan permintaan DELETE untuk menghapus fakultas
            CihuyDeleteAPI(
              apiUrlfakultasDelete,
              token,
              (deleteError, deleteData) => {
                if (deleteError) {
                  console.error(
                    "Terjadi kesalahan saat menghapus fakultas:",
                    deleteError
                  );
                  Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Terjadi kesalahan saat menghapus fakultas!",
                  });
                } else {
                  console.log("fakultas berhasil dihapus:", deleteData);
                  Swal.fire({
                    icon: "success",
                    title: "Sukses!",
                    text: "fakultas berhasil dihapus.",
                  }).then(() => {
                    // Refresh halaman setelah menutup popup
                    window.location.reload();
                  });
                }
              }
            );
          } else {
            console.error("Data fakultas tidak ditemukan.");
          }
        }
      });
    } else {
      // Tampilkan pesan bahwa penghapusan dibatalkan
      Swal.fire("Dibatalkan", "Penghapusan fakultas dibatalkan.", "info");
    }
  });
}

//fungsi print

function exportToExcel(data, filename) {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(workbook, worksheet, "AMI Data");
  XLSX.writeFile(workbook, filename);
}

// Function untuk mengekspor data ke CSV
function exportToCSV(data, filename) {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const csvURL = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = csvURL;
  link.setAttribute("download", filename + ".csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Function untuk mencetak data
function printData(data) {
  let printContent = `
    <h1>Data Fakultas Admin</h1>
    <table border="1">
      <thead>
        <tr>
        <th>
         <span class="userDatatable-title">Fakultas</span>
                        </th>
                <th>
           <span class="userDatatable-title">Dekan</span>
            </th>
              <th>
           <span class="userDatatable-title">NIDN</span>
                          </th>
           <th data-type="html" data-name="position">
           <th data-type="html" data-name="position">
             <span class="userDatatable-title">NIP</span>
           </th>
           <th>
             <span class="userDatatable-title"
               >No Telepon</span
             >
           </th>
           <th data-type="html" data-name="status">
             <span class="userDatatable-title">Email</span>
           </th>
           <th>
             <span class="userDatatable-title">Foto</span>
           </th>
        </tr>
      </thead>
      <tbody>
  `;

  data.forEach((item, index) => {
    printContent += `
      <tr>
        <td>${index + 1}</td>
        
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
           ${item.dekan}
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
          <div class="userDatatable-content">
          <img src="https://simbe-dev.ulbi.ac.id/static/pictures/${
            item.foto
          }" alt="Foto" width="100" height="100">
          </div>
       </td>
      </tr>
    `;
  });

  printContent += `
      </tbody>
    </table>
  `;

  const printWindow = window.open("", "_blank");
  printWindow.document.write(`
    <html>
      <head>
        <title>Users Fakultas Data - Cetak</title>
        <style>
          table {
            border-collapse: collapse;
            width: 100%;
          }
          th, td {
            border: 1px solid #dddddd;
            text-align: left;
            padding: 8px;
          }
          h1 {
            text-align: center;
          }
        </style>
      </head>
      <body>
        ${printContent}
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.print();
}

// Function untuk mendapatkan dan memproses data AMI
function processDataAndExport(exportType, filename) {
  CihuyDataAPI(UrlGetUsersFakultas, token, (error, response) => {
    if (error) {
      console.error("Terjadi kesalahan:", error);
    } else {
      const data = response.data;
      console.log("Data yang diterima:", data);

      // Panggil fungsi sesuai dengan jenis ekspor yang diinginkan
      switch (exportType) {
        case "excel":
          exportToExcel(data, filename + ".xlsx");
          break;
        case "csv":
          exportToCSV(data, filename);
          break;
        case "print":
          printData(data);
          break;
        default:
          console.error("Jenis ekspor tidak valid");
      }
    }
  });
}

// Panggil fungsi ini ketika tombol Ekspor Excel diklik
document.getElementById("exportexcel").addEventListener("click", function () {
  processDataAndExport("excel", "adminFakultas_export");
});

// Panggil fungsi ini ketika tombol Ekspor CSV diklik
document.getElementById("exportcsv").addEventListener("click", function () {
  processDataAndExport("csv", "adminFakultas_export");
});

// Panggil fungsi ini ketika tombol Cetak diklik
document.getElementById("print").addEventListener("click", function () {
  processDataAndExport("print");
});
